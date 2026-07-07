import React, { createContext, useContext, useState } from "react";

export interface UserProfile {
  age?: number;
  gender?: string;
  income?: number;
  occupation?: string;
  education?: string;
  state?: string;
  district?: string;
  category?: string;
  isStudent: boolean;
  isFarmer: boolean;
  isBusiness: boolean;
  isSeniorCitizen: boolean;
  isDisabled: boolean;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  profile: UserProfile;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isOnboarding: boolean;
  loading: boolean;
  loginWithEmail: (email: string) => Promise<void>;
  loginWithOTP: (phone: string, code: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  completeOnboarding: (profile: UserProfile) => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const defaultProfile: UserProfile = {
  age: 21,
  gender: "Male",
  income: 180000,
  occupation: "Student",
  education: "Undergraduate",
  state: "Delhi",
  district: "New Delhi",
  category: "General",
  isStudent: true,
  isFarmer: false,
  isBusiness: false,
  isSeniorCitizen: false,
  isDisabled: false
};

const defaultUser: User = {
  id: "user-rahul-123",
  fullName: "Rahul Sharma",
  email: "rahul.sharma@gmail.com",
  phone: "+91 98765 43210",
  avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=256&auto=format&fit=crop",
  profile: defaultProfile
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("smart_bharat_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem("smart_bharat_auth") === "true";
  });
  const [isOnboarding, setIsOnboarding] = useState<boolean>(() => {
    return localStorage.getItem("smart_bharat_onboarding") === "true";
  });
  const [loading, setLoading] = useState<boolean>(false);

  const loginWithEmail = async (email: string) => {
    setLoading(true);
    // Simulate API network latency
    await new Promise((resolve) => setTimeout(resolve, 800));
    const newUser = { ...defaultUser, email };
    setUser(newUser);
    setIsAuthenticated(true);
    setIsOnboarding(true); // Trigger beautiful onboarding questionnaire
    localStorage.setItem("smart_bharat_user", JSON.stringify(newUser));
    localStorage.setItem("smart_bharat_auth", "true");
    localStorage.setItem("smart_bharat_onboarding", "true");
    setLoading(false);
  };

  const loginWithOTP = async (phone: string, _code: string) => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    const newUser = { ...defaultUser, phone };
    setUser(newUser);
    setIsAuthenticated(true);
    setIsOnboarding(true);
    localStorage.setItem("smart_bharat_user", JSON.stringify(newUser));
    localStorage.setItem("smart_bharat_auth", "true");
    localStorage.setItem("smart_bharat_onboarding", "true");
    setLoading(false);
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setUser(defaultUser);
    setIsAuthenticated(true);
    setIsOnboarding(true);
    localStorage.setItem("smart_bharat_user", JSON.stringify(defaultUser));
    localStorage.setItem("smart_bharat_auth", "true");
    localStorage.setItem("smart_bharat_onboarding", "true");
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setIsOnboarding(false);
    localStorage.removeItem("smart_bharat_user");
    localStorage.removeItem("smart_bharat_auth");
    localStorage.removeItem("smart_bharat_onboarding");
  };

  const completeOnboarding = async (profile: UserProfile) => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    if (user) {
      const updatedUser = { ...user, profile };
      setUser(updatedUser);
      setIsOnboarding(false);
      localStorage.setItem("smart_bharat_user", JSON.stringify(updatedUser));
      localStorage.setItem("smart_bharat_onboarding", "false");
    }
    setLoading(false);
  };

  const updateProfile = (profileUpdate: Partial<UserProfile>) => {
    if (user) {
      const updatedProfile = { ...user.profile, ...profileUpdate };
      const updatedUser = { ...user, profile: updatedProfile };
      setUser(updatedUser);
      localStorage.setItem("smart_bharat_user", JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isOnboarding,
        loading,
        loginWithEmail,
        loginWithOTP,
        loginWithGoogle,
        logout,
        completeOnboarding,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
