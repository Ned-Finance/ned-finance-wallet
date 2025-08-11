import * as Localization from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import translations from each module
import auth_en from "@/modules/auth/translations/en.json";
import auth_es from "@/modules/auth/translations/es.json";

// Merge module translations
const resources = {
  en: {
    translation: {
      ...auth_en,
    },
  },
  es: {
    translation: {
      ...auth_es,
    },
  },
};

i18n.use(initReactI18next).init({
  lng: Localization.getLocales()[0].languageCode || "en",
  fallbackLng: "en",
  resources,
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false, // Importante para React Native
  },
});

console.log("================= i18n", i18n.language);

export default i18n;
