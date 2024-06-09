import axios from "axios";
import { getStorageItem, setStorageItem } from "./context/useStorageState";
import { router } from "expo-router";

// const REACT_APP_API_URL = 'http://192.168.100.38:3000';
const REACT_APP_API_URL = 'https://162f-37-214-61-127.ngrok-free.app';

const repository = axios.create({
  baseURL: REACT_APP_API_URL
});

let isRefreshing = false;
let failedQueue: any = [];

const processQueue = (error: any, token = null) => {
  failedQueue.forEach((prom: any) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

repository.interceptors.request.use(
  async (config) => {
    const accessToken = getStorageItem('accessToken');

    if (accessToken && accessToken !== '') {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }

    console.log("CONFIG URL: ", config.url);
    return config;
  },
);

const resetTokens = () => {
  console.warn('RESET TOKENS');
  setStorageItem('accessToken', null);
  setStorageItem('refreshToken', null);
  router.replace("/");
};

repository.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          return axios(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = getStorageItem('refreshToken');
      console.log('REFRESH TOKEN FROM STORE: ', refreshToken);
      if (refreshToken) {
        try {
          console.log('REFRESH -> ......');
          console.log("CONFIG URL IN ERROR: ", originalRequest.url);

          const response = await axios.post(`${REACT_APP_API_URL}/auth/refresh`, { refreshToken });

          const newAccessToken = response.data.accessToken;
          setStorageItem('accessToken', newAccessToken);
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          console.log('REFRESH TOKEN', response.data.refreshToken);
          console.log('ACCESS TOKEN', response.data.accessToken);
          setStorageItem('refreshToken', response.data.refreshToken);

          processQueue(null, newAccessToken);
          isRefreshing = false;

          return repository(originalRequest);
        } catch (e) {
          console.error('UNAUTHORIZED!');
          processQueue(e, null);
          isRefreshing = false;
          resetTokens();
        }
      } else {
        resetTokens();
      }
    }

    throw error;
  }
);

export default repository;