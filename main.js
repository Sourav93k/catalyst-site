// Toggle mobile menu
const mobileBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
mobileBtn.addEventListener('click', () => {
  mobileMenu.classList.toggle('hidden');
});

// Toggle dark mode
const darkToggle = document.getElementById('dark-toggle');
darkToggle.addEventListener('click', () => {
  document.documentElement.classList.toggle('dark');
  // persist choice
  localStorage.theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
});

// On page load, apply saved theme
if (localStorage.theme === 'dark'
  || (!('theme' in localStorage)
      && window.matchMedia('(prefers-color-scheme: dark)').matches)
) {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}