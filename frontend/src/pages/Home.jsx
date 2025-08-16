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

// Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";

const Home = () => {
  const images = [Chips1, Chips2, Chips3, Chips4, Chips5];
  const navigate = useNavigate();

  return (
    <>
      <Header />
      
      {/* Hero Section */}
      <section className="min-h-[100vh] bg-[#12131a] w-screen relative left-[50%] right-[50%] ml-[-50vw] mr-[-50vw] text-white py-[200px] flex items-center pt-16">
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
      <section className="min-h-[100vh] w-screen relative left-[50%] right-[50%] ml-[-50vw] mr-[-50vw] py-[100px] flex items-center">
        <div className="container mx-auto px-4 pb-9 flex flex-col md:flex-row items-center justify-between gap-12">
          {/* LEFT TEXT */}
          <div
            className="flex flex-col w-full md:w-1/2 text-center md:text-left"
            style={{
              backgroundImage: `url(${WhyUsBg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-itim leading-tight text-white mb-6">
              Why Choose Us?
            </h2>
            <p className="text-gray-300 text-base sm:text-lg mb-8">
              We are committed to providing the highest quality snacks with
              innovative flavors that delight our customers worldwide.
            </p>
            <button
              className="px-6 py-3 cursor-pointer bg-primary hover:bg-white hover:text-primary transition duration-400 text-white rounded-lg font-semibold w-full sm:w-auto"
              onClick={() => navigate("/about")}
            >
              Learn More
            </button>
          </div>

          {/* RIGHT IMAGE */}
          <div className="flex-1 flex justify-center items-center w-full md:w-auto">
            <img
              src={Question}
              alt="Why Choose Us"
              className="w-full max-w-[400px] rounded-xl"
            />
          </div>
        </div>
      </section>

      {/* Additional sections can be added here */}
      
      <Footer />
    </>
  );
};

export default Home;
