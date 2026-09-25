/// <reference types="astro/astro-jsx" />

/**
 * Fallback for tools that run plain TypeScript (ESLint). `astro check` resolves
 * `.astro` imports to their real, prop-checked types and never uses this.
 */
declare module '*.astro' {
  import type { AstroComponentFactory } from 'astro/runtime/server/index.js';

  const Component: AstroComponentFactory;
  export default Component;
}
