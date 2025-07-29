document.addEventListener('DOMContentLoaded', () => {
    console.log('main.js: DOMContentLoaded event fired. Initializing features.'); // NEW LOG 1

    // --- Dark Mode Toggle ---
    const darkToggle = document.getElementById('dark-toggle');
    if (darkToggle) {
        darkToggle.addEventListener('click', () => {
            console.log('main.js: Dark Mode button clicked!'); // NEW LOG 2
            document.documentElement.classList.toggle('dark');
            console.log(
                '🌙 dark-mode toggled → html has .dark?',
                document.documentElement.classList.contains('dark')
            );
        });
    } else {
        console.log('main.js: Dark Mode toggle button not found.'); // NEW LOG 3
    }

    // --- Mobile Menu Toggle ---
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            console.log('main.js: Mobile Menu button clicked!'); // NEW LOG 4
            mobileMenu.classList.toggle('hidden');
        });
    } else {
        console.log('main.js: Mobile Menu button or menu not found.'); // NEW LOG 5
    }

    // --- AI Chatbot Logic ---
    const chatDisplay = document.getElementById('chat-display');
    const chatInputForm = document.getElementById('chat-input-form');
    const userChatInput = document.getElementById('user-chat-input');

    function appendMessage(text, fromUser = true, isError = false) {
        // ... (your existing appendMessage function code) ...
    }

    if (chatInputForm && userChatInput && chatDisplay) {
        console.log('main.js: Chatbot elements found. Attaching submit listener.'); // NEW LOG 6
        chatInputForm.addEventListener('submit', async (e) => {
            console.log('main.js: Chatbot form submitted!'); // NEW LOG 7
            e.preventDefault();

            const userText = userChatInput.value.trim();
            if (!userText) {
                console.log('main.js: User input is empty.'); // NEW LOG 8
                return;
            }

            appendMessage(userText, true);
            userChatInput.value = '';

            const thinkingMessage = '🤖 thinking...';
            appendMessage(thinkingMessage, false);

            try {
                const res = await fetch('https://catalyst-site.vercel.app/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: userText })
                });

                // ... (rest of your fetch success/error handling) ...

            } catch (err) {
                // ... (your existing catch block) ...
            }
        });
    } else {
        console.error("main.js: Chatbot elements not found. Please ensure your HTML IDs are correct: 'chat-display', 'chat-input-form', 'user-chat-input'"); // Already existing error log
    }
});