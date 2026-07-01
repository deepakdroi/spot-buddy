import React from "react";
import { View, Text } from "react-native";
import { useInitializeAuth } from "@/hooks/useInitializeAuth";
import { useAuthStore } from "@/store/authStore";
import { Slot, usePathname, useRouter } from "expo-router";

export default function RootLayout() {
  const isInitialized = useInitializeAuth();
  const { token } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    if (!isInitialized) return;

    if (token) {
      if (pathname !== "/dashboard") {
        router.replace("/(auth)/dashboard");
      }
      return;
    }

    if (pathname === "/" || pathname === "/login" || pathname === "/register") {
      return;
    }

    router.replace("/(auth)/login");
  }, [isInitialized, token, pathname, router]);

  if (!isInitialized) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#fff",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#4b5563" }}>Loading...</Text>
      </View>
    );
  }

  return <Slot />;
}
