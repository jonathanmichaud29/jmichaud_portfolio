/**
 * header-scroll.ts
 *
 * Hides the fixed site header when the user scrolls down past HIDE_THRESHOLD,
 * and reveals it when they scroll back up.
 *
 * Uses requestAnimationFrame throttling to keep scroll handling off the
 * main thread as much as possible. The { passive: true } listener option
 * tells the browser it can scroll without waiting for this handler,
 * eliminating scroll jank on mobile.
 *
 * DOM contract:
 *   - Element with id="site-header" must exist.
 *   - The CSS transition on [data-hidden] is defined in header.css.
 *
 * This file is imported as a typed Astro client script:
 *   <script src="../scripts/header-scroll.ts"></script>
 * Astro bundles and fingerprints it at build time.
 */

const header = document.getElementById("site-header");

if (header) {
  let lastY = window.scrollY;
  let ticking = false;

  /**
   * Threshold in pixels before the hide behaviour kicks in.
   * Prevents accidental hiding on pull-to-refresh overshoot on mobile,
   * or tiny scroll jitter when the page first loads.
   */
  const HIDE_THRESHOLD = 80;

  function update(): void {
    const currentY = window.scrollY;
    const delta = currentY - lastY;

    if (currentY < HIDE_THRESHOLD) {
      // Always visible near the top of the page
      header!.removeAttribute("data-hidden");
    } else if (delta > 4) {
      // Scrolling down — hide
      header!.setAttribute("data-hidden", "");
    } else if (delta < -4) {
      // Scrolling up — reveal
      header!.removeAttribute("data-hidden");
    }

    lastY = currentY;
    ticking = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    },
    { passive: true }
  );
}
