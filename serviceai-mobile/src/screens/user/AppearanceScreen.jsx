import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Switch, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, FONTS, RADIUS } from "../../constants/theme";
import { useTheme } from "../../contexts/ThemeContext";
import { useLanguage } from "../../contexts/LanguageContext";

const APPEARANCE_KEY = "@serviceai_appearance";

export default function AppearanceScreen() {
  const { theme: activeTheme, setTheme: applyTheme } = useTheme();
  const { locale, t, changeLanguage } = useLanguage();

  const [theme,         setThemeLocal]  = useState(activeTheme);
  const [compactMode,   setCompactMode] = useState(false);
  const [animationsOn,  setAnimationsOn] = useState(true);

  useEffect(() => {
    setThemeLocal(activeTheme);
    AsyncStorage.getItem(APPEARANCE_KEY)
      .then((val) => {
        if (val) {
          const saved = JSON.parse(val);
          if (saved.compactMode  != null) setCompactMode(saved.compactMode);
          if (saved.animationsOn != null) setAnimationsOn(saved.animationsOn);
        }
      })
      .catch(() => {});
  }, [activeTheme]);

  const save = async (patch) => {
    const next = { theme, compactMode, animationsOn, ...patch };
    if (patch.theme != null) {
      setThemeLocal(patch.theme);
      applyTheme(patch.theme);  // live update via ThemeContext
    }
    if (patch.compactMode  != null) setCompactMode(patch.compactMode);
    if (patch.animationsOn != null) setAnimationsOn(patch.animationsOn);
    try {
      await AsyncStorage.setItem(APPEARANCE_KEY, JSON.stringify(next));
    } catch (_) {}
  };

  const handleLanguageChange = async (code) => {
    await changeLanguage(code);
    Alert.alert(
      t("languageSaved"),
      t("restartApp"),
      [{ text: "OK" }]
    );
  };

  const THEMES = [
    { key: "dark",  label: t("dark"),   icon: "moon",         desc: locale === "ur" ? "رات کے وقت آنکھوں کے لیے آسان" : "Easy on the eyes at night" },
    { key: "light", label: t("light"),  icon: "sunny",        desc: locale === "ur" ? "روشن اور صاف انٹرفیس" : "Bright and clean interface" },
    { key: "auto",  label: t("system"), icon: "phone-portrait", desc: locale === "ur" ? "سسٹم کی ترتیبات لاگو کریں" : "Follow device setting" },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <View style={styles.container}>

        <View style={styles.heroCard}>
          <View style={styles.heroIcon}>
            <Ionicons name="moon-outline" size={28} color="#A78BFA" />
          </View>
          <Text style={styles.heroTitle}>{t("appearance")}</Text>
          <Text style={styles.heroSub}>
            {locale === "ur" ? "اپنے آلے پر بک این فکس کی ظاہری شکل کو اپنی مرضی کے مطابق بنائیں" : "Customize how BookNFix looks on your device"}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>{t("theme")}</Text>
        <View style={styles.themeRow}>
          {THEMES.map((tItem) => {
            const active = theme === tItem.key;
            return (
              <TouchableOpacity
                key={tItem.key}
                style={[styles.themeCard, active && styles.themeCardActive]}
                onPress={() => save({ theme: tItem.key })}
                activeOpacity={0.8}
              >
                <Ionicons name={active ? tItem.icon : tItem.icon + "-outline"} size={22} color={active ? "#A78BFA" : COLORS.textMuted} />
                <Text style={[styles.themeLabel, active && { color: "#A78BFA" }]}>{tItem.label}</Text>
                <Text style={styles.themeDesc}>{tItem.desc}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Dynamic Language Selection Section in Appearance */}
        <Text style={styles.sectionTitle}>{t("language")}</Text>
        <View style={styles.optionCard}>
          <TouchableOpacity
            style={styles.optionRow}
            onPress={() => handleLanguageChange("en")}
            activeOpacity={0.8}
          >
            <View style={styles.optionLeft}>
              <Text style={{ fontSize: 22, marginRight: 4 }}>🇬🇧</Text>
              <View>
                <Text style={[styles.optionLabel, locale === "en" && { color: COLORS.primary, fontWeight: "700" }]}>English</Text>
                <Text style={styles.optionSub}>English interface & AI replies</Text>
              </View>
            </View>
            <View style={[styles.radio, locale === "en" && styles.radioActive]}>
              {locale === "en" && <View style={styles.radioDot} />}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.optionRow, styles.optionRowBorder]}
            onPress={() => handleLanguageChange("ur")}
            activeOpacity={0.8}
          >
            <View style={styles.optionLeft}>
              <Text style={{ fontSize: 22, marginRight: 4 }}>🇵🇰</Text>
              <View>
                <Text style={[styles.optionLabel, locale === "ur" && { color: COLORS.primary, fontWeight: "700" }]}>اردو (Urdu)</Text>
                <Text style={styles.optionSub}>ایپ کا انٹرفیس اور معلومات اردو میں</Text>
              </View>
            </View>
            <View style={[styles.radio, locale === "ur" && styles.radioActive]}>
              {locale === "ur" && <View style={styles.radioDot} />}
            </View>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>{t("displayOptions")}</Text>
        <View style={styles.optionCard}>
          <View style={styles.optionRow}>
            <View style={styles.optionLeft}>
              <View style={[styles.optionIcon, { backgroundColor: COLORS.primaryGlow }]}>
                <Ionicons name="resize-outline" size={16} color={COLORS.primary} />
              </View>
              <View>
                <Text style={styles.optionLabel}>{t("compactMode")}</Text>
                <Text style={styles.optionSub}>{t("reducePadding")}</Text>
              </View>
            </View>
            <Switch
              value={compactMode}
              onValueChange={(v) => save({ compactMode: v })}
              trackColor={{ false: COLORS.border, true: COLORS.primary + "88" }}
              thumbColor={compactMode ? COLORS.primary : COLORS.textMuted}
            />
          </View>

          <View style={[styles.optionRow, styles.optionRowBorder]}>
            <View style={styles.optionLeft}>
              <View style={[styles.optionIcon, { backgroundColor: "#A78BFA18" }]}>
                <Ionicons name="sparkles-outline" size={16} color="#A78BFA" />
              </View>
              <View>
                <Text style={styles.optionLabel}>{t("animations")}</Text>
                <Text style={styles.optionSub}>{t("enableTransitions")}</Text>
              </View>
            </View>
            <Switch
              value={animationsOn}
              onValueChange={(v) => save({ animationsOn: v })}
              trackColor={{ false: COLORS.border, true: COLORS.primary + "88" }}
              thumbColor={animationsOn ? COLORS.primary : COLORS.textMuted}
            />
          </View>
        </View>

        <View style={styles.noteCard}>
          <Ionicons name="checkmark-circle-outline" size={16} color={COLORS.success} />
          <Text style={styles.noteText}>{t("themeNote")}</Text>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:      { flex: 1, backgroundColor: COLORS.bg },
  container: { padding: 20 },

  heroCard: {
    backgroundColor: COLORS.card, borderRadius: 20,
    padding: 24, alignItems: "center", marginBottom: 24,
    borderWidth: 1, borderColor: "#A78BFA33",
  },
  heroIcon: {
    width: 60, height: 60, borderRadius: 20,
    backgroundColor: "#A78BFA18", alignItems: "center", justifyContent: "center",
    marginBottom: 14, borderWidth: 1, borderColor: "#A78BFA44",
  },
  heroTitle: { fontSize: 23, ...FONTS.extraBold, color: COLORS.text, marginBottom: 8 },
  heroSub:   { fontSize: 14.5, color: COLORS.textSecondary, textAlign: "center", lineHeight: 22 },

  sectionTitle: {
    fontSize: 12.5, ...FONTS.bold, color: COLORS.textSecondary,
    textTransform: "uppercase", letterSpacing: 1.0, marginBottom: 12, marginTop: 4,
  },

  themeRow: { flexDirection: "row", gap: 10, marginBottom: 24 },
  themeCard: {
    flex: 1, alignItems: "center", gap: 6,
    backgroundColor: COLORS.card, borderRadius: RADIUS.lg,
    padding: 16, borderWidth: 1, borderColor: COLORS.border,
  },
  themeCardActive: { borderColor: "#A78BFA66", backgroundColor: "#A78BFA10" },
  themeLabel: { fontSize: 15, ...FONTS.semiBold, color: COLORS.text },
  themeDesc:  { fontSize: 11, color: COLORS.textMuted, textAlign: "center", lineHeight: 15 },

  optionCard: {
    backgroundColor: COLORS.card, borderRadius: RADIUS.lg,
    borderWidth: 1, borderColor: COLORS.border,
    overflow: "hidden", marginBottom: 18,
  },
  optionRow: {
    flexDirection: "row", alignItems: "center",
    justifyContent: "space-between", padding: 16,
  },
  optionRowBorder: { borderTopWidth: 1, borderTopColor: COLORS.border },
  optionLeft: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
  optionIcon: {
    width: 36, height: 36, borderRadius: 11,
    alignItems: "center", justifyContent: "center",
  },
  optionLabel: { fontSize: 16, ...FONTS.medium, color: COLORS.text, marginBottom: 3 },
  optionSub:   { fontSize: 12.5, color: COLORS.textMuted, lineHeight: 18 },

  radio: {
    width: 22, height: 22, borderRadius: 11,
    borderWidth: 2, borderColor: COLORS.border,
    alignItems: "center", justifyContent: "center",
  },
  radioActive: { borderColor: COLORS.primary },
  radioDot: {
    width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.primary,
  },

  noteCard: {
    flexDirection: "row", gap: 10, alignItems: "flex-start",
    backgroundColor: COLORS.card, borderRadius: RADIUS.md,
    padding: 14, borderWidth: 1, borderColor: COLORS.info + "33",
  },
  noteText: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 20, flex: 1 },
});
