import axios from "axios";

const [,, data = null] = process.argv;
let parsedData = {};
if (data) {
  try { parsedData = JSON.parse(data); } catch (e) { console.error('Invalid JSON'); process.exit(1); }
}

axios.post('http://localhost:3000/api/v1/auth/signin', parsedData, { withCredentials: true })
  .then(res => console.log(res.data))
  .catch(err => console.error(err.response?.data || err.message));