
import axios from "axios";

const [,, username, password, email] = process.argv;
const parsedData = { username, password };
if (email) parsedData.email = email;

axios.post('http://localhost:3000/api/v1/auth/signup', parsedData)
  .then(res => console.log(res.data))
  .catch(err => console.error(err.response?.data || err.message));