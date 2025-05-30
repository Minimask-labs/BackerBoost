import axios from 'axios';
import Cookies from 'js-cookie';
import { decrypt } from '@/service/encryption';

import Router from 'next/router'; // Use Router instead of useRouter


const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: baseURL
});


axiosInstance.interceptors.request.use((config) => {
    const user = decrypt(Cookies.get("token"));
    if (user) {
        config.headers.Authorization = `Bearer ${user}`;
    }
    return config;
});


axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        const status  = error?.response?.status;
      

       if (typeof window !== 'undefined') {

         if ( status === 500) {
          
            Cookies.remove('token');
            Cookies.remove('userData');
            Cookies.remove('userType');
            Router.push('/auth');
          }else if (status === 401 ) {
           Cookies.remove('token');
           Cookies.remove('userData');
           Cookies.remove('userType');
           Router.push('/auth');
         } else {
           console.error('An error occurred:', error?.message);
         }
       }
       return Promise.reject(error);
    }
);

export default axiosInstance;
