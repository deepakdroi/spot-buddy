import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Dimensions,
} from "react-native";
import { useAuthStore } from "@/store/authStore";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "expo-router";
import { differenceInYears } from "date-fns";
import { BarChart } from "react-native-chart-kit";

const muscleGroupData = {
  labels: ["Chest", "Back", "Shoulders", "Legs", "Arms", "Core"],
  datasets: [
    {
      data: [12, 14, 10, 16, 11, 9],
    },
  ],
};
export default function DashboardScreen() {
  const router = useRouter();
  const { user, isLoading } = useAuthStore();
  const { logout } = useAuth();
  const [age, setAge] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (!user) {
      router.push("/(auth)/login");
      return;
    }

    if (user.dob) {
      const dob = new Date(user.dob);
      const calculatedAge = differenceInYears(new Date(), dob);
      setAge(calculatedAge);
    }
  }, [user, router]);

  const handleLogout = async () => {
    await logout();
    router.push("/(auth)/login");
  };

  const handleStartWorkout = () => {
    console.log("Workout started!");
  };

  if (isLoading || !user) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#f8fafc",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  const screenWidth = Dimensions.get("window").width;

  return (
    <ScrollView
      style={{ backgroundColor: "#f8fafc" }}
      contentContainerStyle={{ padding: 24 }}
    >
      <View style={{ marginBottom: 24 }}>
        <Text
          style={{
            fontSize: 32,
            fontWeight: "700",
            color: "#111827",
            marginBottom: 8,
          }}
        >
          Welcome back, {user.name}!
        </Text>
        <Text style={{ fontSize: 15, color: "#6b7280" }}>
          Here&apos;s your fitness dashboard
        </Text>
      </View>

      {/* <View
        style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 20 }}
      >
        <InfoCard
          label="Email"
          value={user.email}
          style={{ marginRight: 12, marginBottom: 12 }}
        />
        <InfoCard
          label="Age"
          value={`${age ?? "-"} years old`}
          style={{ marginBottom: 12 }}
        />
      </View> */}

      <View
        style={{
          backgroundColor: "#fff",
          borderRadius: 16,
          borderWidth: 1,
          borderColor: "#e5e7eb",
          padding: 20,
          marginBottom: 16,
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "700",
            color: "#111827",
            marginBottom: 4,
          }}
        >
          Start Your Workout
        </Text>
        <Text style={{ fontSize: 14, color: "#6b7280", marginBottom: 14 }}>
          Begin a new workout session
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: "#2563eb",
            paddingVertical: 12,
            borderRadius: 10,
            alignItems: "center",
          }}
          onPress={handleStartWorkout}
        >
          <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>
            Start Workout
          </Text>
        </TouchableOpacity>
      </View>

      <View
        style={{
          backgroundColor: "#fff",
          borderRadius: 16,
          borderWidth: 1,
          borderColor: "#e5e7eb",
          padding: 20,
          marginBottom: 16,
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "700",
            color: "#111827",
            marginBottom: 4,
            alignSelf: "flex-start",
          }}
        >
          Muscle Group Performance
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: "#6b7280",
            marginBottom: 14,
            alignSelf: "flex-start",
          }}
        >
          Sets completed per muscle group
        </Text>
        <BarChart
          data={muscleGroupData}
          width={screenWidth - 88}
          height={220}
          yAxisLabel=""
          yAxisSuffix=""
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`, // Blue matching your theme
            labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`, // Gray matching your theme
            style: {
              borderRadius: 16,
            },
            propsForBackgroundLines: {
              strokeDasharray: "", // solid background lines
              stroke: "#e5e7eb",
            },
          }}
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
      </View>

      <View
        style={{
          backgroundColor: "#fff",
          borderRadius: 16,
          borderWidth: 1,
          borderColor: "#e5e7eb",
          padding: 20,
          marginBottom: 16,
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: "700",
            color: "#111827",
            marginBottom: 8,
          }}
        >
          Recent PRs
        </Text>
        <Text style={{ color: "#6b7280" }}>No recent personal records yet</Text>
      </View>

      <TouchableOpacity
        style={{
          backgroundColor: "#dc2626",
          paddingVertical: 12,
          borderRadius: 10,
          alignItems: "center",
        }}
        onPress={handleLogout}
      >
        <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>
          Sign Out
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function InfoCard({
  label,
  value,
  style,
}: {
  label: string;
  value: string;
  style?: any;
}) {
  return (
    <View
      style={{
        flex: 1,
        minWidth: 140,
        backgroundColor: "#fff",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        padding: 16,
        ...style,
      }}
    >
      <Text style={{ fontSize: 13, color: "#6b7280", marginBottom: 6 }}>
        {label}
      </Text>
      <Text style={{ fontSize: 16, fontWeight: "600", color: "#111827" }}>
        {value}
      </Text>
    </View>
  );
}
