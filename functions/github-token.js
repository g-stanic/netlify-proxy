exports.handler = async function(event, context) {
    // Only allow GET requests
    if (event.httpMethod !== 'GET') {
      return { statusCode: 405, body: 'Method Not Allowed' };
    }

    // Define allowed origins
    const allowedOrigins = [
      'https://g-stanic.github.io',
      'http://localhost:3000',
      'http://127.0.0.1:4000'
    ];

    const origin = event.headers.origin;

    const corsHeaders = {
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type'
    };

    if (allowedOrigins.includes(origin)) {
      corsHeaders['Access-Control-Allow-Origin'] = origin;
    }

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        token: process.env.GITHUB_TOKEN
      })
    };
  };