'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { AuthContextData } from "@/interfaces/UserDetails";
import { useRouter } from 'next/navigation';
import baseapi from "@/lib/axios";
import { setTokens, removeTokens, getAccessToken } from "../../lib/auth";
import { User } from "@/interfaces/UserDetails";

const AuthContext = createContext<AuthContextData | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = getAccessToken();
      if (token) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    }
    checkAuth();
  }, [])


  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await baseapi.post('/api/token/', { email, password });
      const { access } = response.data;

      setTokens({ accessToken: access });
      setIsAuthenticated(true);
      router.push('/')
    } catch (error: any) {
      console.log("error login:", error.response?.data || error.message);
      setIsAuthenticated(false);
      throw new Error(error.response?.data?.detail || 'Login failed.Please put correct email address and username')
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, password: string, email: string) => {
    try {
      setIsLoading(true);
      const response = await baseapi.post('/api/user/register/', { username, password, email });
      console.log("registration successful", response.data)
      router.push('/login')
    } catch (error: any) {
      console.log("Registration failed!!!", error.message)
      let errorMessage = error.message || 'Registration process is terminated'

      if (error.response?.data) {
        if (error.response.data.username) errorMessage += ` Username: ${error.response.data.username.join(', ')}`;
        if (error.response.data.password) errorMessage += `Password: ${error.response.data.password.join(', ')}`;
        if (error.response.data.email) errorMessage += `email: ${error.response.data.email.join(', ')}`;
      } else {
        throw new Error(errorMessage)

      }
    } finally {
      setIsLoading(false);
    }
  };
  const fetchCurrentUser = async () => {
    const token = getAccessToken();
    if (!token) {
      setIsAuthenticated(false);
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const res = await baseapi.get("/api/user/user/me/", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data);
      setIsAuthenticated(true);
    } catch (err: any) {
  if (err.response?.status === 401) {
    // Not logged in, just ignore
    console.warn("User not logged in");
  } else {
    console.error("Error fetching current user:", err);
  }
  setUser(null);
  setIsAuthenticated(false);
}
  }

  useEffect(() => {
    fetchCurrentUser();
  }, []);



  const logout = () => {
    removeTokens();
    setIsAuthenticated(false);
    router.push('/login');
  };

 


  return (
    <AuthContext.Provider value={{ isAuthenticated, login, register, logout, isLoading, user }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
