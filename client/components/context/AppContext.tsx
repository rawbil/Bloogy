"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

interface IContext {
  url: string;
  activationToken: null;
  setActivationToken: Dispatch<SetStateAction<null>>;
  redirectToLogin: () => void;
}

export const AppContext = createContext<IContext | undefined>(undefined);

export default function ProviderFunction({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  //const [accessToken, setAccessToken] = useState("");

  const [activationToken, setActivationToken] = useState(null);
  const url = "http://localhost:8000";

  //* redirect user to login page if cookies are not available
  const redirectToLogin = () => {
    const loginUrl = window.location.origin + "/user/login";
    router.push(
      `${loginUrl}?redirect=${encodeURIComponent(window.location.href)}`
    );
  };

  return (
    <AppContext.Provider
      value={{ url, activationToken, setActivationToken, redirectToLogin }}
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
