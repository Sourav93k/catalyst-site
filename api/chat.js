export const runtime = 'edge'; // This line is for Vercel Edge Functions or similar environments

export default async function handler(req) {
    try {
        // Ensure only POST requests are allowed
        if (req.method !== 'POST') {
            return new Response(
                JSON.stringify({ error: 'Method Not Allowed' }),
                { status: 405, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Parse the incoming message from the request body
        const { message } = await req.json();
        if (!message) {
            throw new Error('No message provided in the request body.');
        }

        // 1) Call Gemini API
        // IMPORTANT: Ensure 'gemini-1.5-flash-latest' or 'gemini-1.5-pro-latest'
        // is the correct and desired model name for your use case.
        // 'gemini-2.5-flash-lite' was an invalid model name.
        const geminiRes = await fetch(
            'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-latest:generateContent?key=' +
            process.env.GEMINI_KEY, // Ensure GEMINI_KEY is set in your environment variables
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ role: 'user', parts: [{ text: message }] }],
                    // Safety settings: BLOCK_NONE for DANGEROUS category is a deliberate choice.
                    // Re-evaluate if you want to block harmful content more strictly for a public-facing app.
                    safetySettings: [
                        { category: 'HARM_CATEGORY_DANGEROUS', threshold: 'BLOCK_NONE' }
                    ],
                    generationConfig: { temperature: 0.7 } // Adjust temperature for creativity (0.0 - 1.0)
                })
            }
        );

        // 2) If Gemini itself returns a non-200 status, read its text and throw an error
        if (!geminiRes.ok) {
            const errText = await geminiRes.text();
            console.error('Gemini API error response:', errText); // Log full error response for debugging
            throw new Error(
                `Gemini API error ${geminiRes.status}: ${errText.slice(0, 200)}...`
            );
        }

        // Parse the JSON response from Gemini
        const geminiJson = await geminiRes.json();

        // Extract the reply from the Gemini response.
        // It safely navigates through nested objects and provides a fallback message.
        const reply =
            geminiJson.candidates?.[0]?.content?.parts?.[0]?.text ||
            'Sorry, I could not generate a response at this time. Please try again.';

        // 3) On success, return the reply as JSON with a 200 status
        return new Response(
            JSON.stringify({ reply }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );

    } catch (err) {
        // 4) On any error during the process, log it and return an error JSON response
        console.error('API endpoint processing error:', err);
        return new Response(
            JSON.stringify({ error: err.message || 'An unexpected error occurred.' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}