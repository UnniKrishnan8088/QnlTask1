import { createContext, useState, useContext } from "react";
import { ChildrenProps } from "../types/types";

type AuthType = {
  token: string;
  login: (token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthType | undefined>(undefined);

export const AuthProvider = ({ children }: ChildrenProps) => {
  const [token, setToken] = useState<string | null>(null);

  const login = (newToken: string) => {
    localStorage.setItem("token", newToken);

    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
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
