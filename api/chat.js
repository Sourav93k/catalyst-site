export const runtime = 'edge';

export default async function handler(req) {
  try {
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method Not Allowed' }),
        { status: 405, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { message } = await req.json();
    if (!message) throw new Error('No message provided');

    // 1) Call Gemini API
    const geminiRes = await fetch(
      'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash-lite:generateContent?key=' +
        process.env.GEMINI_KEY,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: message }] }],
          safetySettings: [
            { category: 'HARM_CATEGORY_DANGEROUS', threshold: 'BLOCK_NONE' }
          ],
          generationConfig: { temperature: 0.7 }
        })
      }
    );

    // 2) If Gemini itself returns a non-200, read its text and throw
    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      throw new Error(
        `Gemini error ${geminiRes.status}: ${errText.slice(0, 200)}…`
      );
    }

    const geminiJson = await geminiRes.json();
    const reply =
      geminiJson.candidates?.[0]?.content?.parts?.[0]?.text ||
      'Sorry, could not generate a response.';

    // 3) On success, return JSON with { reply }
    return new Response(
      JSON.stringify({ reply }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('API error:', err);
    // 4) On any error, return { error } JSON
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
async function sendToChatbot(userText) {
  addUserMessage(userText);

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
    // Show an error message bubble
    addErrorMessage(`Error connecting to chatbot: ${err.message}`);
  }
}