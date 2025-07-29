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
    const chatDisplay = document.getElementById('chat-display'); // This is the div where messages appear
    const chatInputForm = document.getElementById('chat-input-form'); // This is the form element
    const userChatInput = document.getElementById('user-chat-input'); // This is the input field within the form

    /**
     * Appends a message bubble to the chat display.
     * @param {string} text - The text content of the message.
     * @param {boolean} [fromUser=true] - True if the message is from the user, false if from the bot.
     * @param {boolean} [isError=false] - True if the message is an error message.
     */
    function appendMessage(text, fromUser = true, isError = false) {
        console.log('appendMessage: Called with text:', text, 'fromUser:', fromUser, 'isError:', isError); // NEW LOG A
        const msg = document.createElement('div');
        let classes = '';

        if (isError) {
            classes = 'self-center bg-red-100 text-red-700 p-2 my-1 rounded-lg max-w-[90%] text-center shadow-md';
        } else if (fromUser) {
            classes = 'self-end bg-amber-500 text-white p-2 my-1 rounded-lg max-w-[80%] shadow-md';
        } else {
            classes = 'self-start bg-slate-200 dark:bg-slate-700 dark:text-slate-200 p-2 my-1 rounded-lg max-w-[80%] shadow-md';
        }

        msg.className = classes + ' flex flex-col';
        msg.textContent = text;
        
        console.log('appendMessage: Appending msg to chatDisplay. Current chatDisplay child count:', chatDisplay.children.length); // NEW LOG B
        chatDisplay.appendChild(msg);
        console.log('appendMessage: Msg appended. New chatDisplay child count:', chatDisplay.children.length); // NEW LOG C
        
        chatDisplay.scrollTop = chatDisplay.scrollHeight;
        console.log('appendMessage: Scrolled to bottom.'); // NEW LOG D
    }

    // Event listener for the chatbot form submission
    if (chatInputForm && userChatInput && chatDisplay) {
        console.log('main.js: Chatbot elements found. Attaching submit listener.'); // NEW LOG 6
        chatInputForm.addEventListener('submit', async (e) => {
            console.log('main.js: Chatbot form submitted!'); // NEW LOG 7
            e.preventDefault();

            const userText = userChatInput.value.trim();
            console.log('main.js: userText value after trim:', userText); // NEW LOG 9

            if (!userText) {
                console.log('main.js: User input is empty. Returning.'); // NEW LOG 8 (Updated message)
                return;
            }

            console.log('main.js: Calling appendMessage for user text.'); // NEW LOG 10
            appendMessage(userText, true); // Display user's message
            userChatInput.value = ''; // Clear the input field

            console.log('main.js: Calling appendMessage for thinking message.'); // NEW LOG 11
            const thinkingMessage = '🤖 thinking...';
            appendMessage(thinkingMessage, false);

            try {
                const res = await fetch('https://catalyst-site.vercel.app/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: userText })
                });

                // Remove the "thinking..." message
                if (chatDisplay.lastChild && chatDisplay.lastChild.textContent === thinkingMessage) {
                    chatDisplay.removeChild(chatDisplay.lastChild);
                }

                let payload;
                try {
                    payload = await res.json();
                } catch {
                    throw new Error('Server returned invalid JSON. Check your backend API endpoint.');
                }

                if (!res.ok || payload.error) {
                    throw new Error(payload.error || `Server error: HTTP ${res.status}`);
                }

                appendMessage(payload.reply, false); // Display bot's message

            } catch (err) {
                if (chatDisplay.lastChild && chatDisplay.lastChild.textContent === thinkingMessage) {
                    chatDisplay.removeChild(chatDisplay.lastChild);
                }
                appendMessage(`Error: ${err.message}`, false, true);
                console.error("Chatbot frontend fetch error:", err);
            }
        });
    } else {
        console.error("main.js: Chatbot elements not found. Please ensure your HTML IDs are correct: 'chat-display', 'chat-input-form', 'user-chat-input'");
    }
});