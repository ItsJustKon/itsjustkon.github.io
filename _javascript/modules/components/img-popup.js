/**
 * Set up image popup with support for multiple isolated galleries via data-gallery
 *
 * Dependencies: https://github.com/biati-digital/glightbox
 */

const lightSelector = '.popup:not(.dark)';
const darkSelector = '.popup:not(.light)';

let activeSelector = lightSelector;

function initOrUpdateLightbox() {
  // Destroy any previous instance if it exists (safe on first call)
  if (window.currentLightbox) {
    window.currentLightbox.destroy();
  }

  // Initialize without a forced selector → GLightbox will respect data-gallery
  window.currentLightbox = GLightbox({
    // Keep Chirpy's usual options if any (add more as needed)
    touchNavigation: true,
    loop: true,
    autoplayVideos: true
    // NO selector here! This is the key change.
    // GLightbox defaults to '.glightbox' but we can override class if needed.
  });

  // Optional: If you really need to support only .popup elements,
  // you can add a custom class or keep selector logic, but for isolation we drop it.
}

export function imgPopup() {
  window.currentLightbox = GLightbox({
    selector: '.popup' // ← add this line
    // other options
  });
  if (!document.querySelector('.popup')) {
    return;
  }

  const hasDualImages = !!(
    document.querySelector('.popup.light') ||
    document.querySelector('.popup.dark')
  );

  // Set initial selector based on current theme
  activeSelector =
    Theme.visualState === Theme.DARK ? darkSelector : lightSelector;

  initOrUpdateLightbox();

  if (hasDualImages && Theme.switchable) {
    window.addEventListener('message', (event) => {
      if (event.source === window && event.data && event.data.id === Theme.ID) {
        // Theme changed → re-init the lightbox
        activeSelector =
          activeSelector === lightSelector ? darkSelector : lightSelector;
        initOrUpdateLightbox();
      }
    });
  }
}
