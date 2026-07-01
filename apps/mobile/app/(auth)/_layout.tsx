import { Stack, useRouter } from "expo-router";
import { TouchableOpacity, Text, View, Alert } from "react-native";
import { useAuth } from "@/hooks/useAuth";

export default function AuthLayout() {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/(auth)/login");
        },
      },
    ]);
  };
  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />

      <Stack.Screen
        name="dashboard"
        options={{
          headerShown: true,
          headerTitle: "Spot Buddy",
          headerTitleStyle: {
            fontWeight: "700",
            color: "#111827",
          },
          headerRight: () => (
            <TouchableOpacity
              onPress={handleLogout}
              style={{ paddingHorizontal: 16 }}
            >
              <Text style={{ fontSize: 24, color: "#111827" }}>☰</Text>
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
}
