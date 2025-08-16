import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCoverflow } from "swiper/modules";
import { Icon } from "@iconify/react";
import MainLayout from "../components/MainLayout";
import Chips1 from "../assets/imgs/products/Chips_1.png";
import Chips2 from "../assets/imgs/products/Chips_2.png";
import Chips3 from "../assets/imgs/products/Chips_3.png";
import Chips4 from "../assets/imgs/products/Chips_4.png";
import Chips5 from "../assets/imgs/products/Chips_5.png";
import CornChips from "../assets/imgs/products/corn-chips.png";
import WhyUsBg from "../assets/imgs/Why_Us_bg.png";
import Question from "../assets/imgs/question.png";

// Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";

const Home = () => {
  const images = [Chips1, Chips2, Chips3, Chips4, Chips5];
  const navigate = useNavigate();

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="min-h-[100vh] bg-[#12131a] mx-[-5vw] text-white py-[200px] flex items-center">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-18">
          {/* LEFT TEXT */}
          <div className="flex flex-col w-full md:w-auto">
            <div className="flex items-center flex-wrap md:flex-nowrap">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-itim leading-tight m-0">
                ENJOY OUR CORN CHIPS
              </h1>
              <img
                src={CornChips}
                alt="Corn Chips"
                className="inline-block w-14 h-14 md:w-17 md:h-17 float-animation m-0 ml-2"
              />
            </div>

            <p className="mt-4 text-gray-400 text-base sm:text-lg">
              Pith flavors as rich as our history a chip or crisp flavor
              guaranteed to bring a smile on your face.
            </p>

            <button
              className="mt-6 px-6 py-3 cursor-pointer bg-primary hover:bg-white hover:text-primary transition duration-400 text-white rounded-lg font-semibold w-full sm:w-[40%]"
              onClick={() => navigate("/products")}
            >
              view product
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
              slidesPerView={1} // Single slide on mobile
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
            >
              {images.map((src, i) => (
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
      <section className="min-h-[100vh] md:mx-[-5vw] py-[100px] flex items-center">
        <div className="container mx-auto px-4 pb-9 flex flex-col md:flex-row items-center justify-between gap-12">
          {/* LEFT TEXT */}
          <div
            style={{
              backgroundImage: `url(${WhyUsBg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            className="w-full md:w-1/2 py-8 md:py-12"
          >
            <div className="flex flex-col items-start">
              <h2 className="text-3xl sm:text-4xl md:text-5xl text-primary font-itim leading-tight m-0 why-underline">
                Why Us
              </h2>
              <p className="mt-4 text-text w-full sm:w-[90%] text-[24px] leading-relaxed">
                Sergio is committed to delivering high-quality snacks made from
                carefully selected ingredients. With a focus on innovation, food
                safety, and international standards, our products are trusted
                and enjoyed in over 10 countries. We combine tradition with
                modern techniques to bring you irresistible taste in every bite.
              </p>

              <ul className="mt-6 flex flex-col gap-4 text-gray-400 text-[20px]">
                <li className="flex items-center gap-2">
                  <Icon
                    icon="material-symbols:check-rounded"
                    color="#59cb00"
                    width="20"
                    height="20"
                  />
                  Premium, healthy ingredients
                </li>
                <li className="flex items-center gap-2">
                  <Icon
                    icon="material-symbols:check-rounded"
                    color="#59cb00"
                    width="20"
                    height="20"
                  />
                  Modern production facilities
                </li>
                <li className="flex items-center gap-2">
                  <Icon
                    icon="material-symbols:check-rounded"
                    color="#59cb00"
                    width="20"
                    height="20"
                  />
                  Competitive pricing worldwide
                </li>
                <li className="flex items-center gap-2">
                  <Icon
                    icon="material-symbols:check-rounded"
                    color="#59cb00"
                    width="20"
                    height="20"
                  />
                  Trusted by global partners
                </li>
              </ul>
              <button
                className="mt-6 px-5 py-2 sm:px-6 sm:py-3 cursor-pointer bg-primary hover:scale-105 transition duration-400 text-white rounded-lg font-semibold w-[50%] sm:w-[40%] md:w-[30%]"
                onClick={() => navigate("/about")}
              >
                Learn More
              </button>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="flex justify-center items-center mt-8 md:mt-0">
            <img
              src={Question}
              alt="Chips"
              className="w-[180px] sm:w-[220px] md:w-[250px] float-animation"
            />
          </div>
        </div>
      </section>
    </MainLayout>
  );
};
export default Home;
