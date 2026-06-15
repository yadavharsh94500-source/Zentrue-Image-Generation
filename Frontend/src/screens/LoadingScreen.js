// // LoadingScreen.js — Zentrue Theme
// import React, { useEffect, useRef, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Animated,
//   SafeAreaView,
// } from "react-native";
// import { useLocalSearchParams } from "expo-router";
// import { COLORS } from "../constants/theme";

// const MESSAGES = [
//   "Analyzing your clothing...",
//   "Building the model...",
//   "Applying style and pose...",
//   "Rendering details...",
//   "Finalizing outputs...",
// ];

// export default function LoadingScreen() {
//   const { generations } = useLocalSearchParams();
//   const [messageIndex, setMessageIndex] = useState(0);
//   const fadeAnim = useRef(new Animated.Value(1)).current;
//   const rotateAnim = useRef(new Animated.Value(0)).current;
//   const pulseAnim = useRef(new Animated.Value(1)).current;

//   // ─── Rotate spinner ──────────────────────────────────────────
//   useEffect(() => {
//     Animated.loop(
//       Animated.timing(rotateAnim, {
//         toValue: 1,
//         duration: 1800,
//         useNativeDriver: true,
//       })
//     ).start();
//   }, []);

//   // ─── Pulse glow ───────────────────────────────────────────────
//   useEffect(() => {
//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(pulseAnim, {
//           toValue: 1.15,
//           duration: 1000,
//           useNativeDriver: true,
//         }),
//         Animated.timing(pulseAnim, {
//           toValue: 1,
//           duration: 1000,
//           useNativeDriver: true,
//         }),
//       ])
//     ).start();
//   }, []);

//   // ─── Rotate messages ──────────────────────────────────────────
//   useEffect(() => {
//     const interval = setInterval(() => {
//       Animated.timing(fadeAnim, {
//         toValue: 0,
//         duration: 300,
//         useNativeDriver: true,
//       }).start(() => {
//         setMessageIndex((prev) => (prev + 1) % MESSAGES.length);
//         Animated.timing(fadeAnim, {
//           toValue: 1,
//           duration: 300,
//           useNativeDriver: true,
//         }).start();
//       });
//     }, 2800);

//     return () => clearInterval(interval);
//   }, []);

//   const spin = rotateAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: ["0deg", "360deg"],
//   });

//   return (
//     <SafeAreaView style={styles.safe}>
//       <View style={styles.container}>

//         {/* Spinner */}
//         <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
//           <View style={styles.spinnerWrapper}>
//             <Animated.View
//               style={[styles.spinner, { transform: [{ rotate: spin }] }]}
//             />
//             <View style={styles.spinnerInner}>
//               <Text style={styles.spinnerIcon}>✦</Text>
//             </View>
//           </View>
//         </Animated.View>

//         {/* Status text */}
//         <Animated.Text style={[styles.message, { opacity: fadeAnim }]}>
//           {MESSAGES[messageIndex]}
//         </Animated.Text>

//         <Text style={styles.subtext}>
//           Generating {generations || 1}{" "}
//           {Number(generations) === 1 ? "image" : "images"}
//         </Text>

//         <Text style={styles.warning}>
//           Please don't close the app
//         </Text>
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safe: {
//     flex: 1,
//     backgroundColor: COLORS.background,
//   },
//   container: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//     paddingHorizontal: 32,
//     gap: 20,
//   },
//   spinnerWrapper: {
//     width: 90,
//     height: 90,
//     alignItems: "center",
//     justifyContent: "center",
//     marginBottom: 12,
//   },
//   spinner: {
//     position: "absolute",
//     width: 90,
//     height: 90,
//     borderRadius: 45,
//     borderWidth: 2.5,
//     borderColor: "transparent",
//     borderTopColor: COLORS.accent,
//     borderRightColor: COLORS.accentDim,
//   },
//   spinnerInner: {
//     width: 62,
//     height: 62,
//     borderRadius: 31,
//     backgroundColor: COLORS.accentDim,
//     alignItems: "center",
//     justifyContent: "center",
//     borderWidth: 1,
//     borderColor: COLORS.accentDim,
//   },
//   spinnerIcon: {
//     color: COLORS.accent,
//     fontSize: 22,
//   },
//   message: {
//     color: COLORS.textPrimary,
//     fontSize: 18,
//     fontWeight: "600",
//     textAlign: "center",
//     letterSpacing: -0.3,
//   },
//   subtext: {
//     color: COLORS.textSecondary,
//     fontSize: 13,
//     textAlign: "center",
//   },
//   warning: {
//     color: COLORS.textMuted,
//     fontSize: 12,
//     textAlign: "center",
//     position: "absolute",
//     bottom: 50,
//   },
// });






















// LoginScreen.js — Zentrue Theme
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Image,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { COLORS } from "../constants/theme";

const ADMIN_EMAIL = process.env.EXPO_PUBLIC_ADMIN_EMAIL || "";
const ADMIN_PASSWORD = process.env.EXPO_PUBLIC_ADMIN_PASSWORD || "";

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");

    // Basic validation
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    if (!password.trim()) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);

    // Simulate slight delay for UX
    await new Promise((r) => setTimeout(r, 600));

    // Check against .env credentials
    if (
      email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() &&
      password === ADMIN_PASSWORD
    ) {
      // Save session — _layout.tsx effect will redirect to "/"
      await login();
    } else {
      setError("Incorrect email or password. Please try again.");
    }

    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ── Logo / Brand ── */}
          <View style={styles.brandWrap}>
            <Image
              source={require("../../assets/favicon.webp")}
              style={styles.logoImage}
              resizeMode="contain"
            />
            <Text style={styles.brandName}>Zentrue</Text>
            <Text style={styles.brandTagline}>AI Fashion Model Generator</Text>
          </View>

          {/* ── Card ── */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Welcome back</Text>
            <Text style={styles.cardSubtitle}>Sign in to continue</Text>

            {/* Error message */}
            {error ? (
              <View style={styles.errorBox}>
                <Feather name="alert-circle" size={14} color="#DC2626" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            {/* Email */}
            <View style={styles.fieldWrap}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputWrap}>
                <Feather
                  name="mail"
                  size={16}
                  color={COLORS.textMuted}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="admin@example.com"
                  placeholderTextColor={COLORS.textMuted}
                  value={email}
                  onChangeText={(t) => {
                    setEmail(t);
                    setError("");
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!loading}
                />
              </View>
            </View>

            {/* Password */}
            <View style={styles.fieldWrap}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputWrap}>
                <Feather
                  name="lock"
                  size={16}
                  color={COLORS.textMuted}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Enter your password"
                  placeholderTextColor={COLORS.textMuted}
                  value={password}
                  onChangeText={(t) => {
                    setPassword(t);
                    setError("");
                  }}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!loading}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeBtn}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Feather
                    name={showPassword ? "eye-off" : "eye"}
                    size={16}
                    color={COLORS.textMuted}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Login Button */}
            <TouchableOpacity
              style={[styles.loginBtn, loading && styles.loginBtnDisabled]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Feather name="log-in" size={16} color="#fff" />
                  <Text style={styles.loginBtnText}>Sign In</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* ── Footer ── */}
          <Text style={styles.footer}>
            Access restricted to authorized users only.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },

  // ── Brand ──
  brandWrap: {
    alignItems: "center",
    marginBottom: 32,
  },
  logoImage: {
    width: 80,
    height: 80,
    marginBottom: 12,
  },
  brandName: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  brandTagline: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 3,
  },

  // ── Card ──
  card: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: COLORS.surfaceRaised,
    borderRadius: 20,
    padding: 24,
    borderWidth: 0.5,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 20,
  },

  // ── Error ──
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
  },
  errorText: {
    color: "#DC2626",
    fontSize: 13,
    flex: 1,
    lineHeight: 18,
  },

  // ── Fields ──
  fieldWrap: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textPrimary,
    height: "100%",
  },
  eyeBtn: {
    paddingLeft: 8,
  },

  // ── Button ──
  loginBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: COLORS.accent,
    borderRadius: 12,
    paddingVertical: 15,
    marginTop: 8,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  loginBtnDisabled: {
    opacity: 0.7,
  },
  loginBtnText: {
    color: COLORS.textOnAccent,
    fontSize: 15,
    fontWeight: "700",
  },

  // ── Footer ──
  footer: {
    marginTop: 24,
    fontSize: 12,
    color: COLORS.textMuted,
    textAlign: "center",
  },
});