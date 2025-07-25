document.addEventListener('DOMContentLoaded', () => {
    // ... (rest of your dark mode and mobile menu toggles) ...

    // --- AI Chatbot Logic ---
    const chatDisplay = document.getElementById('chat-display');
    const chatInputForm = document.getElementById('chat-input-form');
    const userChatInput = document.getElementById('user-chat-input');

    function appendMessage(text, fromUser = true, isError = false) {
        // ... (rest of your appendMessage function) ...
    }

    if (chatInputForm && userChatInput && chatDisplay) {
        chatInputForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const userText = userChatInput.value.trim();
            if (!userText) return;

            appendMessage(userText, true);
            userChatInput.value = '';

            const thinkingMessage = '🤖 thinking...';
            appendMessage(thinkingMessage, false);

            try {
                // --- CRITICAL FIX HERE: Changed '/api/chat' to the full absolute URL ---
                const res = await fetch('https://catalyst-site.vercel.app/api/chat', { // Use your actual Vercel domain here!
                // If your domain changes, you'll need to update this or configure it dynamically
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: userText })
                });
                // --- END CRITICAL FIX ---

                // ... (rest of your fetch success/error handling) ...

            } catch (err) {
                if (chatDisplay.lastChild && chatDisplay.lastChild.textContent === thinkingMessage) {
                    chatDisplay.removeChild(chatDisplay.lastChild);
                }
                appendMessage(`Error: ${err.message}`, false, true);
                console.error("Chatbot frontend fetch error:", err);
            }
        });
    } else {
        console.error("Chatbot elements not found. Please ensure your HTML IDs are correct: 'chat-display', 'chat-input-form', 'user-chat-input'");
    }
});