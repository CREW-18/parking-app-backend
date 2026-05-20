import axios from 'axios';
import Constants from 'expo-constants';

const getDevHost = () => {
  const hostUri = Constants.expoConfig?.hostUri || Constants.manifest2?.extra?.expoGo?.debuggerHost;
  return hostUri ? hostUri.split(':')[0] : '127.0.0.1';
};

export const API_URL = process.env.EXPO_PUBLIC_API_URL || `http://${getDevHost()}:5000/api`;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
