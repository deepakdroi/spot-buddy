import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const { login, isLoading, error } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Validation Error", "Please fill in all fields");
      return;
    }

    const success = await login({ email, password });

    if (success) {
      router.push("/(auth)/dashboard");
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, backgroundColor: "#f8fafc" }}
      style={{ backgroundColor: "#f8fafc" }}
    >
      <View style={{ flex: 1, justifyContent: "center", padding: 24 }}>
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 20,
            borderWidth: 1,
            borderColor: "#e5e7eb",
            padding: 24,
            shadowColor: "#000",
            shadowOpacity: 0.05,
            shadowRadius: 10,
            elevation: 2,
          }}
        >
          <Text
            style={{
              fontSize: 28,
              fontWeight: "700",
              color: "#111827",
              marginBottom: 8,
            }}
          >
            Sign In
          </Text>
          <Text style={{ fontSize: 14, color: "#6b7280", marginBottom: 24 }}>
            Enter your credentials to access your account
          </Text>

          <TextInput
            style={{
              backgroundColor: "#f3f4f6",
              borderColor: "#d1d5db",
              borderWidth: 1,
              borderRadius: 10,
              paddingHorizontal: 14,
              paddingVertical: 12,
              marginBottom: 14,
              color: "#111827",
            }}
            placeholder="Email"
            placeholderTextColor="#9ca3af"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            editable={!isLoading}
            autoCapitalize="none"
          />

          <TextInput
            style={{
              backgroundColor: "#f3f4f6",
              borderColor: "#d1d5db",
              borderWidth: 1,
              borderRadius: 10,
              paddingHorizontal: 14,
              paddingVertical: 12,
              marginBottom: 16,
              color: "#111827",
            }}
            placeholder="Password"
            placeholderTextColor="#9ca3af"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!isLoading}
          />

          {error ? (
            <Text style={{ color: "#dc2626", marginBottom: 14 }}>{error}</Text>
          ) : null}

          <TouchableOpacity
            style={{
              backgroundColor: "#2563eb",
              paddingVertical: 12,
              borderRadius: 10,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 14,
            }}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>
                Sign In
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/(auth)/register")}
            disabled={isLoading}
          >
            <Text
              style={{ textAlign: "center", marginTop: 8, color: "#6b7280" }}
            >
              Don&apos;t have an account? Sign up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
