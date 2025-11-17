/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";

import { currentUserApi, loginApi, logoutApi } from "@/services/auth";

import type { LoginSchemaType } from "@/validators/auth-validator";

interface AuthContextType {
  user: any;
  accessToken: string | null;
  login: ReturnType<typeof useMutation<any, Error, LoginSchemaType>>;
  logout: ReturnType<typeof useMutation<any, Error>>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType>(null!);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(
    localStorage.getItem("accessToken")
  );

  const { data: user } = useQuery({
    queryKey: ["currentUser", accessToken],
    queryFn: currentUserApi,
    enabled: !!accessToken,
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
      localStorage.setItem("accessToken", data.accessToken);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      setAccessToken(null);
      localStorage.removeItem("accessToken");
    },
  });
  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        login: loginMutation,
        logout: logoutMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
