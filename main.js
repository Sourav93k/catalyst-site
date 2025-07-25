document.addEventListener('DOMContentLoaded', () => {
  // 1. Find the buttons and menu container
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const darkToggle = document.getElementById('dark-toggle');

  // 2. Wire up the mobile menu button
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      console.log('☰ mobile menu button clicked');
      mobileMenu.classList.toggle('hidden');
      console.log('  → mobile-menu hidden class is now:', mobileMenu.classList.contains('hidden'));
    });
  } else {
    console.error('❌ Missing mobile menu elements:', menuBtn, mobileMenu);
  }

  // 3. Wire up the dark-mode button
  if (darkToggle) {
    darkToggle.addEventListener('click', () => {
      console.log('🌓 dark-mode button clicked');
      document.documentElement.classList.toggle('dark');
      console.log(
        '  → root html has dark class? ',
        document.documentElement.classList.contains('dark')
      );
    });
  } else {
    console.error('❌ Missing dark-toggle button:', darkToggle);
  }
});