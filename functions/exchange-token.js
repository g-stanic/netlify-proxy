const axios = require('axios');

exports.handler = async function(event, context) {
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
    'Access-Control-Allow-Methods': 'POST',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
  
  // Only add Access-Control-Allow-Origin if origin is in allowed list
  if (allowedOrigins.includes(origin)) {
    corsHeaders['Access-Control-Allow-Origin'] = origin;
  }

  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: ''
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { code } = JSON.parse(event.body);
    
    if (!code || typeof code !== 'string') {
      return { 
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Invalid code format' })
      };
    }

    const response = await axios.post('https://github.com/login/oauth/access_token', {
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code
    }, {
      headers: {
        Accept: 'application/json'
      },
      timeout: 5000 // 5 second timeout
    });

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(response.data)
    };
  } catch (error) {
    console.error('Token exchange error:', error.response?.data || error.message);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Failed to exchange token' })
    };
  }
};