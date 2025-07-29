// No 'export default' or 'export const runtime = 'edge';'
exports.handler = async function(event, context) { // Netlify Function export

    // Netlify event.body needs to be parsed
    let reqBody;
    try {
        reqBody = JSON.parse(event.body); // event.body is a string
    } catch (e) {
        console.error("Failed to parse event body in Netlify function:", e);
        return { // Return Netlify-specific error response
            statusCode: 400,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Invalid JSON in request body.' })
        };
    }
    const message = reqBody.message; // Extract message from the parsed body

    console.log('Function start: Received request.'); // Log 1

    try {
        // event.httpMethod is similar to req.method
        if (event.httpMethod !== 'POST') {
            console.log('Method Not Allowed: Received non-POST request.'); // Log 2
            return {
                statusCode: 405,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'Method Not Allowed' })
            };
        }

        console.log('Request method is POST. Attempting to parse body.'); // Log 3 (message is already parsed here by reqBody.message)

        if (!message) {
            console.log('No message provided in request body.'); // Log 4
            throw new Error('No message provided in the request body.');
        }

        console.log('Message extracted:', message.substring(0, Math.min(message.length, 50)) + '...'); // Log 5
        console.log('Attempting to call Gemini API:', 'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent'); // Log 6

        const geminiRes = await fetch(
            'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=' +
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

        return { // Netlify Function success return
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reply })
        };

    } catch (err) {
        console.error('API endpoint processing error in catch block:', err); // Log 13
        return { // Netlify Function error return
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: err.message || 'An unexpected error occurred.' })
        };
    }
}