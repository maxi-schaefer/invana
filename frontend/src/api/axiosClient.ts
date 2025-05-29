import { getToken } from '@/utils/auth';
import axios from 'axios';
import queryString from 'query-string';

// Define base API URL
export const baseUrl = "/api/";

const axiosClient = axios.create({
  baseURL: baseUrl,
  paramsSerializer: (params) => queryString.stringify({ params }),
});

axiosClient.interceptors.request.use(
  async (config: any) => {
    const token = getToken();
    if (token) {
      config.headers = {
        ...config.headers,
        // 'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      } as any;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  (response: any) => {
    return response;
  },
  (error) => {
    if (!error.response) {
      alert('Network error or server is not reachable');
    }
    return Promise.reject(error.response);
  }
);

export default axiosClient;