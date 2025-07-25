// api/chat.js
export const runtime = 'edge';

export default async function handler(req) {
  const { message } = await req.json();

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash-lite:generateContent?key=${process.env.GEMINI_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: message }] }],
        safetySettings: [{ category: 'HARM_CATEGORY_DANGEROUS', threshold: 'BLOCK_NONE' }],
        generationConfig: { temperature: 0.7 },
      }),
    }
  );

  const data = await res.json();
  const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'I\'m sorry, I don’t have an answer.';

  return new Response(JSON.stringify({ reply }), {
    headers: { 'Content-Type': 'application/json' },
  });
}