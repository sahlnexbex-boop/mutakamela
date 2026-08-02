"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface CustomerUser {
  name: string;
  email: string;
  nationalId: string;
}

interface CustomerAuthContextType {
  isLoggedIn: boolean;
  isReady: boolean;
  user: CustomerUser | null;
  login: (emailOrId?: string) => void;
  logout: () => void;
}

const CustomerAuthContext = createContext<CustomerAuthContextType>({
  isLoggedIn: false,
  isReady: false,
  user: null,
  login: () => {},
  logout: () => {},
});

const STORAGE_KEY = "mutakamela_customer_auth";

export function CustomerAuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [user, setUser] = useState<CustomerUser | null>(null);

  useEffect(() => {
    const storedAuth = localStorage.getItem(STORAGE_KEY);
    if (storedAuth === "true") {
      setIsLoggedIn(true);
      setUser({
        name: "Ahmed",
        email: "ahmed@mutakamela.sa",
        nationalId: "1029384756",
      });
    }
    setIsReady(true);
  }, []);

  const login = (emailOrId?: string) => {
    setIsLoggedIn(true);
    setUser({
      name: "Ahmed",
      email: emailOrId && emailOrId.includes("@") ? emailOrId : "ahmed@mutakamela.sa",
      nationalId: emailOrId && !emailOrId.includes("@") ? emailOrId : "1029384756",
    });
    localStorage.setItem(STORAGE_KEY, "true");
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <CustomerAuthContext.Provider value={{ isLoggedIn, isReady, user, login, logout }}>
      {children}
    </CustomerAuthContext.Provider>
  );
}

export function useCustomerAuth() {
  return useContext(CustomerAuthContext);
}
