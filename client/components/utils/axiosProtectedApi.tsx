"use client"
import axios from "axios";
import Router from "next/router";
import toast from "react-hot-toast";
import { useContextFunc } from "../context/AppContext";
import { useEffect } from "react";
 const useAxiosInterceptor = (setUserInfo: (val: any) => void, setAccessToken: (val: any) => void) => {
  //const { setUserInfo, setAccessToken } = useContextFunc();

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          setUserInfo(null);
          setAccessToken(null);
          localStorage.removeItem("access_token");
          localStorage.removeItem("user");
        }
        return Promise.reject(error);
      }
    );
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);
};

/* //axios interceptor for protected routes
const axiosProtectedApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000/api",
  withCredentials: true,
});

//Attach the interceptor only to this instance.
axiosProtectedApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      
    }
    return Promise.reject(error);
  }
);

export default axiosProtectedApi; */
