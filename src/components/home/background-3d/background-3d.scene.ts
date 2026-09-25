import {
  BufferGeometry,
  Color,
  Float32BufferAttribute,
  Group,
  LineBasicMaterial,
  LineSegments,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from 'three';

import { HERO_ELEMENT_ID, SECTION_ORDER } from '@core/constants/site.constants';
import { watchCurrentSection } from '@core/sections/watch-current-section';
import { createAmbientLayer } from './background-3d.ambient';
import type { AmbientLayer } from './background-3d.ambient';
import { BackgroundShape } from './background-3d.enum';
import {
  AMBIENT_ROTATION_RATIO,
  CAMERA_DISTANCE,
  CAMERA_FAR,
  CAMERA_FIELD_OF_VIEW,
  CAMERA_NEAR,
  FADE_SPEED,
  HERO_SHAPE,
  LINE_OPACITY,
  MAX_FRAME_SECONDS,
  MAX_PIXEL_RATIO,
  ROTATION_SPEED,
  SHAPE_BY_SECTION,
  SHAPE_TILT,
} from './background-3d.constants';
import { buildShapePositions } from './background-3d.shapes';

const ACCENT_PROPERTY = '--color-accent';
const DARK_SCHEME_QUERY = '(prefers-color-scheme: dark)';
const MS_PER_SECOND = 1000;

interface BackgroundScene {
  readonly renderer: WebGLRenderer;
  readonly scene: Scene;
  readonly camera: PerspectiveCamera;
  readonly group: Group;
  readonly ambient: AmbientLayer;
  readonly layers: ReadonlyMap<BackgroundShape, LineSegments<BufferGeometry, LineBasicMaterial>>;
  activeShape: BackgroundShape;
  /** Timestamp of the previous animation frame; undefined right after (re)starting. */
  lastFrameTime: number | undefined;
}

function readAccentColor(doc: Document): Color {
  const value = getComputedStyle(doc.documentElement).getPropertyValue(ACCENT_PROPERTY).trim();
  return new Color(value);
}

function createLayer(
  shape: BackgroundShape,
  color: Color,
): LineSegments<BufferGeometry, LineBasicMaterial> {
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(buildShapePositions(shape), 3));
  const material = new LineBasicMaterial({
    color,
    transparent: true,
    opacity: 0,
    depthWrite: false,
  });
  const layer = new LineSegments(geometry, material);
  layer.visible = false;
  return layer;
}

function createScene(canvas: HTMLCanvasElement, doc: Document): BackgroundScene {
  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO));
  const camera = new PerspectiveCamera(CAMERA_FIELD_OF_VIEW, 1, CAMERA_NEAR, CAMERA_FAR);
  camera.position.z = CAMERA_DISTANCE;
  const group = new Group();
  group.rotation.x = SHAPE_TILT;
  const color = readAccentColor(doc);
  const layers = new Map(
    Object.values(BackgroundShape).map((shape) => [shape, createLayer(shape, color)] as const),
  );
  layers.forEach((layer) => group.add(layer));
  const scene = new Scene();
  scene.add(group);
  const ambient = createAmbientLayer(color);
  ambient.group.rotation.x = SHAPE_TILT;
  scene.add(ambient.group);
  return {
    renderer,
    scene,
    camera,
    group,
    ambient,
    layers,
    activeShape: HERO_SHAPE,
    lastFrameTime: undefined,
  };
}

function resize(background: BackgroundScene): void {
  const { innerWidth: width, innerHeight: height } = window;
  background.renderer.setSize(width, height, false);
  background.camera.aspect = width / height;
  background.camera.updateProjectionMatrix();
}

function recolor(background: BackgroundScene, doc: Document): void {
  const color = readAccentColor(doc);
  background.layers.forEach((layer) => layer.material.color.copy(color));
  background.ambient.materials.forEach((material) => material.color.copy(color));
}

/** Moves every layer's opacity toward its target; a step of Infinity snaps it. */
function fadeLayers(background: BackgroundScene, step: number): void {
  background.layers.forEach((layer, shape) => {
    const target = shape === background.activeShape ? LINE_OPACITY : 0;
    const current = layer.material.opacity;
    const next =
      current < target ? Math.min(target, current + step) : Math.max(target, current - step);
    layer.material.opacity = next;
    layer.visible = next > 0;
  });
}

function renderFrame(background: BackgroundScene): void {
  background.renderer.render(background.scene, background.camera);
}

function animate(background: BackgroundScene, time: number): void {
  const elapsed =
    background.lastFrameTime === undefined ? 0 : (time - background.lastFrameTime) / MS_PER_SECOND;
  background.lastFrameTime = time;
  const seconds = Math.min(elapsed, MAX_FRAME_SECONDS);
  fadeLayers(background, FADE_SPEED * LINE_OPACITY * seconds);
  background.group.rotation.y += ROTATION_SPEED * seconds;
  background.ambient.group.rotation.y += ROTATION_SPEED * AMBIENT_ROTATION_RATIO * seconds;
  renderFrame(background);
}

function trackedElements(doc: Document): Map<Element, BackgroundShape> {
  const tracked = new Map<Element, BackgroundShape>();
  const hero = doc.getElementById(HERO_ELEMENT_ID);
  if (hero !== null) {
    tracked.set(hero, HERO_SHAPE);
  }
  SECTION_ORDER.forEach((sectionId) => {
    const section = doc.getElementById(sectionId);
    if (section !== null) {
      tracked.set(section, SHAPE_BY_SECTION[sectionId]);
    }
  });
  return tracked;
}

function followCurrentSection(doc: Document, onShape: (shape: BackgroundShape) => void): void {
  const tracked = trackedElements(doc);
  watchCurrentSection(doc, [...tracked.keys()], (element) => {
    const shape = tracked.get(element);
    if (shape !== undefined) {
      onShape(shape);
    }
  });
}

function startMotion(background: BackgroundScene, doc: Document): void {
  const run = (): void => {
    background.lastFrameTime = undefined;
    background.renderer.setAnimationLoop((time) => {
      animate(background, time);
    });
  };
  doc.addEventListener('visibilitychange', () => {
    if (doc.hidden) {
      background.renderer.setAnimationLoop(null);
    } else {
      run();
    }
  });
  run();
}

/**
 * Draws a slowly turning wireframe behind the page that cross-fades to a new
 * shape as each section scrolls into the middle of the viewport. With reduced
 * motion the shape swaps without fading and never rotates.
 */
export function startBackgroundScene(
  canvas: HTMLCanvasElement,
  doc: Document,
  prefersReducedMotion: boolean,
): void {
  const background = createScene(canvas, doc);
  const redrawStill = (): void => {
    fadeLayers(background, Number.POSITIVE_INFINITY);
    renderFrame(background);
  };
  resize(background);
  window.addEventListener('resize', () => {
    resize(background);
    if (prefersReducedMotion) {
      renderFrame(background);
    }
  });
  window.matchMedia(DARK_SCHEME_QUERY).addEventListener('change', () => {
    recolor(background, doc);
    if (prefersReducedMotion) {
      renderFrame(background);
    }
  });
  followCurrentSection(doc, (shape) => {
    background.activeShape = shape;
    if (prefersReducedMotion) {
      redrawStill();
    }
  });
  if (prefersReducedMotion) {
    redrawStill();
  } else {
    startMotion(background, doc);
  }
}
