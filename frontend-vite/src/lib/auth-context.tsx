import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  api,
  User,
  isApiError,
  getAuthToken,
  setAuthToken,
  clearAuthToken,
} from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (code: string) => Promise<boolean>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const isAuthenticated = !!user;

  // Load user on mount if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (getAuthToken()) {
        try {
          const response = await api.auth.getCurrentUser();

          if (!isApiError(response)) {
            setUser(response.data);
          } else {
            // If token is invalid, clear it
            clearAuthToken();
            toast({
              variant: "destructive",
              title: "Session expired",
              description: "Please log in again",
            });
          }
        } catch (error) {
          console.error("Failed to load user:", error);
          clearAuthToken();
        }
      }

      setLoading(false);
    };

    loadUser();
  }, [toast]);

  // Login function
  const login = async (code: string): Promise<boolean> => {
    setLoading(true);

    try {
      const response = await api.auth.handleCallback(code);

      if (!isApiError(response)) {
        setAuthToken(response.data.token);
        setUser(response.data.user);
        setLoading(false);
        return true;
      } else {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: response.error,
        });
        setLoading(false);
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "An unexpected error occurred",
      });
      setLoading(false);
      return false;
    }
  };

  // Logout function
  const logout = () => {
    clearAuthToken();
    setUser(null);
    navigate("/");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };

  // Refresh user data
  const refreshUser = async (): Promise<void> => {
    if (getAuthToken()) {
      try {
        const response = await api.auth.getCurrentUser();

        if (!isApiError(response)) {
          setUser(response.data);
        }
      } catch (error) {
        console.error("Failed to refresh user data:", error);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
