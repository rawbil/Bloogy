"use client";

import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";
import CheckAnauthorized from "../utils/CheckAnauthorized";

interface IContext {
  url: string;
  activationToken: null;
  setActivationToken: Dispatch<SetStateAction<null>>;
  redirectToLogin: () => void;
  handleLogout: () => Promise<void>;
  user: null,
  setUser: Dispatch<SetStateAction<null>>
}

export const AppContext = createContext<IContext | undefined>(undefined);

export default function ProviderFunction({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState(null);

  const [activationToken, setActivationToken] = useState(null);
  const url = "http://localhost:8000";

  //* redirect user to login page if cookies are not available
  const redirectToLogin = () => {
    const loginUrl = window.location.origin + "/user/login";
    router.push(
      `${loginUrl}?redirect=${encodeURIComponent(window.location.href)}`
    );
  };

  //get cookie
  const handleLogout = async () => {
    try {
      //handle logout logic
      const response = await axios.post(
        `${url}/api/user/logout`,
        {},
        { withCredentials: true }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setActivationToken(null);
        setUser(null);
        redirectToLogin();
      } else {
        //call axios interceptor instead
       /*  toast.error(response.data.message);
        redirectToLogin();  */
         CheckAnauthorized(); 
      }
    } catch (error: any) {
      if (error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  return (
    <AppContext.Provider
      value={{
        url,
        activationToken,
        setActivationToken,
        redirectToLogin,
        handleLogout,
        user,
        setUser
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useContextFunc = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("Context not found");
  return context;
};
