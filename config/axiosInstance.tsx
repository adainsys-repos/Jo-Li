import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://joli.onrender.com/api",
  headers: {
    Authorization: `Bearer ${
      document.cookie
        .split(";")
        .find((c) => c.trim().startsWith(`token=`))
        ?.split("=")[1] || null
    } `,
  },
});

export default axiosInstance;
