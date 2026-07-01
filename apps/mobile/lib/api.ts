import { Platform } from "react-native";

export const getApiUrl = () => {
  // 1. Web Browser (localhost)
  if (Platform.OS === "web") {
    return "http://localhost:8000";
  }

  // 2. Android Emulator (10.0.2.2)
  // __DEV__ is true when you are running with 'npx expo start'
  if (__DEV__ && Platform.OS === "android") {
    return "http://10.0.2.2:8000";
  }

  // 3. Physical Device (Your Wi-Fi IP)
  // Use the IP you found from 'ipconfig' (e.g., 192.168.1.5)
  return "http://192.168.1.5:8000";
};

export const API_URL = getApiUrl();
