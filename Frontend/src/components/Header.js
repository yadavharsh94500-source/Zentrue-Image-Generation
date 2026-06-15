// // components/Header.js — Zentrue Theme
// import React from "react";
// import { View, Image, Text, TouchableOpacity, StyleSheet } from "react-native";
// import { Feather } from "@expo/vector-icons";
// import { COLORS } from "../constants/theme";

// export default function Header({ onLogout }) {
//   return (
//     <View style={styles.container}>
//       {/* Left — Logo */}
//       <Image
//         source={require("../../assets/logo-new.png")}
//         style={styles.logoImage}
//         resizeMode="contain"
//       />

//       {/* Right — Badge + Logout */}
//       <View style={styles.right}>
//         <View style={styles.badge}>
//           <View style={styles.badgeDot} />
//           <Text style={styles.badgeText}>AI Powered</Text>
//         </View>

//         {onLogout && (
//           <TouchableOpacity
//             onPress={onLogout}
//             style={styles.logoutBtn}
//             activeOpacity={0.7}
//             hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
//           >
//             <Feather name="log-out" size={18} color="#FFFFFF" />
//           </TouchableOpacity>
//         )}
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingHorizontal: 20,
//     paddingVertical: 14,
//     backgroundColor: COLORS.accent,
//   },

//   logoImage: {
//     width: 150,
//     height: 50,
//   },

//   // ── Right side ──
//   right: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 12,
//   },

//   // ── Badge ──
//   badge: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 5,
//     backgroundColor: "rgba(255,255,255,0.15)",
//     borderWidth: 0.5,
//     borderColor: "rgba(255,255,255,0.3)",
//     borderRadius: 20,
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//   },
//   badgeDot: {
//     width: 6,
//     height: 6,
//     borderRadius: 3,
//     backgroundColor: COLORS.textOnAccent,
//   },
//   badgeText: {
//     color: COLORS.textOnAccent,
//     fontSize: 11,
//     fontWeight: "600",
//   },

//   // ── Logout ──
//   logoutBtn: {
//     padding: 4,
//   },
// });








// components/Header.js — Zentrue Theme
import React from "react";
import { View, Image, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../constants/theme";

export default function Header({ onLogout }) {
  return (
    <LinearGradient
      colors={[COLORS.accentGradientEnd, COLORS.accentGradientStart]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.container}
    >
      {/* Left — Logo */}
      <Image
        source={require("../../assets/logo-new.png")}
        style={styles.logoImage}
        resizeMode="contain"
      />

      {/* Right — Badge + Logout */}
      <View style={styles.right}>
        <View style={styles.badge}>
          <View style={styles.badgeDot} />
          <Text style={styles.badgeText}>AI Powered</Text>
        </View>

        {onLogout && (
          <TouchableOpacity
            onPress={onLogout}
            style={styles.logoutBtn}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Feather name="log-out" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
  },

  logoImage: {
    width: 150,
    height: 50,
  },

  // ── Right side ──
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  // ── Badge ──
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderWidth: 0.5,
    borderColor: "rgba(255,255,255,0.3)",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.textOnAccent,
  },
  badgeText: {
    color: COLORS.textOnAccent,
    fontSize: 11,
    fontWeight: "600",
  },

  // ── Logout ──
  logoutBtn: {
    padding: 4,
  },
});