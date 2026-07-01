import React, { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { getToken } from "@/lib/secureStorage";

export function useInitializeAuth() {
  const { setToken, setIsLoading } = useAuthStore();
  const [isInitialized, setIsInitialized] = React.useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      try {
        const token = await getToken();
        if (token) {
          setToken(token);
        }
      } catch (error) {
        console.error("Failed to initialize auth:", error);
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, [setToken, setIsLoading]);

  return isInitialized;
}
