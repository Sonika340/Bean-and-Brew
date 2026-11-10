/**
 * Bean & Brew - Main Global JavaScript
 * Handles mobile hamburger navigation, active link state, and global utilities.
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  highlightActiveNavLink();
  initFooterYear();
});

/**
 * Initializes the mobile hamburger menu drawer and accessibility attributes.
 */
function initMobileNav() {
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (!navToggle || !navMenu) return;

  // Toggle navigation open/close on button click
  navToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
    toggleMenu(!isExpanded);
  });

  // Close menu when clicking any nav link
  const navLinks = navMenu.querySelectorAll('.nav-link');
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (navToggle.getAttribute('aria-expanded') === 'true') {
        toggleMenu(false);
      }
    });
  });

  // Close menu when pressing Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') {
      toggleMenu(false);
      navToggle.focus();
    }
  });

  // Close menu when clicking outside of the navbar
  document.addEventListener('click', (e) => {
    if (navToggle.getAttribute('aria-expanded') === 'true') {
      if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        toggleMenu(false);
      }
    }
  });

  /**
   * Helper function to open or close the menu state
   * @param {boolean} open
   */
  function toggleMenu(open) {
    navToggle.setAttribute('aria-expanded', String(open));
    if (open) {
      navMenu.classList.add('is-open');
    } else {
      navMenu.classList.remove('is-open');
    }
  }
}

/**
 * Automatically sets the active navigation state based on current page URL.
 */
function highlightActiveNavLink() {
  const currentPath = window.location.pathname;
  const filename = currentPath.substring(currentPath.lastIndexOf('/') + 1) || 'index.html';

  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (href === filename || (filename === '' && href === 'index.html')) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    } else {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
    }
  });
}

/**
 * Sets current year dynamically in the footer.
 */
function initFooterYear() {
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}
