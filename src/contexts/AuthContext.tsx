import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

interface User {
  id: string;
  login: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  hasRole: (roles: string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<{
          sub: string;
          role: string;
          userId: string;
        }>(token);
        setUser({
          id: decoded.userId,
          login: decoded.sub,
          role: decoded.role,
        });
      } catch (error) {
        console.error("Error decoding token:", error);
        localStorage.removeItem("token");
      }
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem("token", token);
    const decoded = jwtDecode<{ sub: string; role: string; userId: string }>(
      token
    );
    setUser({
      id: decoded.userId,
      login: decoded.sub,
      role: decoded.role,
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const hasRole = (roles: string[]) => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, login, logout, hasRole }}
    >
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
