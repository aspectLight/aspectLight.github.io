/** Events Astro's ClientRouter fires on `document` (Astro does not export these names). */
export enum PageEvent {
  /** After the first load and after every in-place navigation. */
  Load = 'astro:page-load',
  /** Right after the new page's DOM is in place and scrolled, before it is painted. */
  AfterSwap = 'astro:after-swap',
}
