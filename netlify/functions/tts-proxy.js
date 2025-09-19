// Netlify Function: Hugging Face TTS Proxy
// Türkçe Text-to-Speech için

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

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch (e) {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  const { text } = payload;
  if (!text) {
    return json({ error: 'Text is required' }, 400);
  }

  // Text'i temizle (çok uzunsa kes)
  const cleanText = text.substring(0, 500); // 500 karakter limit

  try {
    // Hugging Face API Token - Environment variable'dan al
    const HF_TOKEN = process.env.HUGGING_FACE_API_KEY;
    
    if (!HF_TOKEN) {
      throw new Error('HUGGING_FACE_API_KEY environment variable is required');
    }
    
    // Daha güvenilir modeli dene - Facebook TTS
    const response = await fetch("https://api-inference.huggingface.co/models/facebook/fastspeech2-en-ljspeech", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${HF_TOKEN}`
      },
      body: JSON.stringify({
        inputs: cleanText
      })
    });

    if (!response.ok) {
      // Eğer bu da olmadıysa, çok basit bir model dene
      const fallbackResponse = await fetch("https://api-inference.huggingface.co/models/espnet/hindi_male_fgl", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${HF_TOKEN}`
        },
        body: JSON.stringify({
          inputs: cleanText
        })
      });

      if (!fallbackResponse.ok) {
        // Her iki model de başarısız - browser TTS'ye devret
        return json({ error: 'TTS service temporarily unavailable', fallback: true }, 503);
      }

      const audioBuffer = await fallbackResponse.arrayBuffer();
      const base64Audio = Buffer.from(audioBuffer).toString('base64');
      
      return {
        statusCode: 200,
        headers: corsHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ 
          audio: base64Audio,
          model: 'hindi_male'
        })
      };
    }

    const audioBuffer = await response.arrayBuffer();
    const base64Audio = Buffer.from(audioBuffer).toString('base64');
    
    return {
      statusCode: 200,
      headers: corsHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ 
        audio: base64Audio,
        model: 'fastspeech2'
      })
    };

  } catch (error) {
    return json({ error: 'TTS processing failed' }, 500);
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
