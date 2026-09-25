import {
  Color,
  PerspectiveCamera,
  Plane,
  Raycaster,
  Scene,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three';

import { CatModel } from './background-3d.cat';
import {
  CAMERA_DISTANCE,
  CAMERA_FAR,
  CAMERA_FIELD_OF_VIEW,
  CAMERA_NEAR,
  MAX_FRAME_SECONDS,
  MAX_PIXEL_RATIO,
  PORTRAIT_SCALE,
  QUERY_LINE_SECONDS,
} from './background-3d.constants';
import { createDotTexture } from './background-3d.dot';
import { DustLayer } from './background-3d.dust';
import { buildCatNetwork } from './background-3d.network';
import { isReconstructed, QueryLog } from './background-3d.queries';
import { QueryLayer } from './background-3d.query-layer';
import type { Palette, Point2, QuerySummary } from './background-3d.types';

const ACCENT_PROPERTY = '--color-accent';
const DARK_SCHEME_QUERY = '(prefers-color-scheme: dark)';
const READY_ATTRIBUTE = 'data-background-ready';
const MS_PER_SECOND = 1000;

function readAccentColor(doc: Document): Color {
  const value = getComputedStyle(doc.documentElement).getPropertyValue(ACCENT_PROPERTY).trim();
  return new Color(value);
}

/**
 * Draws the avatar's cat as a neural network behind the page: neurons filling
 * its silhouette in layers, with signals climbing from the paws to the ears,
 * among faint drifting dust. The shape never changes; its
 * faint outline can be uncovered one proximity query at a time. With reduced
 * motion it is drawn still.
 */
export class BackgroundScene {
  private readonly renderer: WebGLRenderer;
  private readonly scene = new Scene();
  private readonly camera = new PerspectiveCamera(CAMERA_FIELD_OF_VIEW, 1, CAMERA_NEAR, CAMERA_FAR);
  private readonly cat: CatModel;
  private readonly dust: DustLayer;
  private readonly queries: QueryLog;
  private readonly queryLayer: QueryLayer;
  /** Seconds of animation so far; drives the sway, bob and dust. */
  private elapsed = 0;
  private lastFrameTime: number | undefined;

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly doc: Document,
    private readonly isStill: boolean,
  ) {
    this.renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO));
    this.camera.position.z = CAMERA_DISTANCE;
    const palette: Palette = { color: readAccentColor(doc), dot: createDotTexture(doc) };
    const network = buildCatNetwork();
    const outline = network.outline.map(([x, y]): Point2 => [x, y]);
    this.cat = new CatModel(network, palette);
    this.dust = new DustLayer(palette);
    this.queries = new QueryLog(outline);
    this.queryLayer = new QueryLayer(outline.length, palette);
    this.cat.group.add(this.queryLayer.group);
    this.scene.add(this.cat.group, this.dust.points);
  }

  /** Sizes the canvas, follows window and colour-scheme changes, and draws. */
  start(): void {
    this.resize();
    window.addEventListener('resize', () => {
      this.resize();
      this.redrawIfStill();
    });
    window.matchMedia(DARK_SCHEME_QUERY).addEventListener('change', () => {
      this.recolor();
      this.redrawIfStill();
    });
    if (this.isStill) {
      this.render();
    } else {
      this.startMotion();
    }
    this.canvas.setAttribute(READY_ATTRIBUTE, '');
  }

  /**
   * A proximity query at a screen position: the cat answers with the closest
   * point of its outline. Returns the running totals, or nothing if the click
   * missed the cat's plane.
   */
  ask(clientX: number, clientY: number): QuerySummary | undefined {
    const point = this.toCatPlane(clientX, clientY);
    if (point === undefined) {
      return undefined;
    }
    const wasReconstructed = isReconstructed(this.queries.summary());
    this.queries.ask(point);
    const summary = this.queries.summary();
    this.queryLayer.show(this.queries, !wasReconstructed && isReconstructed(summary));
    if (this.isStill) {
      this.showStill();
    }
    return summary;
  }

  private resize(): void {
    const { innerWidth: width, innerHeight: height } = window;
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    const scale = width < height ? PORTRAIT_SCALE : 1;
    this.cat.group.scale.setScalar(scale);
    this.dust.points.scale.setScalar(scale);
  }

  private recolor(): void {
    const color = readAccentColor(this.doc);
    this.cat.recolor(color);
    this.dust.recolor(color);
    this.queryLayer.recolor(color);
  }

  private render(): void {
    this.cat.pose(this.elapsed);
    this.dust.pose(this.elapsed);
    this.renderer.render(this.scene, this.camera);
  }

  private redrawIfStill(): void {
    if (this.isStill) {
      this.render();
    }
  }

  private animate(time: number): void {
    const last = this.lastFrameTime;
    this.lastFrameTime = time;
    const seconds =
      last === undefined ? 0 : Math.min((time - last) / MS_PER_SECOND, MAX_FRAME_SECONDS);
    this.elapsed += seconds;
    this.cat.advance(seconds);
    this.queryLayer.fade(this.queries, seconds);
    this.render();
  }

  /** Runs the animation loop, paused while the tab is hidden. */
  private startMotion(): void {
    const run = (): void => {
      this.lastFrameTime = undefined;
      this.renderer.setAnimationLoop((time) => {
        this.animate(time);
      });
    };
    this.doc.addEventListener('visibilitychange', () => {
      if (this.doc.hidden) {
        this.renderer.setAnimationLoop(null);
      } else {
        run();
      }
    });
    run();
  }

  /** Where a click on the screen meets the cat's own plane, in the cat's coordinates. */
  private toCatPlane(clientX: number, clientY: number): Point2 | undefined {
    const pointer = new Vector2(
      (clientX / window.innerWidth) * 2 - 1,
      -(clientY / window.innerHeight) * 2 + 1,
    );
    const raycaster = new Raycaster();
    raycaster.setFromCamera(pointer, this.camera);
    this.cat.group.updateMatrixWorld();
    const plane = new Plane(new Vector3(0, 0, 1), 0).applyMatrix4(this.cat.group.matrixWorld);
    const hit = raycaster.ray.intersectPlane(plane, new Vector3());
    if (hit === null) {
      return undefined;
    }
    const local = this.cat.group.worldToLocal(hit);
    return [local.x, local.y];
  }

  /**
   * Reduced motion: the answer appears at once and disappears at once a little
   * later, with no fade and no glow.
   */
  private showStill(): void {
    this.queryLayer.fade(this.queries, 0);
    this.render();
    window.setTimeout(() => {
      this.queryLayer.fade(this.queries, Number.POSITIVE_INFINITY);
      this.render();
    }, QUERY_LINE_SECONDS * MS_PER_SECOND);
  }
}
