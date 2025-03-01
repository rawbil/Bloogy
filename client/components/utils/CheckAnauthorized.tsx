"use client";
import axios from "axios";
import { useContextFunc } from "../context/AppContext";
import { useEffect } from "react";
import {toast} from 'react-hot-toast'

export default function CheckAnauthorized() {
  const { user, setUser, redirectToLogin } = useContextFunc();

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        //if we have 401 unauthorized, clear the user and redirect to login.
        if (error.response && error.response.status === 401) {
          setUser(null);
          toast.error("Session expired. Please log in again.");
          redirectToLogin();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [user, setUser]);
}
