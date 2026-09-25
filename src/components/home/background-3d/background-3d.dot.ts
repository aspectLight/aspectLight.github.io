import { CanvasTexture } from 'three';

/** Pixel size of the generated dot; points are scaled from it, so it only needs to be crisp. */
const DOT_TEXTURE_SIZE = 64;

/**
 * A soft-edged white disc. WebGL draws points as squares; used as their texture
 * (with the material's colour applied on top) it turns them into round dots.
 */
export function createDotTexture(doc: Document): CanvasTexture {
  const canvas = doc.createElement('canvas');
  canvas.width = DOT_TEXTURE_SIZE;
  canvas.height = DOT_TEXTURE_SIZE;
  const context = canvas.getContext('2d');
  const radius = DOT_TEXTURE_SIZE / 2;
  if (context !== null) {
    const gradient = context.createRadialGradient(radius, radius, 0, radius, radius, radius);
    gradient.addColorStop(0, 'rgb(255 255 255 / 100%)');
    gradient.addColorStop(0.6, 'rgb(255 255 255 / 100%)');
    gradient.addColorStop(1, 'rgb(255 255 255 / 0%)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, DOT_TEXTURE_SIZE, DOT_TEXTURE_SIZE);
  }
  return new CanvasTexture(canvas);
}
