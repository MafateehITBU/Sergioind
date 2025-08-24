import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";

i18n
  .use(HttpBackend) // <-- load translations via HTTP
  .use(initReactI18next)
  .init({
    lng: "en",
    fallbackLng: "en",
    ns: ["common", "about", "privacyPolicy"], // namespaces
    defaultNS: "common",
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json", // path to JSON files
    },
    interpolation: { escapeValue: false },
  });

// Handle RTL vs LTR globally
i18n.on("languageChanged", (lng) => {
  document.documentElement.dir = lng === "ar" ? "rtl" : "ltr";
});

export default i18n;
