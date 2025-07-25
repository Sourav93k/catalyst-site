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
// AI Chatbot logic
document.addEventListener('DOMContentLoaded', () => {
  const chatWindow = document.getElementById('chat-window');
  const chatForm   = document.getElementById('chat-form');
  const chatInput  = document.getElementById('chat-input');

  function appendMessage(text, fromUser = true) {
    const msg = document.createElement('div');
    msg.className = fromUser
      ? 'self-end bg-indigo-100 text-right p-2 my-1 rounded-lg max-w-[80%]'
      : 'self-start bg-slate-100 dark:bg-slate-800 p-2 my-1 rounded-lg max-w-[80%]';
    msg.textContent = text;
    chatWindow.appendChild(msg);
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }

  chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (!text) return;
    appendMessage(text, true);
    chatInput.value = '';
    // Show a “typing…” placeholder
    appendMessage('🤖 thinking...', false);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });
      const { reply } = await res.json();
      // Remove the “thinking” message
      chatWindow.lastChild.remove();
      appendMessage(reply, false);
    } catch (err) {
      chatWindow.lastChild.remove();
      appendMessage('⚠️ Error connecting to chatbot.', false);
      console.error(err);
    }
  });
});