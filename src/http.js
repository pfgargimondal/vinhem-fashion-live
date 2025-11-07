import axios from "axios";

const http = axios.create({
  baseURL:"https://vinhem-ecommerce.workstream.club/api/",
    headers:{
        "Content-Type":"application/json"
    }
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwtToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default http;