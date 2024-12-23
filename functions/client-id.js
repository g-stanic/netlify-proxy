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
    
    // Get the requesting origin
    const origin = event.headers.origin;
    
    // Check if the origin is allowed
    const corsHeaders = {
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type'
    };
    
    // Only add Access-Control-Allow-Origin if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      corsHeaders['Access-Control-Allow-Origin'] = origin;
    }
  
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        clientId: process.env.GITHUB_CLIENT_ID
      })
    };
  };