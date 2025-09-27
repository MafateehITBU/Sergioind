import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Icon } from "@iconify/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Helmet } from "@dr.pogodin/react-helmet";

const Faq = () => {
  const { t, i18n } = useTranslation("faq");
  const questions = t("questions", { returnObjects: true });
  const navigate = useNavigate();

  const [openIndices, setOpenIndices] = useState([]);

  const isArabic = i18n.language?.startsWith("ar");
  useEffect(() => {
    document.documentElement.lang = isArabic ? "ar" : "en";
    document.documentElement.dir = isArabic ? "rtl" : "ltr";
  }, [isArabic]);

  const title = isArabic
    ? "سيرجيو | الأسئلة الشائعة"
    : "Sergio | FAQ";

  const description = isArabic
    ? "اعثر على إجابات للأسئلة الشائعة حول منتجات وخدمات سيرجيو للصناعات ودعم العملاء."
    : "Find answers to common questions about Sergio Industries’ products, services, and customer support.";

  const keywords = isArabic
    ? "سيرجيو, أسئلة شائعة, دعم العملاء, مساعدة, شيبس, سناكس, شركة أغذية"
    : "Sergio, FAQ, support, help, chips, snacks, food manufacturing, customer service";

  const canonical = "https://sergio-ind.com/faq";
  const ogImage = "https://sergio-ind.com/og/OG_image.png";

  const toggleQuestion = (index) => {
    setOpenIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <>
      {/* SEO */}
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonical} />

        {/* Open Graph */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content={ogImage} />
      </Helmet>

      <Header />
      <section className="py-40 px-6 md:px-16 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-12 items-start max-w-6xl mx-auto">
          {/* Left: FAQ Accordion */}
          <div>
            <h2 className="text-5xl font-itim whitespace-pre-line mb-10">
              {t("title")}
            </h2>

            <div className="space-y-4">
              {Object.entries(questions).map(([key, q], index) => (
                <div
                  key={key}
                  className="border border-gray-300 rounded-lg overflow-hidden shadow-sm"
                >
                  <button
                    onClick={() => toggleQuestion(index)}
                    className="flex justify-between items-center w-full px-5 py-4 text-left font-medium text-lg"
                  >
                    <span className="font-bold">{q.title}</span>
                    <span className="text-2xl cursor-pointer">
                      {openIndices.includes(index) ? (
                        <Icon icon="mdi:minus" />
                      ) : (
                        <Icon icon="mdi:plus" />
                      )}
                    </span>
                  </button>

                  {/* Animated Expand/Collapse */}
                  <div
                    className={`px-5 text-text text-base overflow-hidden transition-all duration-500 ease-in-out ${
                      openIndices.includes(index) ? "max-h-40 pb-5" : "max-h-0"
                    }`}
                  >
                    {q.content}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Info box */}
          <div className="border border-gray-300 rounded-lg p-8 shadow-md bg-white sticky top-28">
            <div className="flex flex-col items-center justify-center gap-3 mb-4">
              <Icon
                icon="material-symbols:chat-bubble-sharp"
                className="text-7xl text-black"
              />
              <h3 className="text-2xl font-bold text-center">
                {t("rightBox.title")}
              </h3>
            </div>
            <p className="text-gray-600 mb-6 text-center">
              {t("rightBox.description")}
            </p>
            <button
              onClick={() => navigate("/contact")}
              className="w-full bg-primary text-white font-semibold py-3 rounded-lg hover:scale-105 transform transition duration-300 cursor-pointer"
            >
              {t("rightBox.btn")}
            </button>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Faq;
