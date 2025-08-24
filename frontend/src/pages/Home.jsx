import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCoverflow } from "swiper/modules";
import { Icon } from "@iconify/react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Chips1 from "../assets/imgs/products/Chips_1.png";
import Chips2 from "../assets/imgs/products/Chips_2.png";
import Chips3 from "../assets/imgs/products/Chips_3.png";
import Chips4 from "../assets/imgs/products/Chips_4.png";
import Chips5 from "../assets/imgs/products/Chips_5.png";
import CornChips from "../assets/imgs/products/corn-chips.png";
import WhyUsBg from "../assets/imgs/Why_Us_bg.png";
import Question from "../assets/imgs/question.png";
import { useTranslation } from "react-i18next";

// Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";

const Home = () => {
  const images = [Chips1, Chips2, Chips3, Chips4, Chips5];
  const navigate = useNavigate();
  const { t, i18n } = useTranslation("home");
  const isRTL = i18n.dir() === "rtl";
  const points = t("whyUs.points", { returnObjects: true });

  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="min-h-[100vh] bg-[#12131a] w-screen relative left-[50%] right-[50%] ml-[-50vw] mr-[-50vw] text-white py-[200px] flex items-center">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-18">
          {/* LEFT TEXT */}
          <div className="flex flex-col w-full md:w-auto">
            <div className="flex items-center flex-wrap md:flex-nowrap">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-itim leading-tight m-0">
                {t("hero.title")}
              </h1>
              <img
                src={CornChips}
                alt="Corn Chips"
                className="inline-block w-14 h-14 md:w-17 md:h-17 float-animation m-0 ml-2"
              />
            </div>

            <p className="mt-4 text-gray-400 text-base sm:text-lg">
              {t("hero.p")}
            </p>

            <button
              className="mt-6 px-6 py-3 cursor-pointer bg-primary hover:bg-white hover:text-primary transition duration-400 text-white rounded-lg font-semibold w-full sm:w-[40%]"
              onClick={() => navigate("/products")}
            >
              {t("hero.cta-btn")}
            </button>
          </div>

          {/* RIGHT SLIDER */}
          <div className="relative flex-1 flex justify-center items-center w-full md:w-auto mt-10 md:mt-0">
            <div className="absolute w-[300px] sm:w-[500px] h-[200px] sm:h-[300px] bg-[#59cb00] rounded-full blur-[150px]"></div>
            <Swiper
              modules={[Autoplay, EffectCoverflow]}
              effect="coverflow"
              grabCursor={true}
              centeredSlides={true}
              slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              spaceBetween={0}
              loop={true}
              autoplay={{
                delay: 2500,
                disableOnInteraction: false,
              }}
              coverflowEffect={{
                rotate: 0,
                stretch: 0,
                depth: 150,
                modifier: 1.5,
                slideShadows: false,
              }}
              className="mySwiper"
              dir="ltr"
            >
              {(isRTL ? [...images].reverse() : images).map((src, i) => (
                <SwiperSlide key={i}>
                  <img
                    src={src}
                    alt={`Slide ${i}`}
                    className="w-full max-w-[450px] rounded-xl"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section className="min-h-[100vh] w-screen relative left-[50%] right-[50%] ml-[-50vw] mr-[-50vw] py-[100px] flex items-center">
        <div className="container mx-auto px-4 pb-9 flex flex-col md:flex-row items-center justify-between gap-12">
          {/* LEFT TEXT */}
          <div
            className={`flex flex-col w-full md:w-1/2 text-center ${
              isRTL ? "md:text-right" : "md:text-left"
            } `}
            style={{
              backgroundImage: `url(${WhyUsBg})`,
              backgroundSize: "contain",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <h2 className="text-2xl sm:text-2xl md:text-6xl text-primary font-itim leading-tight why-underline mb-5">
              {t("whyUs.title")}
            </h2>
            <p className="text-text text-base sm:text-lg mb-8">
              {t("whyUs.description")}
            </p>

            {points.map((point, idx) => (
              <p
                key={idx}
                className="flex items-center gap-2 text-secondary mb-2"
              >
                <Icon
                  icon="material-symbols:check-rounded"
                  className="text-primary"
                />{" "}
                {point}
              </p>
            ))}

            <button
              className="w-[25%] bg-primary hover:scale-105 transform text-white font-semibold py-3 mt-4 rounded-lg transition duration-400 cursor-pointer"
              onClick={() => navigate("/about")}
            >
              {t("whyUs.btn")}
            </button>
          </div>

          {/* RIGHT IMAGE */}
          <div className="flex-1 flex justify-center items-center w-full md:w-auto">
            <img
              src={Question}
              alt="Why Choose Us"
              className="w-full max-w-[200px] rounded-xl float-animation"
            />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Home;
