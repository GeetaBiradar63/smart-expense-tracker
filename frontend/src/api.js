import axios from "axios";

// ✅ Put your Render backend URL here:
export const API_BASE = "https://YOUR-BACKEND.onrender.com";

export const api = axios.create({
  baseURL: API_BASE,
});
