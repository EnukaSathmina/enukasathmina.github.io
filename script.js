document.addEventListener('DOMContentLoaded', function () {
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  const dropdownHeader = document.querySelector('.cert-dropdown-header');
  const dropdownCard = document.querySelector('.cert-dropdown');

  if (dropdownHeader && dropdownCard) {
    dropdownHeader.addEventListener('click', function () {
      dropdownCard.classList.toggle('active');
    });
  }
});
