import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, StyleSheet, ActivityIndicator, Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, FONTS, RADIUS, CATEGORIES } from "../constants/theme";
import { API } from "../services/api";
import BrandLogo from "../components/BrandLogo";

export default function HomeScreen({ navigation }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [otherService, setOtherService] = useState("");

  const handleAnalyze = async () => {
    if (!text.trim()) {
      Alert.alert("Enter Request", "Please describe what service you need.");
      return;
    }
    setLoading(true);
    try {
      const result = await API.analyze(text);
      navigation.navigate("Reasoning", { result, userText: text });
    } catch (e) {
      Alert.alert("Error", "Could not connect to server. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleCategory = (cat) => {
    setText(`I need a ${cat.label.toLowerCase()} near me`);
  };

  const applyOtherService = () => {
    const trimmed = otherService.trim();
    if (!trimmed) return;
    setText(`I need a ${trimmed.toLowerCase()} near me`);
    setOtherService("");
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.header}>
          <BrandLogo size={34} style={{ marginBottom: 6 }} />
          <Text style={styles.tagline}>Find trusted local experts</Text>
        </View>

        {/* Input */}
        <View style={styles.inputCard}>
          <Text style={styles.label}>What do you need?</Text>
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder="e.g. mujhe kal Gulshan mein plumber chahiye..."
            placeholderTextColor={COLORS.textMuted}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Quick categories */}
        <Text style={styles.sectionTitle}>Quick Select</Text>
        <View style={[styles.catGrid, { marginBottom: 16 }]}>
          {CATEGORIES.filter((cat) => cat.key !== "other").map((cat) => (
            <TouchableOpacity
              key={cat.key}
              style={styles.catCard}
              onPress={() => handleCategory(cat)}
            >
              <Text style={styles.catIcon}>{cat.icon}</Text>
              <Text style={styles.catLabel}>{cat.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Other service input — always visible */}
        <Text style={styles.sectionTitle}>Other Service</Text>
        <View style={styles.otherRow}>
          <TextInput
            style={styles.otherInput}
            value={otherService}
            onChangeText={setOtherService}
            placeholder="e.g. Welder, Gardener, Tailor..."
            placeholderTextColor={COLORS.textMuted}
            returnKeyType="done"
            onSubmitEditing={applyOtherService}
          />
          <TouchableOpacity
            style={[styles.otherBtn, !otherService.trim() && styles.otherBtnDisabled]}
            onPress={applyOtherService}
            disabled={!otherService.trim()}
          >
            <Text style={styles.otherBtnText}>Apply</Text>
          </TouchableOpacity>
        </View>

        {/* CTA */}
        <TouchableOpacity
          style={[styles.btn, loading && styles.btnDisabled]}
          onPress={handleAnalyze}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>🔍 Find Providers</Text>
          )}
        </TouchableOpacity>

        {/* Live signals */}
        <View style={styles.signalsRow}>
          <View style={styles.signal}>
            <View style={[styles.dot, { backgroundColor: COLORS.success }]} />
            <Text style={styles.signalText}>AI Agents Ready</Text>
          </View>
          <View style={styles.signal}>
            <View style={[styles.dot, { backgroundColor: COLORS.success }]} />
            <Text style={styles.signalText}>50 Providers</Text>
          </View>
          <View style={styles.signal}>
            <View style={[styles.dot, { backgroundColor: COLORS.success }]} />
            <Text style={styles.signalText}>Karachi & Lahore</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  container: { padding: 20, paddingBottom: 40 },
  header: { alignItems: "center", marginTop: 20, marginBottom: 32 },
  // logo style replaced by BrandLogo component
  tagline: { fontSize: 14, color: COLORS.textSecondary },
  inputCard: {
    backgroundColor: COLORS.card, borderRadius: RADIUS.lg,
    padding: 16, marginBottom: 24, borderWidth: 1, borderColor: COLORS.border,
  },
  label: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 8, ...FONTS.medium },
  input: {
    color: COLORS.text, fontSize: 15, lineHeight: 22,
    minHeight: 72, textAlignVertical: "top",
  },
  sectionTitle: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 12, ...FONTS.medium },
  catGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  catCard: {
    backgroundColor: COLORS.card, borderRadius: RADIUS.md,
    padding: 14, alignItems: "center", width: "30%",
    borderWidth: 1, borderColor: COLORS.border,
  },
  catIcon: { fontSize: 24, marginBottom: 4 },
  catLabel: { fontSize: 11, color: COLORS.text, ...FONTS.medium },
  otherRow: {
    flexDirection: "row", alignItems: "center", gap: 10,
    marginTop: 4, marginBottom: 20, minHeight: 48,
  },
  otherInput: {
    flex: 1, height: 48, backgroundColor: COLORS.card, borderRadius: RADIUS.md,
    borderWidth: 1, borderColor: COLORS.primary,
    paddingHorizontal: 14,
    color: COLORS.text, fontSize: 14,
  },
  otherBtn: {
    backgroundColor: COLORS.primary, borderRadius: RADIUS.md,
    height: 48, paddingHorizontal: 18,
    justifyContent: "center", alignItems: "center",
  },
  otherBtnDisabled: { opacity: 0.4 },
  otherBtnText: { color: "#fff", fontSize: 14, ...FONTS.semiBold },
  btn: {
    backgroundColor: COLORS.primary, borderRadius: RADIUS.lg,
    paddingVertical: 16, alignItems: "center", marginBottom: 20,
  },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: "#fff", fontSize: 16, ...FONTS.semiBold },
  signalsRow: { flexDirection: "row", justifyContent: "space-around" },
  signal: { flexDirection: "row", alignItems: "center", gap: 6 },
  dot: { width: 7, height: 7, borderRadius: 4 },
  signalText: { fontSize: 11, color: COLORS.textMuted },
});
