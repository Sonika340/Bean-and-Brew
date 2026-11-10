/**
 * Bean & Brew - Menu Category Filter Script
 * Handles filtering menu cards into Coffee, Snacks, Desserts, and All.
 */

document.addEventListener('DOMContentLoaded', () => {
  initMenuFilter();
});

function initMenuFilter() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const menuItems = document.querySelectorAll('.menu-item');
  const statusAnnouncer = document.getElementById('filterStatus');

  if (!filterButtons.length || !menuItems.length) return;

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const selectedCategory = btn.getAttribute('data-filter');

      // Update active state on buttons
      filterButtons.forEach((b) => {
        const isActive = b === btn;
        b.classList.toggle('active', isActive);
        b.setAttribute('aria-pressed', String(isActive));
      });

      // Filter the menu items
      let visibleCount = 0;
      menuItems.forEach((item) => {
        const itemCategory = item.getAttribute('data-category');
        const shouldShow = selectedCategory === 'all' || itemCategory === selectedCategory;

        if (shouldShow) {
          item.classList.remove('is-hidden');
          visibleCount++;
        } else {
          item.classList.add('is-hidden');
        }
      });

      // Accessible announcement
      if (statusAnnouncer) {
        const categoryName = btn.textContent.trim();
        statusAnnouncer.textContent = `Showing ${visibleCount} items in ${categoryName}.`;
      }
    });
  });

  // Check URL hash on page load (e.g. menu.html#desserts)
  const hash = window.location.hash.replace('#', '').toLowerCase();
  if (hash) {
    const targetBtn = Array.from(filterButtons).find(
      (b) => b.getAttribute('data-filter') === hash
    );
    if (targetBtn) {
      targetBtn.click();
    }
  }
}
