const axios = require('axios');

// Usage: node callApi.js <endpoint> [method] [data]
// Example: node callApi.js /env GET
// Example: node callApi.js / POST '{"key":"value"}'

const BASE_URL = 'http://localhost:3000';

const [,, endpoint = '/', method = 'GET', data = null] = process.argv;

async function callApi() {
  try {
    const url = BASE_URL + endpoint;
    const options = {
      method: method.toUpperCase(),
      url,
      headers: { 'Content-Type': 'application/json' },
      data: data ? JSON.parse(data) : undefined,
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

callApi();
