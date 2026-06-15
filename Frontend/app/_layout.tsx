// _layout.tsx — Zentrue Theme
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState, useCallback } from "react";
import * as SplashScreen from "expo-splash-screen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { checkHealth } from "../src/services/api";
import { AuthContext } from "../src/context/AuthContext";
import { COLORS } from "../src/constants/theme";

const SESSION_KEY = "auth_session";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const [authChecked, setAuthChecked] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const init = async () => {
      checkHealth().catch(() => {});
      try {
        const session = await AsyncStorage.getItem(SESSION_KEY);
        setIsLoggedIn(session === "true");
      } catch {
        setIsLoggedIn(false);
      } finally {
        setAuthChecked(true);
        SplashScreen.hideAsync();
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (!authChecked) return;

    const inLoginScreen = segments[0] === "login";

    if (!isLoggedIn && !inLoginScreen) {
      router.replace("/login");
    } else if (isLoggedIn && inLoginScreen) {
      router.replace("/");
    }
  }, [authChecked, isLoggedIn, segments]);

  const login = useCallback(async () => {
    await AsyncStorage.setItem(SESSION_KEY, "true");
    setIsLoggedIn(true);
  }, []);

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem(SESSION_KEY);
    setIsLoggedIn(false);
  }, []);

  if (!authChecked) {
    return null;
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: COLORS.background },
            animation: "fade",
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="login" options={{ animation: "fade" }} />
          <Stack.Screen
            name="loading"
            options={{
              animation: "fade",
              gestureEnabled: false,
            }}
          />
          <Stack.Screen
            name="results"
            options={{
              animation: "slide_from_right",
            }}
          />
        </Stack>
      </AuthContext.Provider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});