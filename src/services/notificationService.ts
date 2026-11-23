import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// Configure how notifications behave when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Request permissions for Android / iOS
export async function registerForPushNotificationsAsync() {
  try {
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.log("Notification permission not granted.");
      return;
    }
  } catch (error) {
    console.log("Error setting up notifications:", error);
  }
}

// Schedule a daily habit reminder (e.g. at 18:30)
export async function scheduleDailyHabitReminder(
  habitId: number,
  title: string,
  timeString: string,
) {
  try {
    const [hours, minutes] = timeString.split(":").map(Number);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: `⏰ Time for your habit!`,
        body: `It's time for "${title}". Tap to open your checklist.`,
        data: { habitId },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: hours,
        minute: minutes,
      },
    });
    console.log(`Scheduled daily notification for "${title}" at ${timeString}`);
  } catch (error) {
    console.error("Error scheduling daily reminder:", error);
  }
}
