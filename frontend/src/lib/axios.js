// import axios from "axios";

// export const axiosInstance = axios.create({
//   baseURL: "http://localhost:5000/api",
//   //sending cookies in every single request
//   withCredentials: true,
// });


import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" ? "http://localhost:5000/api" : "/api",
  withCredentials: true,
});