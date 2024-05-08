import axios from "axios";
import { getStorageItem, setStorageItem } from "./context/useStorageState";
import { router } from "expo-router";

const REACT_APP_API_URL = 'http://192.168.100.38:3000';

const repository = axios.create({
  baseURL: REACT_APP_API_URL
});

repository.interceptors.request.use(
  async (config) => {
    const accessToken = getStorageItem('accessToken');

    if (accessToken && accessToken !== '') {
      config.headers.set('Authorization', `Bearer ${accessToken}`);
    }

    // console.log("CONFIG REQUEST: ", JSON.stringify(config.headers, null, 2));
    console.log("CONFIG URL: ", config.url);

    return config;
  },
);

repository.interceptors.response.use((config) => {
  return config;
}, async (error) => {
  const originalRequest = error.config;
  if (error.response.status == 401 && originalRequest && !originalRequest._isRetry) {
    originalRequest._isRetry = true;
    const refreshToken = getStorageItem('refreshToken');
    if (refreshToken) {
      try {
        console.log('REFRESH -> ......');
        const response = await axios.post(`${REACT_APP_API_URL}/auth/refresh`, { refreshToken });
        const newAccessToken = response.data.accessToken;
        setStorageItem('accessToken', newAccessToken);
        setStorageItem('refreshToken', response.data.refreshToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return repository.request(originalRequest);
      } catch (e) {
        console.log('UNAUTHORIZED!');
        setStorageItem('accessToken', null);
        setStorageItem('refreshToken', null);
        setStorageItem('user', null);
        router.replace("/");
      }
    }
  }

  throw error;
})

export default repository;