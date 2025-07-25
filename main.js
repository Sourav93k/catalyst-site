document.addEventListener('DOMContentLoaded', () => {
  // Dark-mode toggle
  const darkToggle = document.getElementById('dark-toggle');
  if (darkToggle) {
    darkToggle.addEventListener('click', () => {
      document.documentElement.classList.toggle('dark');
      console.log(
        '🌙 dark-mode toggled → html has .dark?',
        document.documentElement.classList.contains('dark')
      );
    });
  }

  // Mobile-menu toggle (this was already working)
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }
});