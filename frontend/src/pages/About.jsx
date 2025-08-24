import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import HeroBadge from "../components/HeroBadge";
import Bg from "../assets/imgs/about/bg.png";
import TextBg from "../assets/imgs/about/text-bg.png";
import Img1 from "../assets/imgs/about/img1.png";
import Img2 from "../assets/imgs/about/img2.png";
import Chips from "../assets/imgs/about/chips2.png";
import CountriesBg from "../assets/imgs/about/countries-bg.png";
import { useTranslation } from "react-i18next";

const About = () => {
  const { t } = useTranslation("about");
  const navigate = useNavigate();
  const countries = t("export.countries", { returnObjects: true });

  return (
    <>
      <Header />

      {/* Hero Section - Full Width */}
      <HeroBadge bgImage={Bg} badgeText={t("title")} />

      {/* Content Section */}
      <section className="py-16 max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-start gap-8">
          {/* Text */}
          <div
            style={{
              backgroundImage: `url(${TextBg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            className="flex-1 p-6 md:p-0"
          >
            <p className="text-text mb-8 text-[20px]" style={{ whiteSpace: "pre-line" }}>{t("intro")}</p>

            <div>
              <h2 className="text-2xl sm:text-2xl md:text-4xl text-primary font-itim leading-tight why-underline">
                {t("vision.title")}
              </h2>
              <p className="text-text mt-5 mb-8 text-[20px]">{t("vision.p")}</p>
            </div>

            <div>
              <h2 className="text-2xl sm:text-2xl md:text-4xl text-primary font-itim leading-tight why-underline">
                {t("mission.title")}
              </h2>
              <p className="text-text mt-5 mb-8 text-[16px]">
                {t("mission.p")}
              </p>
            </div>

            <div>
              <h2 className="text-2xl sm:text-2xl md:text-4xl text-primary font-itim leading-tight why-underline">
                {t("history.title")}
              </h2>
              <p className="text-text mt-5 mb-8 text-[16px]" style={{ whiteSpace: "pre-line" }}>
                {t("history.p")}
              </p>
            </div>
          </div>

          {/* Images */}
          <div className="flex flex-col gap-6 md:gap-55 flex-1 items-center">
            <img src={Img1} alt="Sergio About 1" className="w-[70%]" />
            <img src={Img2} alt="Sergio About 2" className="w-[70%] md:me-50" />
          </div>
        </div>
      </section>

      {/* CTA Banner - Full Width */}
      <section className="w-screen relative left-[50%] right-[50%] ml-[-50vw] mr-[-50vw] bg-primary text-white py-1 px-8 md:px-16 flex flex-col md:flex-row items-center justify-between">
        {/* Left Side - Text & Buttons */}
        <div className="max-w-xl pt-2 md:pt-0">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-itim mb-4 text-center">
            {t("banner.header")}
          </h2>
          <p className="text-lg mb-6">{t("banner.description")}</p>

          {/* Buttons */}
          <div className="flex flex-row gap-15 mt-10 md:text-[20px]">
            {/* Outline Button */}
            <button
              className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition duration-300 cursor-pointer"
              onClick={() => navigate("/quotations")}
            >
              {t("banner.btn1")}
            </button>

            {/* Solid Button */}
            <button
              className="bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:scale-105 transition duration-300 cursor-pointer"
              onClick={() => navigate("/products")}
            >
              {t("banner.btn2")}
            </button>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="mt-8 md:mt-0">
          <img src={Chips} alt="Chips" className="max-w-full h-auto" />
        </div>
      </section>

      {/* Countries Section */}
      <section className="py-16 pb-100 md:pb-30 max-w-7xl mx-auto px-6">
        <h2 className="text-2xl sm:text-2xl md:text-4xl text-primary font-itim leading-tight why-underline mb-8" style={{ whiteSpace: "pre-line" }}>
          {t("export.title")}
        </h2>

        <div className="relative inline-block">
          {/* Background image */}
          <img
            src={CountriesBg}
            alt="Countries Background"
            className="h-auto"
          />

          {/* Countries list on top */}
          <div className="absolute inset-0 flex justify-start items-start p-8">
            <div className="grid grid-cols-3 gap-20 md:gap-15 text-text text-md">
              {/* Column 1 (7 countries) */}
              <div className="space-y-5">
                {countries.slice(0, 7).map((country, idx) => (
                  <div key={idx}>{country}</div>
                ))}
              </div>
              {/* Column 2 (8 countries) */}
              <div className="space-y-5">
                {countries.slice(7, 15).map((country, idx) => (
                  <div key={idx}>{country}</div>
                ))}
              </div>
              {/* Column 3 (8 countries) */}
              <div className="space-y-5">
                {countries.slice(15).map((country, idx) => (
                  <div key={idx}>{country}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default About;
