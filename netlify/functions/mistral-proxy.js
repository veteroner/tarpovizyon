// Netlify Function: Gemini API Proxy
// Protects API key and handles rate limiting / errors

export async function handler(event) {
  // CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: corsHeaders(),
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return json({ error: 'Method Not Allowed' }, 405);
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return json({ error: 'Server missing GEMINI_API_KEY' }, 500);
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch (e) {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  // Gemini API format
  const messages = Array.isArray(payload.messages) ? payload.messages : [];
  const model = payload.model || 'gemini-1.5-flash';
  
  // Convert messages to Gemini format
  const geminiMessages = messages.map(msg => ({
    role: msg.role === 'assistant' ? 'model' : msg.role,
    parts: [{ text: msg.content }]
  }));

  try {
    const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: geminiMessages,
        generationConfig: {
          temperature: payload.temperature || 0.7,
          maxOutputTokens: payload.max_tokens || 2048,
          topP: payload.top_p || 0.95
        }
      })
    });

    const text = await resp.text();
    let data;
    try { data = JSON.parse(text); } catch { data = { raw: text }; }

    if (!resp.ok) {
      return json({ error: 'Upstream error', status: resp.status, data }, resp.status);
    }

    // Convert Gemini response to OpenAI format
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      const geminiResponse = data.candidates[0].content.parts[0].text;
      return json({
        choices: [{
          message: { content: geminiResponse }
        }]
      }, 200);
    }

    return json({ error: 'Invalid Gemini response', data }, 500);
  } catch (err) {
    return json({ error: 'Network error', message: String(err) }, 502);
  }
}

function json(obj, status = 200) {
  return {
    statusCode: status,
    headers: corsHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(obj)
  };
}

function corsHeaders(extra = {}) {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    ...extra
  };
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}
