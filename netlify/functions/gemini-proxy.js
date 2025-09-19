// Netlify Function: AI API Proxy
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
    return json({ error: 'Server configuration error' }, 500);
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch (e) {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  // Model mapping (internal use only)
  const modelMapping = {
    'model-v25-pro': 'gemini-2.5-pro',
    'model-v25-flash': 'gemini-2.5-flash', 
    'model-v20-flash': 'gemini-2.0-flash',
    'model-v25-lite': 'gemini-2.5-flash-lite',
    'model-v15-pro': 'gemini-1.5-pro',
    'model-v15-flash': 'gemini-1.5-flash'
  };

  // API format
  const messages = Array.isArray(payload.messages) ? payload.messages : [];
  const clientModel = payload.model || 'model-v15-flash';
  const actualModel = modelMapping[clientModel] || 'gemini-1.5-flash';
  
  // Convert messages to API format
  const apiMessages = messages.filter(msg => msg.role !== 'system').map(msg => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }]
  }));

  // System message'i instruction olarak ekle
  const systemMessage = messages.find(msg => msg.role === 'system');
  const systemInstruction = systemMessage ? systemMessage.content : '';

  try {
    const requestBody = {
      contents: apiMessages,
      generationConfig: {
        temperature: payload.temperature || 0.7,
        maxOutputTokens: payload.max_tokens || 2048,
        topP: payload.top_p || 0.95
      }
    };

    // System instruction varsa ekle
    if (systemInstruction) {
      requestBody.systemInstruction = {
        parts: [{ text: systemInstruction }]
      };
    }
    const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${actualModel}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    const text = await resp.text();
    let data;
    try { data = JSON.parse(text); } catch { data = { raw: text }; }

    if (!resp.ok) {
      return json({ error: 'Service temporarily unavailable', status: resp.status }, resp.status);
    }

    // Convert API response to OpenAI format
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      const apiResponse = data.candidates[0].content.parts[0].text;
      return json({
        choices: [{
          message: { content: apiResponse }
        }]
      }, 200);
    }

    return json({ error: 'Invalid response format' }, 500);
  } catch (err) {
    return json({ error: 'Network error' }, 502);
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
