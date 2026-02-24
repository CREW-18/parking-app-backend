import axios from 'axios';

// 1. This uses your exact IPv4 address to bridge the Wi-Fi gap
// DO NOT use 'localhost' here; your phone won't find it!
export const API_URL = "http://10.78.169.136:5000/api";

// 2. Create the Axios engine with the correct base address
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;