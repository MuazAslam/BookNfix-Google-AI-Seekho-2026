import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LANG_KEY = "@serviceai_language";

const translations = {
  en: {
    // Appearance screen
    appearance: "Appearance",
    theme: "Theme",
    dark: "Dark",
    light: "Light",
    system: "System",
    displayOptions: "Display Options",
    compactMode: "Compact Mode",
    reducePadding: "Reduce padding and card sizes",
    animations: "Animations",
    enableTransitions: "Enable screen transitions and effects",
    themeNote: "Theme changes apply instantly. The dark theme is optimized for the AI pipeline display.",
    language: "Language",
    chooseLanguage: "Choose your preferred language for the app",
    availableLanguages: "Available Languages",
    english: "English",
    urdu: "Urdu (اردو)",
    languageSaved: "Language Updated",
    restartApp: "Language updated successfully.",
    
    // User Dashboard / Home Screen
    goodMorning: "Good morning",
    goodAfternoon: "Good afternoon",
    goodEvening: "Good evening",
    activeUser: "ACTIVE USER",
    totalBookings: "Total bookings placed",
    pendingStatus: "Pending status",
    todaysList: "Today's list",
    browseProviders: "Browse Providers",
    discoverTop: "Search, filter & discover top-rated services",
    aiAgentic: "AI Agentic Service Providers",
    realTimeRadar: "Real Time Google Business Radar",
    pendingBookings: "PENDING BOOKINGS",
    allClear: "All dispatches cleared",
    tryAsking: "TRY ASKING",
    
    // Live Search Screen
    liveSearchRadar: "Live Search Radar",
    realProviders: "Real providers · Google Maps data",
    selectCategory: "SELECT A SERVICE CATEGORY",
    aiSearchConsole: "AI SEARCH CONSOLE",
    describeIssue: "Describe your issue here...",
    askAi: "Ask AI",
    searchLocation: "YOUR SEARCH LOCATION",
    scansMaps: "Scans real Google Maps data · Results in 3-8 minutes",
    aiAgentDispatching: "AI Agent Dispatching",
    bookingInitiated: "Booking Request Initiated",
    aiAgentCalling: "Our AI Agent will be calling {name} to confirm your booking and will inform you accordingly!",
    navigatingDashboard: "Navigating to Dashboard shortly...",
    // Bookings History Screen (My Bookings)
    myBookings: "My Bookings",
    totalConfirmedPending: "{total} total · {confirmed} confirmed · {pending} pending",
    all: "All",
    pending: "Pending",
    confirmed: "Confirmed",
    inProgress: "In Progress",
    completed: "Completed",
    cancelled: "Cancelled",
    showTicketDetails: "Show Ticket Details",
    priceNegotiable: "Price Negotiable",
    priceOnRequest: "Price on request",

    // Provider Discovery Screen (Browse Providers)
    providersCount: "{count} providers",
    message: "Message",
    viewProfile: "View Profile",
    yearsExp: "{years}y exp",

    // Confirmation Screen (Booking Details)
    bookingConfirmed: "Booking Confirmed",
    providerConfirmedAppt: "Provider confirmed your appointment",
    bookingId: "BOOKING ID",
    service: "Service",
    provider: "Provider",
    when: "When",
    address: "Address",
    aiFollowups: "AI follow-ups scheduled",
    tenMinBefore: "10 MIN BEFORE ARRIVAL",
    afterService: "AFTER SERVICE",
    threeDaysLater: "3 DAYS LATER",
  },
  ur: {
    // Appearance screen
    appearance: "ظاہری شکل",
    theme: "تھیم",
    dark: "ڈارک",
    light: "لائٹ",
    system: "سسٹم",
    displayOptions: "ڈسپلے کے اختیارات",
    compactMode: "کمپیکٹ موڈ",
    reducePadding: "کارڈز اور پیڈنگ کا سائز چھوٹا کریں",
    animations: "اینیمیشنز",
    enableTransitions: "اسکرین ٹرانزیشنز اور ایفیکٹس فعال کریں",
    themeNote: "تھیم کی تبدیلیاں فوری طور پر لاگو ہوتی ہیں۔ ڈارک تھیم AI کے لیے بہترین ہے۔",
    language: "زبان",
    chooseLanguage: "ایپ کے لیے اپنی پسندیدہ زبان منتخب کریں",
    availableLanguages: "دستیاب زبانیں",
    english: "انگلش (English)",
    urdu: "اردو (Urdu)",
    languageSaved: "زبان تبدیل ہو گئی",
    restartApp: "زبان کامیابی کے ساتھ تبدیل کر دی گئی ہے۔",

    // User Dashboard / Home Screen
    goodMorning: "صبح بخیر",
    goodAfternoon: "سہ پہر بخیر",
    goodEvening: "شام بخیر",
    activeUser: "فعال صارف",
    totalBookings: "کل بکنگز کی تعداد",
    pendingStatus: "زیر التواء بکنگز",
    todaysList: "آج کی لسٹ",
    browseProviders: "سروس فراہم کرنے والے تلاش کریں",
    discoverTop: "سروسز تلاش کریں اور فلٹر کریں",
    aiAgentic: "AI ایجنٹ سروسز",
    realTimeRadar: "گوگل بزنس ریڈار (ریئل ٹائم)",
    pendingBookings: "زیر التواء بکنگز",
    allClear: "تمام بکنگز کلیئر ہیں",
    tryAsking: "یہ پوچھ کر دیکھیں",

    // Live Search Screen
    liveSearchRadar: "لائیو سرچ ریڈار",
    realProviders: "حقیقی سروس فراہم کنندگان · گوگل میپس ڈیٹا",
    selectCategory: "سروس کیٹیگری منتخب کریں",
    aiSearchConsole: "AI سرچ کنسول",
    describeIssue: "اپنا مسئلہ یہاں لکھیں...",
    askAi: "AI سے پوچھیں",
    searchLocation: "آپ کی تلاش کا مقام",
    scansMaps: "گوگل میپس ڈیٹا اسکین کرتا ہے · 3-8 منٹ میں نتائج",
    aiAgentDispatching: "AI ایجنٹ روانہ کیا جا رہا ہے",
    bookingInitiated: "بکنگ کی درخواست شروع ہو گئی",
    aiAgentCalling: "ہمارا AI ایجنٹ آپ کی بکنگ کی تصدیق کے لیے {name} کو کال کرے گا اور آپ کو مطلع کرے گا!",
    navigatingDashboard: "جلد ہی ڈیش بورڈ پر منتقل ہو رہا ہے...",

    // Bookings History Screen (My Bookings)
    myBookings: "میری بکنگز",
    totalConfirmedPending: "{total} کل · {confirmed} تصدیق شدہ · {pending} زیر التواء",
    all: "تمام",
    pending: "زیر التواء",
    confirmed: "تصدیق شدہ",
    inProgress: "جاری ہے",
    completed: "مکمل",
    cancelled: "منسوخ",
    showTicketDetails: "ٹکٹ کی تفصیلات دیکھیں",
    priceNegotiable: "قیمت قابلِ گفتگو",
    priceOnRequest: "قیمت رابطہ کرنے پر",

    // Provider Discovery Screen (Browse Providers)
    providersCount: "{count} سروس فراہم کار",
    message: "پیغام",
    viewProfile: "پروفائل دیکھیں",
    yearsExp: "{years} سال کا تجربہ",

    // Confirmation Screen (Booking Details)
    bookingConfirmed: "بکنگ کی تصدیق ہو گئی",
    providerConfirmedAppt: "فراہم کنندہ نے آپ کی بکنگ کی تصدیق کر دی ہے",
    bookingId: "بکنگ آئی ڈی",
    service: "سروس",
    provider: "فراہم کنندہ",
    when: "کب",
    address: "پتہ",
    aiFollowups: "AI فالو اپس شیڈول ہیں",
    tenMinBefore: "آمد سے 10 منٹ پہلے",
    afterService: "سروس کے بعد",
    threeDaysLater: "3 دن بعد",
  }
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [locale, setLocale] = useState("en");

  useEffect(() => {
    AsyncStorage.getItem(LANG_KEY)
      .then((val) => {
        if (val) setLocale(val);
      })
      .catch(() => {});
  }, []);

  const changeLanguage = async (code) => {
    try {
      await AsyncStorage.setItem(LANG_KEY, code);
      setLocale(code);
    } catch (_) {}
  };

  const t = (key, params = {}) => {
    let text = translations[locale]?.[key] || translations["en"]?.[key] || key;
    Object.keys(params).forEach((placeholder) => {
      text = text.replace(`{${placeholder}}`, params[placeholder]);
    });
    return text;
  };

  return (
    <LanguageContext.Provider value={{ locale, t, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
