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

    // --- AI Chatbot Widget Logic ---
    // New elements for the floating widget
    const chatOpenBtn = document.getElementById('chat-open-btn');
    const chatCloseBtn = document.getElementById('chat-close-btn');
    const chatWindow = document.getElementById('chat-window');
    
    // Updated IDs for the chat display and form within the widget
    const chatDisplay = document.getElementById('chat-display-widget');
    const chatInputForm = document.getElementById('chat-input-form-widget');
    const userChatInput = document.getElementById('user-chat-input-widget');

    // Link the navbar AI Chatbot links to open the widget
    const navbarChatbotLink = document.getElementById('navbar-chatbot-link');
    const mobileChatbotLink = document.getElementById('mobile-chatbot-link');

    if (chatOpenBtn && chatCloseBtn && chatWindow) {
        console.log('main.js: Chat widget buttons and window found. Attaching listeners.');
        
        chatOpenBtn.addEventListener('click', () => {
            console.log('main.js: Chat open button clicked!');
            chatWindow.classList.remove('hidden'); // Show chat window
            chatOpenBtn.classList.add('hidden');   // Hide open button
        });

        chatCloseBtn.addEventListener('click', () => {
            console.log('main.js: Chat close button clicked!');
            chatWindow.classList.add('hidden');    // Hide chat window
            chatOpenBtn.classList.remove('hidden'); // Show open button
        });

        // Event listeners for navbar links that trigger the chat widget
        if (navbarChatbotLink) {
            navbarChatbotLink.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent default hash scroll
                console.log('main.js: Navbar Chatbot link clicked!');
                chatWindow.classList.remove('hidden');
                chatOpenBtn.classList.add('hidden');
                if (!mobileMenu.classList.contains('hidden')) { // Close mobile menu if open
                    mobileMenu.classList.add('hidden');
                }
            });
        }
        if (mobileChatbotLink) {
            mobileChatbotLink.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent default hash scroll
                console.log('main.js: Mobile Chatbot link clicked!');
                chatWindow.classList.remove('hidden');
                chatOpenBtn.classList.add('hidden');
                if (!mobileMenu.classList.contains('hidden')) { // Close mobile menu if open
                    mobileMenu.classList.add('hidden');
                }
            });
        }

    } else {
        console.error("main.js: Chat widget buttons or window not found.");
    }


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
            // Styling for error messages
            classes = 'self-center bg-red-100 text-red-700 p-2 my-1 rounded-lg max-w-[90%] text-center shadow-md';
        } else if (fromUser) {
            // Refined User Message Bubble (Amber, rounded, subtle shadow)
            classes = 'self-end bg-amber-500 text-white p-2 my-1 rounded-lg shadow-md max-w-[80%]';
        } else {
            // Refined Bot Message Bubble (Softer background, rounded, subtle shadow)
            classes = 'self-start bg-slate-200 dark:bg-slate-700 dark:text-slate-200 p-2 my-1 rounded-lg shadow-md max-w-[80%]';
        }

        // Add common flexbox classes for alignment
        msg.className = classes + ' flex flex-col';
        msg.textContent = text;
        
        console.log('appendMessage: Appending msg to chatDisplay. Current chatDisplay child count:', chatDisplay.children.length);
        chatDisplay.appendChild(msg);
        console.log('appendMessage: Msg appended. New chatDisplay child count:', chatDisplay.children.length);
        
        chatDisplay.scrollTop = chatDisplay.scrollHeight;
        console.log('appendMessage: Scrolled to bottom.');
    }

    // Event listener for the chatbot form submission (uses widget IDs now)
    if (chatInputForm && userChatInput && chatDisplay) { // Ensure all elements exist before adding listener
        console.log('main.js: Chatbot elements found. Attaching submit listener.'); // NEW LOG 6
        chatInputForm.addEventListener('submit', async (e) => {
            console.log('main.js: Chatbot form submitted!'); // NEW LOG 7
            e.preventDefault(); // Prevent default form submission (page reload)

            const userText = userChatInput.value.trim(); // Get user input and remove whitespace
            console.log('main.js: userText value after trim:', userText); // NEW LOG 9

            if (!userText) {
                console.log('main.js: User input is empty. Returning.'); // NEW LOG 8 (Updated message)
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
                // !!! IMPORTANT: This path is for Netlify Functions !!!
                const res = await fetch('/.netlify/functions/chat', { 
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
        console.error("main.js: Chatbot elements not found. Please ensure your HTML IDs are correct: 'chat-display-widget', 'chat-input-form-widget', 'user-chat-input-widget'");
    }
});