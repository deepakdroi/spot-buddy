import * as SecureStore from "expo-secure-store";
import axios, { AxiosInstance } from "axios";
import { Platform } from "react-native";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://10.0.2.2:8000";

interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export async function saveToken(tokens: AuthTokens): Promise<void> {
  try {
    if (Platform.OS === "web") {
      localStorage.setItem("accessToken", tokens.accessToken);
      if (tokens.refreshToken) {
        localStorage.setItem("refreshToken", tokens.refreshToken);
      }
    } else {
      await SecureStore.setItemAsync("accessToken", tokens.accessToken);
      if (tokens.refreshToken) {
        await SecureStore.setItemAsync("refreshToken", tokens.refreshToken);
      }
    }
  } catch (error) {
    console.error("Failed to save token:", error);
    throw error;
  }
}

export async function getToken(): Promise<string | null> {
  try {
    if (Platform.OS === "web") {
      return localStorage.getItem("accessToken");
    }
    return await SecureStore.getItemAsync("accessToken");
  } catch (error) {
    console.error("Failed to get token:", error);
    return null;
  }
}

export async function clearToken(): Promise<void> {
  try {
    if (Platform.OS === "web") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    } else {
      await SecureStore.deleteItemAsync("accessToken");
      await SecureStore.deleteItemAsync("refreshToken");
    }
  } catch (error) {
    console.error("Failed to clear token:", error);
    throw error;
  }
}

export function createAuthenticatedClient(token: string | null): AxiosInstance {
  const client = axios.create({
    baseURL: API_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (token) {
    client.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  return client;
}
