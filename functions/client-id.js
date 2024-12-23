exports.handler = async function(event, context) {
    // Only allow GET requests
    if (event.httpMethod !== 'GET') {
      return { statusCode: 405, body: 'Method Not Allowed' };
    }
  
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': 'https://g-stanic.github.io',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({
        clientId: process.env.GITHUB_CLIENT_ID
      })
    };
  };