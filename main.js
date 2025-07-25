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
       console.log('🌓 dark-mode button clicked');
       document.documentElement.classList.toggle('dark');
       console.log(
         '  → <html> has .dark now?',
         document.documentElement.classList.contains('dark')
       );
     });
   } else {
     console.error('❌ dark-toggle (#dark-toggle) not found in DOM');
   }
 });  // end DOMContentLoaded