import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://joli.onrender.com/api",
});

export default axiosInstance;
