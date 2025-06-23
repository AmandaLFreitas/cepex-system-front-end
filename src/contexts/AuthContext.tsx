import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

interface User {
  id: string;
  login: string;
  roles: string[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  roles: string[];
  login: (token: string) => void;
  logout: () => void;
  hasRole: (roles: string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const processToken = (token: string) => {
    try {
      const decoded = jwtDecode<{
        sub: string;
        role: string;
        userId: string;
      }>(token);
      
      const userRoles = decoded.role ? decoded.role.split(',') : [];

      setUser({
        id: decoded.userId,
        login: decoded.sub,
        roles: userRoles,
      });
    } catch (error) {
      console.error("Error decoding or processing token:", error);
      localStorage.removeItem("token");
      setUser(null);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      processToken(token);
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem("token", token);
    processToken(token);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const hasRole = (roles: string[]) => {
    if (!user) return false;
    return user.roles.some(userRole => roles.includes(userRole));
  };

  const value = {
    user,
    isAuthenticated: !!user,
    roles: user?.roles || [],
    login,
    logout,
    hasRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
