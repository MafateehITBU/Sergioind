import pkg from "google-translate-api-x";
const googleTranslate = pkg;

export const translateText = async (text, targetLang = "ar") => {
  try {
    const res = await googleTranslate(text, { to: targetLang });
    return res.text;
  } catch (err) {
    console.error("Translation fallback error:", err.message || err);
    return text; // fallback to original
  }
};
