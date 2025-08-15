const axios = require("axios");

const BASE_URL = "http://localhost:3000";

const [, , data = null] = process.argv;
let parsedData = {};
if (data) {
  try {
    parsedData = JSON.parse(data);
  } catch (e) {
    console.error("Invalid JSON input. Please check your data argument.");
    process.exit(1);
  }
}

async function callChatApi() {
  try {
    const url = BASE_URL + "/chat";
    const options = {
      method: "POST",
      url,
      headers: { "Content-Type": "application/json" },
      data: parsedData,
    };
    const response = await axios(options);
    console.log("Status:", response.status);
    console.log("Data:", response.data);
  } catch (error) {
    if (error.response) {
      console.error("Error:", error.response.status, error.response.data);
    } else {
      console.error("Error:", error.message);
    }
  }
}

callChatApi();
