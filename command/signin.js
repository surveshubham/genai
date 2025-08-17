import axios from "axios";

const [,, username, password] = process.argv;
const parsedData = { username, password };

axios.post('http://localhost:3000/api/v1/auth/signin', parsedData, { withCredentials: true })
  .then(res => console.log(res.data))
  .catch(err => console.error(err.response?.data || err.message));