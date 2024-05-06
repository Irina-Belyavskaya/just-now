import axios from "axios";
import { getStorageItem, setStorageItem } from "./context/useStorageState";
import { router } from "expo-router";
import JWT from "expo-jwt";
import { JwtPayload } from "./context/auth-context";

const REACT_APP_API_URL = 'http://192.168.100.38:3000';

const repository = axios.create({
  baseURL: REACT_APP_API_URL
});

repository.interceptors.request.use(
  async (config) => {
    const token = getStorageItem('token');

    if (token && token !== '') {
      config.headers.set('Authorization', `Bearer ${token}`);
    }

    // console.log("CONFIG: ", JSON.stringify(config, null, 2));
    console.log("CONFIG URL: ", config.url);
    console.log("CONFIG URL: ", config.headers);

    let curTime = Number(new Date().getTime()) / 1000;
    let expTime = Number(getStorageItem('expiredAt')) / 1000;

    if ((expTime - curTime) <= 0 && config.url !== '/auth/sign-in') {
      setStorageItem('token', null);
      setStorageItem('user', null);
      setStorageItem('expiredAt', null);
      router.replace("/");
      return config;
    }

    console.log(expTime - curTime)

    if ((expTime - curTime) < 600 && (expTime - curTime) > 0 && token) {
      try {
        console.log('-------REFRESH TOKEN-------')

        const response = await axios.get('http://192.168.100.38:3000/auth/refresh-token', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const key = 'SECRET';
        const decoded: JwtPayload = JWT.decode(token, key);
        setStorageItem('token', response.data.access_token);
        setStorageItem('user', decoded.user_id);
        setStorageItem('expiredAt', response.data.expired_at.toString());
      } catch (e) {
        setStorageItem('token', null);
        setStorageItem('user', null);
        setStorageItem('expiredAt', null);
        router.replace("/");
        return config;
      }
    }

    return config;
  },
);

export default repository;