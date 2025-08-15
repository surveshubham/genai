import axios from 'axios';

// Usage: node generateWeb.js '{"prompt":"your prompt here", "filename":"optional.html"}'
// Example: node generateWeb.js '{"prompt":"Create a red button.", "filename":"red-button.html"}'

const BASE_URL = 'http://localhost:3000';

const [,, data = null] = process.argv;
let parsedData = {};
if (data) {
  try {
    parsedData = JSON.parse(data);
  } catch (e) {
    console.error('Invalid JSON input. Please check your data argument.');
    process.exit(1);
  }
}

async function callGenerateWebApi() {
  try {
    const url = BASE_URL + '/generate-web';
    const options = {
      method: 'POST',
      url,
      headers: { 'Content-Type': 'application/json' },
      data: { prompt: "Make me landing page for a retro-games store. Retro-arcade noir some might say with css and should look like modern web app should be in black and white", filename: "shubham.html" || 'generated.html' }
    };
    const response = await axios(options);
    console.log('Status:', response.status);
    console.log('Data:', response.data);
  } catch (error) {
    if (error.response) {
      console.error('Error:', error.response.status, error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

callGenerateWebApi();
