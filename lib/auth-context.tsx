"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  name: string;
  email: string;
  nationalId: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  login: (emailOrId?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  user: null,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Sync with localStorage on client mount
    const storedAuth = localStorage.getItem("mutakamela_auth");
    if (storedAuth === "true") {
      setIsLoggedIn(true);
      setUser({
        name: "Ahmed",
        email: "ahmed@mutakamela.sa",
        nationalId: "1029384756",
      });
    }
  }, []);

  const login = (emailOrId?: string) => {
    setIsLoggedIn(true);
    setUser({
      name: "Ahmed",
      email: emailOrId && emailOrId.includes("@") ? emailOrId : "ahmed@mutakamela.sa",
      nationalId: emailOrId && !emailOrId.includes("@") ? emailOrId : "1029384756",
    });
    localStorage.setItem("mutakamela_auth", "true");
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem("mutakamela_auth");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
