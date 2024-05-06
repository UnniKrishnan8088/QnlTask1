import { createContext, useState, useContext } from "react";
import { ChildrenProps } from "../types/types";

type AuthType = {
  token: string;
  login: (token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthType | undefined>(undefined);

export const AuthProvider = ({ children }: ChildrenProps) => {
  const [token, setToken] = useState<string>(
    localStorage.getItem("token") || ""
  );

  const login = (newToken: string) => {
    console.log(token, "👉👉👉");

    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.reload();
    setToken("");
  };

  return (
    <AuthContext.Provider value={{ token: token || "", login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
