import React from "react";
import { Alert } from "react-native";
import axios from "axios";
import { useAuthStore } from "@/store/authStore";
import {
  saveToken,
  clearToken,
  createAuthenticatedClient,
} from "@/lib/secureStorage";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://10.0.2.2:8000";

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  email: string;
  password: string;
  name: string;
  dob: string;
}

export function useAuth() {
  const { setUser, setToken, setIsLoading, setError, reset } = useAuthStore();
  const authStore = useAuthStore();

  const login = React.useCallback(
    async (payload: LoginPayload) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.post(
          `${API_URL}/auth/jwt/login`,
          `username=${payload.email}&password=${payload.password}`,
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          },
        );

        const { access_token } = response.data;

        // Fetch user details
        const userResponse = await axios.get(`${API_URL}/users/me`, {
          headers: { Authorization: `Bearer ${access_token}` },
        });

        const user = userResponse.data;

        // Save token and user state
        await saveToken({ accessToken: access_token });
        setToken(access_token);
        setUser({
          id: user.id,
          email: user.email,
          name: user.name,
          dob: user.dob,
        });

        setIsLoading(false);
        return true;
      } catch (error: any) {
        const message = error.response?.data?.detail || "Login failed";
        setError(message);
        setIsLoading(false);
        Alert.alert("Login Failed", message);
        return false;
      }
    },
    [setUser, setToken, setIsLoading, setError],
  );

  const register = React.useCallback(
    async (payload: RegisterPayload) => {
      setIsLoading(true);
      setError(null);

      try {
        await axios.post(`${API_URL}/auth/register`, {
          email: payload.email,
          password: payload.password,
          name: payload.name,
          dob: new Date(payload.dob).toISOString(),
        });

        setIsLoading(false);
        Alert.alert("Success", "Account created. Please log in.");
        return true;
      } catch (error: any) {
        const message = error.response?.data?.detail || "Registration failed";
        setError(message);
        setIsLoading(false);
        Alert.alert("Registration Failed", message);
        return false;
      }
    },
    [setIsLoading, setError],
  );

  const logout = React.useCallback(async () => {
    setIsLoading(true);
    try {
      await clearToken();
      reset();
      setIsLoading(false);
      return true;
    } catch (error) {
      Alert.alert("Error", "Failed to logout");
      setIsLoading(false);
      return false;
    }
  }, [reset, setIsLoading]);

  const fetchUserProfile = React.useCallback(
    async (token: string) => {
      try {
        const client = createAuthenticatedClient(token);
        const response = await client.get("/users/me");
        setUser({
          id: response.data.id,
          email: response.data.email,
          name: response.data.name,
          dob: response.data.dob,
        });
        return response.data;
      } catch (error) {
        setError("Failed to fetch profile");
        return null;
      }
    },
    [setUser, setError],
  );

  return {
    ...authStore,
    login,
    register,
    logout,
    fetchUserProfile,
  };
}
