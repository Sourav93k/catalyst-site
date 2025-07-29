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
        const msg = document.createElement('div');
        let classes = '';

        if (isError) {
            // Styling for error messages
            classes = 'self-center bg-red-100 text-red-700 p-2 my-1 rounded-lg max-w-[90%] text-center shadow-md';
        } else if (fromUser) {
            // Styling for user messages
            classes = 'self-end bg-amber-500 text-white p-2 my-1 rounded-lg max-w-[80%] shadow-md';
        } else {
            // Styling for bot messages
            classes = 'self-start bg-slate-200 dark:bg-slate-700 dark:text-slate-200 p-2 my-1 rounded-lg max-w-[80%] shadow-md';
        }

        // Add common flexbox classes for alignment
        msg.className = classes + ' flex flex-col';
        msg.textContent = text;
        chatDisplay.appendChild(msg);

        // Scroll to the bottom to show the latest message
        chatDisplay.scrollTop = chatDisplay.scrollHeight;
    }

    // Event listener for the chatbot form submission
    if (chatInputForm && userChatInput && chatDisplay) { // Ensure all elements exist before adding listener
        console.log('main.js: Chatbot elements found. Attaching submit listener.'); // NEW LOG 6
        chatInputForm.addEventListener('submit', async (e) => {
            console.log('main.js: Chatbot form submitted!'); // NEW LOG 7
            e.preventDefault(); // Prevent default form submission (page reload)

            const userText = userChatInput.value.trim(); // Get user input and remove whitespace

            if (!userText) {
                console.log('main.js: User input is empty.'); // NEW LOG 8
                return; // Do nothing if input is empty
            }

            // Display user's message
            appendMessage(userText, true);
            userChatInput.value = ''; // Clear the input field

            // Show a “thinking…” placeholder while waiting for bot response
            const thinkingMessage = '🤖 thinking...';
            appendMessage(thinkingMessage, false);

            try {
                // Make the API call to your backend (chat.js)
                const res = await fetch('https://catalyst-site.vercel.app/api/chat', { // Use your actual Vercel domain here!
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: userText }) // Send the user's message
                });

                // Remove the "thinking..." message
                if (chatDisplay.lastChild && chatDisplay.lastChild.textContent === thinkingMessage) {
                    chatDisplay.removeChild(chatDisplay.lastChild);
                }

                let payload;
                try {
                    payload = await res.json(); // Try to parse the response as JSON
                } catch {
                    throw new Error('Server returned invalid JSON. Check your backend API endpoint.');
                }

                // Check for HTTP errors or errors from your API response
                if (!res.ok || payload.error) {
                    throw new Error(payload.error || `Server error: HTTP ${res.status}`);
                }

                // Display the AI’s reply
                appendMessage(payload.reply, false); // Display bot's message

            } catch (err) {
                // If an error occurs, remove thinking message and display error
                if (chatDisplay.lastChild && chatDisplay.lastChild.textContent === thinkingMessage) {
                    chatDisplay.removeChild(chatDisplay.lastChild);
                }
                appendMessage(`Error: ${err.message}`, false, true); // Display error message
                console.error("Chatbot frontend fetch error:", err); // Log error for debugging
            }
        });
    } else {
        // This console.error will help you if elements are not found when the script runs
        console.error("Chatbot elements not found. Please ensure your HTML IDs are correct: 'chat-display', 'chat-input-form', 'user-chat-input'");
    }
});