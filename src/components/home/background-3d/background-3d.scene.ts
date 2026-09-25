import type { CanvasTexture } from 'three';
import {
  BufferAttribute,
  BufferGeometry,
  Color,
  Group,
  LineBasicMaterial,
  LineLoop,
  LineSegments,
  PerspectiveCamera,
  Plane,
  Points,
  PointsMaterial,
  Raycaster,
  Scene,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three';

import { createAmbientLayer, poseAmbientLayer, recolorAmbientLayer } from './background-3d.ambient';
import type { AmbientLayer } from './background-3d.ambient';
import { createDotTexture } from './background-3d.dot';
import {
  BOB_HEIGHT,
  BOB_SPEED,
  CAMERA_DISTANCE,
  CAMERA_FAR,
  CAMERA_FIELD_OF_VIEW,
  CAMERA_NEAR,
  MAX_FRAME_SECONDS,
  MAX_PIXEL_RATIO,
  MAX_SAMPLES,
  NEURON_OPACITY,
  NEURON_SIZE,
  OUTLINE_OPACITY,
  PORTRAIT_SCALE,
  PULSE_COUNT,
  PULSE_OPACITY,
  PULSE_SIZE,
  QUERY_LINE_SECONDS,
  SWAY_ANGLE,
  SWAY_SPEED,
  SYNAPSE_OPACITY,
  TURN_ANGLE,
  TURN_SPEED,
} from './background-3d.constants';
import { buildCatNetwork } from './background-3d.network';
import { advancePulses, createPulseSystem, writePulsePositions } from './background-3d.pulses';
import type { PulseSystem } from './background-3d.pulses';
import {
  askProximity,
  createQueryState,
  isReconstructed,
  summarize,
} from './background-3d.queries';
import type { QueryState, QuerySummary } from './background-3d.queries';
import {
  createQueryLayer,
  fadeQueryLayer,
  recolorQueryLayer,
  showQuery,
} from './background-3d.query-layer';
import type { QueryLayer } from './background-3d.query-layer';
import type { CatNetwork, Point2, Point3 } from './background-3d.types';

const ACCENT_PROPERTY = '--color-accent';
const DARK_SCHEME_QUERY = '(prefers-color-scheme: dark)';
const READY_ATTRIBUTE = 'data-background-ready';
const MS_PER_SECOND = 1000;

/** Every material that takes the accent colour. */
type Tinted = LineBasicMaterial | PointsMaterial;

/** What every material is drawn with: the accent colour, and a round dot for points. */
interface Palette {
  readonly color: Color;
  readonly dot: CanvasTexture;
}

interface Pulses {
  readonly system: PulseSystem;
  readonly attribute: BufferAttribute;
  /** The array behind `attribute` (BufferAttribute keeps the reference). */
  readonly vertices: Float32Array;
}

interface BackgroundScene {
  readonly doc: Document;
  readonly renderer: WebGLRenderer;
  readonly scene: Scene;
  readonly camera: PerspectiveCamera;
  readonly cat: Group;
  readonly materials: readonly Tinted[];
  readonly ambient: AmbientLayer;
  readonly pulses: Pulses;
  readonly queries: QueryState;
  readonly queryLayer: QueryLayer;
  readonly isStill: boolean;
  /** Seconds of animation so far; drives the sway and bob. */
  elapsed: number;
  lastFrameTime: number | undefined;
}

function readAccentColor(doc: Document): Color {
  const value = getComputedStyle(doc.documentElement).getPropertyValue(ACCENT_PROPERTY).trim();
  return new Color(value);
}

function geometryOf(points: readonly Point3[]): BufferGeometry {
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new BufferAttribute(new Float32Array(points.flat()), 3));
  return geometry;
}

function lineMaterial(color: Color, opacity: number): LineBasicMaterial {
  return new LineBasicMaterial({ color, transparent: true, opacity, depthWrite: false });
}

function pointMaterial({ color, dot }: Palette, size: number, opacity: number): PointsMaterial {
  return new PointsMaterial({
    color,
    map: dot,
    size,
    transparent: true,
    opacity,
    depthWrite: false,
  });
}

function synapseSegments(network: CatNetwork): Point3[] {
  return network.synapses.flatMap(([from, to]) => {
    const start = network.neurons[from];
    const end = network.neurons[to];
    return start === undefined || end === undefined ? [] : [start, end];
  });
}

function createPulses(network: CatNetwork): Pulses {
  const vertices = new Float32Array(PULSE_COUNT * 3);
  return {
    system: createPulseSystem(network),
    attribute: new BufferAttribute(vertices, 3),
    vertices,
  };
}

/** The cat network and the materials it uses, so the accent colour can change later. */
function createCat(
  network: CatNetwork,
  pulses: Pulses,
  palette: Palette,
): { cat: Group; materials: Tinted[] } {
  const materials = {
    synapses: lineMaterial(palette.color, SYNAPSE_OPACITY),
    outline: lineMaterial(palette.color, OUTLINE_OPACITY),
    neurons: pointMaterial(palette, NEURON_SIZE, NEURON_OPACITY),
    pulses: pointMaterial(palette, PULSE_SIZE, PULSE_OPACITY),
  };
  const pulseGeometry = new BufferGeometry();
  pulseGeometry.setAttribute('position', pulses.attribute);
  const cat = new Group().add(
    new LineSegments(geometryOf(synapseSegments(network)), materials.synapses),
    new LineLoop(geometryOf(network.outline), materials.outline),
    new Points(geometryOf(network.neurons), materials.neurons),
    new Points(pulseGeometry, materials.pulses),
  );
  return { cat, materials: Object.values(materials) };
}

function createScene(canvas: HTMLCanvasElement, doc: Document, isStill: boolean): BackgroundScene {
  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO));
  const camera = new PerspectiveCamera(CAMERA_FIELD_OF_VIEW, 1, CAMERA_NEAR, CAMERA_FAR);
  camera.position.z = CAMERA_DISTANCE;
  const palette: Palette = { color: readAccentColor(doc), dot: createDotTexture(doc) };
  const network = buildCatNetwork();
  const pulses = createPulses(network);
  const { cat, materials } = createCat(network, pulses, palette);
  const outline = network.outline.map(([x, y]): Point2 => [x, y]);
  const queryLayer = createQueryLayer(outline.length, palette.color, palette.dot);
  cat.add(queryLayer.group);
  const ambient = createAmbientLayer(palette.color, palette.dot);
  const scene = new Scene();
  scene.add(cat, ambient.group);
  return {
    doc,
    renderer,
    scene,
    camera,
    cat,
    materials,
    ambient,
    pulses,
    queries: createQueryState(outline),
    queryLayer,
    isStill,
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
  background.cat.scale.setScalar(scale);
  background.ambient.group.scale.setScalar(scale);
}

function recolor(background: BackgroundScene): void {
  const color = readAccentColor(background.doc);
  background.materials.forEach((material) => material.color.copy(color));
  recolorAmbientLayer(background.ambient, color);
  recolorQueryLayer(background.queryLayer, color);
}

/** A slow sway and bob; the cat always faces roughly forward. */
function poseCat(background: BackgroundScene): void {
  const { elapsed } = background;
  background.cat.rotation.set(
    Math.sin(elapsed * SWAY_SPEED) * SWAY_ANGLE,
    Math.sin(elapsed * TURN_SPEED) * TURN_ANGLE,
    0,
  );
  background.cat.position.y = Math.sin(elapsed * BOB_SPEED) * BOB_HEIGHT;
}

function render(background: BackgroundScene): void {
  writePulsePositions(background.pulses.system, background.pulses.vertices);
  background.pulses.attribute.needsUpdate = true;
  poseCat(background);
  poseAmbientLayer(background.ambient, background.elapsed);
  background.renderer.render(background.scene, background.camera);
}

function animate(background: BackgroundScene, time: number): void {
  const last = background.lastFrameTime;
  background.lastFrameTime = time;
  const seconds =
    last === undefined ? 0 : Math.min((time - last) / MS_PER_SECOND, MAX_FRAME_SECONDS);
  background.elapsed += seconds;
  advancePulses(background.pulses.system, seconds);
  fadeQueryLayer(background.queryLayer, background.queries, seconds);
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

/** Where a click on the screen meets the cat's own plane, in the cat's coordinates. */
function toCatPlane(
  background: BackgroundScene,
  clientX: number,
  clientY: number,
): Point2 | undefined {
  const pointer = new Vector2(
    (clientX / window.innerWidth) * 2 - 1,
    -(clientY / window.innerHeight) * 2 + 1,
  );
  const raycaster = new Raycaster();
  raycaster.setFromCamera(pointer, background.camera);
  background.cat.updateMatrixWorld();
  const plane = new Plane(new Vector3(0, 0, 1), 0).applyMatrix4(background.cat.matrixWorld);
  const hit = raycaster.ray.intersectPlane(plane, new Vector3());
  if (hit === null) {
    return undefined;
  }
  const local = background.cat.worldToLocal(hit);
  return [local.x, local.y];
}

/**
 * Reduced motion: the answer appears at once and disappears at once a little
 * later, with no fade and no glow.
 */
function showStill(background: BackgroundScene): void {
  fadeQueryLayer(background.queryLayer, background.queries, 0);
  render(background);
  window.setTimeout(() => {
    fadeQueryLayer(background.queryLayer, background.queries, Number.POSITIVE_INFINITY);
    render(background);
  }, QUERY_LINE_SECONDS * MS_PER_SECOND);
}

function ask(
  background: BackgroundScene,
  clientX: number,
  clientY: number,
): QuerySummary | undefined {
  const point = toCatPlane(background, clientX, clientY);
  if (point === undefined) {
    return undefined;
  }
  const before = isReconstructed(summarize(background.queries));
  askProximity(background.queries, point, MAX_SAMPLES);
  const summary = summarize(background.queries);
  showQuery(background.queryLayer, background.queries, !before && isReconstructed(summary));
  if (background.isStill) {
    showStill(background);
  }
  return summary;
}

/** What the rest of the page may do with the running scene. */
export interface BackgroundHandle {
  /**
   * A proximity query at a screen position: the cat answers with the closest
   * point of its outline. Returns the running totals, or nothing if the click
   * missed the cat's plane.
   */
  readonly ask: (clientX: number, clientY: number) => QuerySummary | undefined;
}

/**
 * Draws the avatar's cat as a neural network behind the page: neurons filling
 * its silhouette in layers, with signals climbing from the paws to the ears,
 * inside slowly turning orbit rings and dust. The shape never changes; its
 * faint outline can be uncovered one proximity query at a time. With reduced
 * motion it is drawn still.
 */
export function startBackgroundScene(
  canvas: HTMLCanvasElement,
  doc: Document,
  prefersReducedMotion: boolean,
): BackgroundHandle {
  const background = createScene(canvas, doc, prefersReducedMotion);
  const redrawIfStill = (): void => {
    if (prefersReducedMotion) {
      render(background);
    }
  };
  resize(background);
  window.addEventListener('resize', () => {
    resize(background);
    redrawIfStill();
  });
  window.matchMedia(DARK_SCHEME_QUERY).addEventListener('change', () => {
    recolor(background);
    redrawIfStill();
  });
  if (prefersReducedMotion) {
    render(background);
  } else {
    startMotion(background);
  }
  canvas.setAttribute(READY_ATTRIBUTE, '');
  return {
    ask: (clientX, clientY) => ask(background, clientX, clientY),
  };
}
