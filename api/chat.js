// REMOVE THIS LINE: export const runtime = 'edge'; // Ensure this line is commented out or deleted

export default async function handler(req) {
    console.log('Function start: Received request.'); // Log 1

    try {
        if (req.method !== 'POST') {
            console.log('Method Not Allowed: Received non-POST request.'); // Log 2
            return new Response(
                JSON.stringify({ error: 'Method Not Allowed' }),
                { status: 405, headers: { 'Content-Type': 'application/json' } }
            );
        }

        console.log('Request method is POST. Attempting to parse body.'); // Log 3
        const message = req.body.message; // Access message from req.body

        if (!message) {
            console.log('No message provided in request body.'); // Log 4
            throw new Error('No message provided in the request body.');
        }

        console.log('Message extracted:', message.substring(0, Math.min(message.length, 50)) + '...'); // Log 5 (show first 50 chars)
        // --- CRITICAL FIX HERE: Changed v1 to v1beta in the API endpoint URL ---
        console.log('Attempting to call Gemini API:', 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'); // Log 6

        const geminiRes = await fetch(
            'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + // <--- Changed v1 to v1beta
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

        console.log('Gemini API call finished. Checking response status.'); // Log 7

        if (!geminiRes.ok) {
            const errText = await geminiRes.text();
            console.error('Gemini API error response (NOT OK status):', errText); // Log 8
            throw new Error(
                `Gemini API error ${geminiRes.status}: ${errText.slice(0, 200)}...`
            );
        }

        console.log('Gemini API response status is OK. Attempting to parse JSON.'); // Log 9
        const geminiJson = await geminiRes.json();
        console.log('Gemini JSON response parsed.'); // Log 10

        const reply =
            geminiJson.candidates?.[0]?.content?.parts?.[0]?.text ||
            'Sorry, I could not generate a response.';
        
        console.log('Reply extracted. Function success.'); // Log 11
        console.log('Preparing to return response to client.'); // Log 12

        return new Response(
            JSON.stringify({ reply }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );

    } catch (err) {
        console.error('API endpoint processing error in catch block:', err); // Log 13
        return new Response(
            JSON.stringify({ error: err.message || 'An unexpected error occurred.' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}