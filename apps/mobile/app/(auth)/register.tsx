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
import DateTimePicker from "@react-native-community/datetimepicker";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "expo-router";

export default function RegisterScreen() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [dob, setDob] = React.useState(new Date(2000, 0, 1));
  const [showDatePicker, setShowDatePicker] = React.useState(false);

  const { register, login, isLoading, error } = useAuth();
  const router = useRouter();

  const handleDateChange = (event: any, selectedDate: any) => {
    if (selectedDate) {
      setDob(selectedDate);
    }
  };

  const handleDismiss = () => {
    setShowDatePicker(false);
  };

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert("Validation Error", "Please fill in all fields");
      return;
    }

    const success = await register({
      name,
      email,
      password,
      dob: dob.toISOString().split("T")[0],
    });

    if (success) {
      await login({ email, password });
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
            Create Account
          </Text>
          <Text style={{ fontSize: 14, color: "#6b7280", marginBottom: 24 }}>
            Join Spot Buddy to start tracking your fitness
          </Text>

          <TextInput
            style={inputStyle}
            placeholder="Name"
            placeholderTextColor="#9ca3af"
            value={name}
            onChangeText={setName}
            editable={!isLoading}
          />

          <TextInput
            style={inputStyle}
            placeholder="Email"
            placeholderTextColor="#9ca3af"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            editable={!isLoading}
            autoCapitalize="none"
          />

          <TouchableOpacity
            style={inputStyle}
            onPress={() => setShowDatePicker(true)}
            disabled={isLoading}
          >
            <Text style={{ color: "#111827" }}>
              DOB: {dob.toLocaleDateString()}
            </Text>
          </TouchableOpacity>

          {showDatePicker ? (
            <DateTimePicker
              value={dob}
              mode="date"
              display="default"
              onValueChange={handleDateChange}
              onDismiss={handleDismiss}
            />
          ) : null}

          <TextInput
            style={{ ...inputStyle, marginBottom: 16 }}
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
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>
                Sign Up
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/(auth)/login")}
            disabled={isLoading}
          >
            <Text
              style={{ textAlign: "center", marginTop: 8, color: "#6b7280" }}
            >
              Already have an account? Sign in
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const inputStyle = {
  backgroundColor: "#f3f4f6",
  borderColor: "#d1d5db",
  borderWidth: 1,
  borderRadius: 10,
  paddingHorizontal: 14,
  paddingVertical: 12,
  marginBottom: 14,
  color: "#111827",
};
