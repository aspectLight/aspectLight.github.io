import {
  BufferGeometry,
  Color,
  BufferAttribute,
  LineBasicMaterial,
  LineSegments,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from 'three';

import { createAmbientLayer, poseAmbientLayer, recolorAmbientLayer } from './background-3d.ambient';
import type { AmbientLayer } from './background-3d.ambient';
import {
  BOB_HEIGHT,
  BOB_SPEED,
  CAMERA_DISTANCE,
  CAMERA_FAR,
  CAMERA_FIELD_OF_VIEW,
  CAMERA_NEAR,
  LINE_OPACITY,
  MAX_FRAME_SECONDS,
  MAX_PIXEL_RATIO,
  MORPH_EPSILON,
  PORTRAIT_SCALE,
  ROLL_ANGLE,
  ROLL_SPEED,
  SCROLL_LAG_SECONDS,
  SCROLL_RISE,
  SCROLL_SPIN_TURNS,
  SHAPE_SEQUENCE,
  SHAPE_TILT,
  SWAY_ANGLE,
  SWAY_SPEED,
  TURN_ANGLE,
  TURN_SPEED,
} from './background-3d.constants';
import { readScrollProgress, writeMorph } from './background-3d.morph';
import { buildMorphTargets } from './background-3d.shapes';

const ACCENT_PROPERTY = '--color-accent';
const DARK_SCHEME_QUERY = '(prefers-color-scheme: dark)';
const READY_ATTRIBUTE = 'data-background-ready';
const MS_PER_SECOND = 1000;
const FULL_TURN = Math.PI * 2;

interface BackgroundScene {
  readonly doc: Document;
  readonly renderer: WebGLRenderer;
  readonly scene: Scene;
  readonly camera: PerspectiveCamera;
  readonly shape: LineSegments<BufferGeometry, LineBasicMaterial>;
  readonly positions: BufferAttribute;
  /** The array behind `positions` (BufferAttribute keeps the reference; the Float32 variant would copy it). */
  readonly vertices: Float32Array;
  readonly targets: readonly Float32Array[];
  readonly ambient: AmbientLayer;
  /** Scroll progress the morph is currently drawn at; it trails the real one. */
  shownProgress: number;
  /** Seconds of animation so far; drives the idle spin, sway and bob. */
  elapsed: number;
  lastFrameTime: number | undefined;
}

function readAccentColor(doc: Document): Color {
  const value = getComputedStyle(doc.documentElement).getPropertyValue(ACCENT_PROPERTY).trim();
  return new Color(value);
}

interface Shape {
  readonly shape: LineSegments<BufferGeometry, LineBasicMaterial>;
  readonly positions: BufferAttribute;
  readonly vertices: Float32Array;
}

function createShape(targets: readonly Float32Array[], color: Color): Shape {
  const vertices = new Float32Array(targets[0] ?? []);
  const positions = new BufferAttribute(vertices, 3);
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', positions);
  const material = new LineBasicMaterial({
    color,
    transparent: true,
    opacity: LINE_OPACITY,
    depthWrite: false,
  });
  return { shape: new LineSegments(geometry, material), positions, vertices };
}

function createScene(canvas: HTMLCanvasElement, doc: Document): BackgroundScene {
  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO));
  const camera = new PerspectiveCamera(CAMERA_FIELD_OF_VIEW, 1, CAMERA_NEAR, CAMERA_FAR);
  camera.position.z = CAMERA_DISTANCE;
  const color = readAccentColor(doc);
  const targets = buildMorphTargets(SHAPE_SEQUENCE);
  const { shape, positions, vertices } = createShape(targets, color);
  const ambient = createAmbientLayer(color);
  const scene = new Scene();
  scene.add(shape, ambient.group);
  return {
    doc,
    renderer,
    scene,
    camera,
    shape,
    positions,
    vertices,
    targets,
    ambient,
    shownProgress: Number.NaN,
    elapsed: 0,
    lastFrameTime: undefined,
  };
}

function resize(background: BackgroundScene): void {
  const { innerWidth: width, innerHeight: height } = window;
  background.renderer.setSize(width, height, false);
  background.camera.aspect = width / height;
  background.camera.updateProjectionMatrix();
  const scale = width < height ? PORTRAIT_SCALE : 1;
  background.shape.scale.setScalar(scale);
  background.ambient.group.scale.setScalar(scale);
}

function recolor(background: BackgroundScene): void {
  const color = readAccentColor(background.doc);
  background.shape.material.color.copy(color);
  recolorAmbientLayer(background.ambient, color);
}

/** Redraws the morph only when it has visibly moved. */
function morphTo(background: BackgroundScene, progress: number): void {
  if (Math.abs(progress - background.shownProgress) < MORPH_EPSILON) {
    return;
  }
  background.shownProgress = progress;
  writeMorph(background.vertices, background.targets, progress);
  background.positions.needsUpdate = true;
}

/** Idle drift plus a turn and rise tied to how far down the page the reader is. */
function poseShape(background: BackgroundScene): void {
  const { elapsed, shownProgress: progress } = background;
  background.shape.rotation.set(
    SHAPE_TILT * (1 - progress) + Math.sin(elapsed * SWAY_SPEED) * SWAY_ANGLE,
    Math.sin(elapsed * TURN_SPEED) * TURN_ANGLE + progress * SCROLL_SPIN_TURNS * FULL_TURN,
    Math.cos(elapsed * ROLL_SPEED) * ROLL_ANGLE,
  );
  background.shape.position.y = Math.sin(elapsed * BOB_SPEED) * BOB_HEIGHT + progress * SCROLL_RISE;
}

function render(background: BackgroundScene): void {
  poseShape(background);
  poseAmbientLayer(background.ambient, background.elapsed);
  background.renderer.render(background.scene, background.camera);
}

/** Frame-rate independent easing toward the scroll position. */
function catchUp(current: number, target: number, seconds: number): number {
  if (Number.isNaN(current)) {
    return target;
  }
  return current + (target - current) * (1 - Math.exp(-seconds / SCROLL_LAG_SECONDS));
}

function animate(background: BackgroundScene, time: number): void {
  const last = background.lastFrameTime;
  background.lastFrameTime = time;
  const seconds =
    last === undefined ? 0 : Math.min((time - last) / MS_PER_SECOND, MAX_FRAME_SECONDS);
  background.elapsed += seconds;
  const target = readScrollProgress(background.doc);
  morphTo(background, catchUp(background.shownProgress, target, seconds));
  render(background);
}

function startMotion(background: BackgroundScene): void {
  const run = (): void => {
    background.lastFrameTime = undefined;
    background.renderer.setAnimationLoop((time) => {
      animate(background, time);
    });
  };
  background.doc.addEventListener('visibilitychange', () => {
    if (background.doc.hidden) {
      background.renderer.setAnimationLoop(null);
    } else {
      run();
    }
  });
  run();
}

/** Reduced motion: no drift and no lag; the shape simply matches the scroll position. */
function startStill(background: BackgroundScene): void {
  const draw = (): void => {
    morphTo(background, readScrollProgress(background.doc));
    render(background);
  };
  window.addEventListener('scroll', draw, { passive: true });
  window.addEventListener('resize', draw);
  window.matchMedia(DARK_SCHEME_QUERY).addEventListener('change', draw);
  draw();
}

/**
 * Draws one wireframe behind the page that morphs through SHAPE_SEQUENCE as
 * the reader scrolls (hexagon torus, neural networks, hexagon sphere, cat),
 * trailing the scroll slightly so the change feels fluid, inside slowly
 * turning orbit rings and dust.
 */
export function startBackgroundScene(
  canvas: HTMLCanvasElement,
  doc: Document,
  prefersReducedMotion: boolean,
): void {
  const background = createScene(canvas, doc);
  resize(background);
  window.addEventListener('resize', () => {
    resize(background);
  });
  window.matchMedia(DARK_SCHEME_QUERY).addEventListener('change', () => {
    recolor(background);
  });
  if (prefersReducedMotion) {
    startStill(background);
  } else {
    startMotion(background);
  }
  canvas.setAttribute(READY_ATTRIBUTE, '');
}
