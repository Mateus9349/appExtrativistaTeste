import axios from "axios";

const api = axios.create({
  baseURL: "http://89.117.32.159:9000/",
});

export default api;
