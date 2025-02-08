import { View, Text, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { registerForPushNotificationsAsync, configureNotifications } from "../utils/notificationUtils";
import { Slot } from "expo-router";
import * as Notifications from "expo-notifications";


export default function Home() {
  const router = useRouter();
   useEffect(() => {
      configureNotifications();
  
      (async () => {
        console.log("Registering for push notifications...");
        const token = await registerForPushNotificationsAsync();
        if (token) {
          console.log("Notification token registered:", token);
        }
      })();
  
      const subscription = Notifications.addNotificationReceivedListener(notification => {
        console.log("Notification received:", notification);
      });
  
      return () => subscription.remove();
    }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to CySafe</Text>
      <Button title="Go to Dashboard" onPress={() => router.push("/dashboard")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
});
