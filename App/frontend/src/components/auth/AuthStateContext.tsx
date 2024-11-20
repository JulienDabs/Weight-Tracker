import React, { createContext, useState, ReactNode, useContext } from "react";

interface AuthState {
  isVerified: boolean;
  profileCompleted: boolean;
  setIsVerified: (value: boolean) => void;
  setProfileCompleted: (value: boolean) => void;
}

const AuthStateContext = createContext<AuthState | undefined>(undefined);

interface AuthStateProviderProps {
  children: ReactNode;
}

export const AuthStateProvider: React.FC<AuthStateProviderProps> = ({ children }) => {
  const [isVerified, setIsVerified] = useState(false);
  const [profileCompleted, setProfileCompleted] = useState(false);

  return (
    <AuthStateContext.Provider
      value={{ isVerified, profileCompleted, setIsVerified, setProfileCompleted }}
    >
      {children}
    </AuthStateContext.Provider>
  );
};

export const useAuthState = () => {
  const context = useContext(AuthStateContext);
  if (!context) {
    throw new Error("useAuthState must be used within an AuthStateProvider");
  }
  return context;
};
