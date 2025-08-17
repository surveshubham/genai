import axios from "axios";

axios.get("http://localhost:3000/api/v1/auth/me", { withCredentials: true })
  .then(res => console.log(res.data))
  .catch(err => console.error(err.response?.data || err.message));