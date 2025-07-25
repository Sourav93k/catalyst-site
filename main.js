document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const darkToggle = document.getElementById('dark-toggle');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      console.log('☰ clicked');
      mobileMenu.classList.toggle('hidden');
    });
  }

  if (darkToggle) {
    darkToggle.addEventListener('click', () => {
      console.log('🌓 clicked');
      document.documentElement.classList.toggle('dark');
    });
  }
});