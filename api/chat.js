// REMOVE THIS LINE: export const runtime = 'edge';

export default async function handler(req) {
    try {
        if (req.method !== 'POST') {
            return new Response(
                JSON.stringify({ error: 'Method Not Allowed' }),
                { status: 405, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const message = req.body.message;

        if (!message) {
            throw new Error('No message provided in the request body.');
        }

        // 1) Call Gemini API
        const geminiRes = await fetch(
            // --- CRITICAL FIX HERE: Changed model to gemini-pro ---
            'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=' +
            process.env.GEMINI_KEY,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ role: 'user', parts: [{ text: message }] }],
                    safetySettings: [
                        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' }
                    ],
                    generationConfig: { temperature: 0.7 }
                })
            }
        );

        if (!geminiRes.ok) {
            const errText = await geminiRes.text();
            console.error('Gemini API error response:', errText);
            throw new Error(
                `Gemini API error ${geminiRes.status}: ${errText.slice(0, 200)}...`
            );
        }

        const geminiJson = await geminiRes.json();
        const reply =
            geminiJson.candidates?.[0]?.content?.parts?.[0]?.text ||
            'Sorry, I could not generate a response at this time. Please try again.';

        return new Response(
            JSON.stringify({ reply }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );

    } catch (err) {
        console.error('API endpoint processing error:', err);
        return new Response(
            JSON.stringify({ error: err.message || 'An unexpected error occurred.' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}