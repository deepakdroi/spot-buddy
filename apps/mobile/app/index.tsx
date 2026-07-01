import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, backgroundColor: "#fff" }}
      style={{ backgroundColor: "#fff" }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          paddingHorizontal: 24,
          paddingVertical: 64,
        }}
      >
        <View
          style={{
            maxWidth: 640,
            alignSelf: "center",
            width: "100%",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 36,
              fontWeight: "700",
              marginBottom: 24,
              color: "#111827",
              textAlign: "center",
            }}
          >
            Welcome to Spot Buddy
          </Text>
          <Text
            style={{
              fontSize: 18,
              color: "#6b7280",
              textAlign: "center",
              marginBottom: 32,
            }}
          >
            Your ultimate fitness tracking companion. Track your workouts,
            visualize your progress, and achieve your goals.
          </Text>

          <View
            style={{
              width: "100%",
              borderRadius: 16,
              borderWidth: 1,
              borderColor: "#e5e7eb",
              backgroundColor: "#f9fafb",
              padding: 24,
              marginBottom: 24,
            }}
          >
            <Text
              style={{
                fontSize: 24,
                fontWeight: "600",
                marginBottom: 16,
                color: "#111827",
              }}
            >
              Features
            </Text>
            <View>
              <Text style={{ color: "#6b7280", marginBottom: 8 }}>
                • Track your personal records
              </Text>
              <Text style={{ color: "#6b7280", marginBottom: 8 }}>
                • Visualize progress with charts
              </Text>
              <Text style={{ color: "#6b7280", marginBottom: 8 }}>
                • Monitor workout history
              </Text>
              <Text style={{ color: "#6b7280" }}>• Secure authentication</Text>
            </View>
          </View>

          <TouchableOpacity
            style={{
              backgroundColor: "#3b82f6",
              paddingVertical: 12,
              paddingHorizontal: 24,
              borderRadius: 8,
              width: "100%",
              maxWidth: 320,
              marginBottom: 12,
            }}
            onPress={() => router.push("/(auth)/login")}
          >
            <Text
              style={{ color: "#fff", textAlign: "center", fontWeight: "600" }}
            >
              Sign In
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderColor: "#3b82f6",
              paddingVertical: 12,
              paddingHorizontal: 24,
              borderRadius: 8,
              width: "100%",
              maxWidth: 320,
            }}
            onPress={() => router.push("/(auth)/register")}
          >
            <Text
              style={{
                color: "#3b82f6",
                textAlign: "center",
                fontWeight: "600",
              }}
            >
              Create Account
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
