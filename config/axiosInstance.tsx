import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: "http://localhost:8000/api",
  baseURL: "https://joli.onrender.com/api",
});

export default axiosInstance;
