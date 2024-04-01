import axios from "axios";

const REACT_APP_API_URL = 'http://192.168.100.38:3000';

const repository = axios.create({
  baseURL: REACT_APP_API_URL
});

// repository.interceptors.request.use(
//     async (config) => {
//         const access_token = Cookies.get('access_token_client');

//         if (access_token) {
//             config.headers.set('Authorization', `Bearer ${access_token}`);
//         }

//         let curTime = Number(new Date().getTime()) / 1000;
//         let expTime = Number(Cookies.get('expired_at_client')) / 1000;

//         if ((expTime - curTime) <= 0) {
//             Cookies.remove('access_token_client');
//             Cookies.remove('expired_at_client');
//             window.location.replace("/app");
//             return config;
//         }

//         if ((expTime - curTime) < 600 && (expTime - curTime) > 0) {
//             try {
//                 Cookies.remove('access_token_client');
//                 Cookies.remove('expired_at_client');
//                 const response = await repository.get("auth/refresh-token", {
//                     headers: {
//                         'Authorization': `Bearer ${access_token}`
//                     }
//                 });
//                 Cookies.set('access_token_client', response.data.access_token);
//                 Cookies.set('expired_at_client', response.data.expired_at);
//             } catch (e) {
//                 Cookies.remove('access_token_client');
//                 Cookies.remove('expired_at_client');
//                 window.location.replace("/app");
//                 return config;
//             }
//         }

//         return config;
//     },
// );

export default repository;