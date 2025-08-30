import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";

// Load saved language from localStorage or default to "en"
const savedLanguage = localStorage.getItem("i18nextLng") || "en";

i18n
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    lng: savedLanguage,
    fallbackLng: "en",
    ns: ["common", "about", "privacyPolicy", "contact", "auth", "faq", "gallery", "profile"], // namespaces
    defaultNS: "common",
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json", // path to JSON files
    },
    interpolation: { escapeValue: false },
  });

// Save language selection and handle RTL globally
i18n.on("languageChanged", (lng) => {
  localStorage.setItem("i18nextLng", lng);
  document.documentElement.dir = lng === "ar" ? "rtl" : "ltr";
});

export default i18n;
