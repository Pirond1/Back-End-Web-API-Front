import axios from "axios";

function getToken () {
  return localStorage.getItem("access_token");
}
    
const api = axios.create({
  baseURL: "https://localhost:7233",
});

api.interceptors.request.use(async config => {
  const token = getToken();

  if (token) {
    config.headers.authorization = `Bearer ${token}`;
  }

  return config;
});


export default api;