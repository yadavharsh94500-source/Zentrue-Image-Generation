import { createContext, useContext } from "react";

export const AuthContext = createContext({
  isLoggedIn: false,
  login: async () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);