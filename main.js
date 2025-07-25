// grab the container where all messages live
const chatContainer = document.getElementById('chat');

// 1) show a user bubble
function addUserMessage(text) {
  const msg = document.createElement('div');
  msg.className = 'bubble user';
  msg.textContent = text;
  chatContainer.append(msg);
  msg.scrollIntoView({ behavior: 'smooth' });
}

// 2) show a bot bubble
function addBotMessage(text) {
  const msg = document.createElement('div');
  msg.className = 'bubble bot';
  msg.textContent = text;
  chatContainer.append(msg);
  msg.scrollIntoView({ behavior: 'smooth' });
}

// 3) show an error bubble
function addErrorMessage(text) {
  const msg = document.createElement('div');
  msg.className = 'bubble error';
  msg.textContent = text;
  chatContainer.append(msg);
  msg.scrollIntoView({ behavior: 'smooth' });
}
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
      body: JSON.stringify({ message: userText })
    });

    let payload;
    try {
      payload = await res.json();
    } catch {
      throw new Error('Server returned invalid JSON');
    }

    if (!res.ok || payload.error) {
      // Display server’s JSON error
      throw new Error(payload.error || `HTTP ${res.status}`);
    }

    // Display the AI’s reply
    addBotMessage(payload.reply);
  } catch (err) {
    const chatContainer = document.getElementById('chat');

function addUserMessage(text) {
  const msg = document.createElement('div');
  msg.className = 'bg-blue-100 dark:bg-blue-800 text-black dark:text-white p-2 rounded self-end text-right';
  msg.textContent = text;
  chatContainer.append(msg);
  msg.scrollIntoView({ behavior: 'smooth' });
}
function addBotMessage(text) {
  const msg = document.createElement('div');
  msg.className = 'bg-gray-200 dark:bg-slate-600 text-black dark:text-white p-2 rounded self-start text-left';
  msg.textContent = text;
  chatContainer.append(msg);
  msg.scrollIntoView({ behavior: 'smooth' });
}

function addErrorMessage(text) {
  const msg = document.createElement('div');
  msg.className = 'bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200 p-2 rounded text-left';
  msg.textContent = text;
  chatContainer.append(msg);
  msg.scrollIntoView({ behavior: 'smooth' });
}
    // Show an error message bubble
    addErrorMessage(`Error connecting to chatbot: ${err.message}`);
  }
  document.getElementById('chat-form').addEventListener('submit', e => {
  e.preventDefault();
  const text = e.target.userInput.value.trim();
  if (!text) return;
  sendToChatbot(text);
  e.target.userInput.value = '';
});
  });
});