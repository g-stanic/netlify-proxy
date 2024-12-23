const { Octokit } = require('@octokit/rest');

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
    const { token, owner, repo, branch, commitMessage, content, path, sha } = JSON.parse(event.body);

    const octokit = new Octokit({ auth: token });

    const response = await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message: commitMessage,
      content: Buffer.from(content).toString('base64'),
      sha,
      branch
    });

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ success: true, data: response.data })
    };
  } catch (error) {
    console.error('Error pushing commit:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Failed to push commit' })
    };
  }
};