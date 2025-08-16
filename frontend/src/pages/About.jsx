import MainLayout from "../components/MainLayout";
import { useNavigate } from "react-router-dom";
import Bg from "../assets/imgs/about/bg.png";
import TextBg from "../assets/imgs/about/text-bg.png";
import Img1 from "../assets/imgs/about/img1.png";
import Img2 from "../assets/imgs/about/img2.png";
import Chips from "../assets/imgs/about/chips2.png";
import CountriesBg from "../assets/imgs/about/countries-bg.png";

const About = () => {
  const navigate = useNavigate();
  const countries = [
    "BAHRAIN",
    "EGYPT",
    "IRAQ",
    "KUWAIT",
    "LIBYA",
    "LEBANON",
    "MORROCO",
    "PALESTINE",
    "QATAR",
    "SAUDI ARABIA KSA",
    "SULTANATE OF OMAN",
    "SUDAN",
    "TUNASIA",
    "UAE",
    "YEMEN",
    "BELGIUM",
    "DENMARK",
    "GEMANY",
    "INDIA",
    "KOSOVO",
    "SWEDEN",
    "UNITED KINGDOM",
    "TURKEY",
  ];

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="mx-[-5vw]">
        <div
          className="relative w-full h-[60vh] bg-cover bg-center"
          style={{ backgroundImage: `url(${Bg})` }}
        >
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/60"></div>

          {/* Green Badge */}
          <div className="absolute ms-[80px] left-0 bottom-[-40px]">
            {/* White background layer */}
            <div
              className="absolute inset-0 translate-x-4"
              style={{
                backgroundColor: "white",
                clipPath: "polygon(0 0, 100% 0, 80% 100%, 0% 100%)",
                zIndex: 0,
              }}
            ></div>

            {/* Green foreground layer */}
            <div
              className="relative text-white font-itim text-3xl px-12 py-7"
              style={{
                backgroundColor: "#59cb00",
                clipPath: "polygon(0 0, 100% 0, 80% 100%, 0% 100%)",
                zIndex: 1,
              }}
            >
              About Us
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 mx-[-5vw] md:mx-0">
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
            <p className="text-text mb-8 text-[20px]">
              At Sergio Food Industries, we are passionate about delivering
              high-quality snacks made from the finest ingredients. Founded with
              a vision to bring joy to every bite, we combine traditional
              recipes with modern production techniques to create delicious and
              safe products for everyone. With a commitment to food safety,
              innovation, and global standards, our products are trusted in over
              10 countries. Whether it’s crispy potato chips or flavorful corn
              snacks, Sergio ensures taste and quality in every pack. We believe
              in building long-term partnerships, sustainability, and delivering
              excellence through every product we craft.
            </p>

            <div>
              <h2 className="text-2xl sm:text-2xl md:text-4xl text-primary font-itim leading-tight why-underline">
                Vision
              </h2>
              <p className="text-text mt-5 mb-8 text-[20px]">
                Create quality food products made from the most innovative and
                healthful ingredients available at most competitive prices based
                on the principle of continuous development.
              </p>
            </div>

            <div>
              <h2 className="text-2xl sm:text-2xl md:text-4xl text-primary font-itim leading-tight why-underline">
                Mission
              </h2>
              <p className="text-text mt-5 mb-8 text-[16px]">
                Proceed in worldwide expansion and deliver our top-quality
                products to international market, through using the latest
                scientific techniques and best practical experiences to provide
                world class services to consumers.
              </p>
            </div>

            <div>
              <h2 className="text-2xl sm:text-2xl md:text-4xl text-primary font-itim leading-tight why-underline">
                History
              </h2>
              <p className="text-text mt-5 mb-8 text-[16px]">
                Sergio Food Industries is a Jordan-based snack manufacturer
                specialized in crispy and roasted corn snacks since 1975. With
                over 40 years of experience, we proudly produce 100% natural,
                gluten-free, non-GMO snacks from Spanish corn. Our brands —
                GOCORN, Le Rexana, and Le Duxana — are trusted across the Middle
                East, with exports to over 8 countries. Backed by ISO 22000:2005
                and HACCP certifications, we are committed to quality,
                innovation, and flavor.
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

      {/* Banner */}
      <section className="bg-primary text-white py-1 px-8 mx-[-5vw] md:px-16 flex flex-col md:flex-row items-center justify-between">
        {/* Left Side - Text & Buttons */}
        <div className="max-w-xl pt-2 md:pt-0">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-itim mb-4 text-center">
            Crispy Moments Start Here!
          </h2>
          <p className="text-lg mb-6">
            Lorem ipsum dolor sit amet consectetur. Felis nullam donec erat
            sodales orci est justo auctor viverra.
          </p>

          {/* Buttons */}
          <div className="flex flex-row gap-15 mt-10 md:text-[20px]">
            {/* Outline Button */}
            <button
              className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition duration-300 cursor-pointer"
              onClick={() => navigate("/quotations")}
            >
              Quotation Request
            </button>

            {/* Solid Button */}
            <button
              className="bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:scale-105 transition duration-300 cursor-pointer"
              onClick={() => navigate("/products")}
            >
              Explore Our Products
            </button>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="mt-8 md:mt-0">
          <img src={Chips} alt="Chips" className="max-w-full h-auto" />
        </div>
      </section>

      {/* Countries Section */}
      <section className="py-16 pb-100 md:pb-30">
        <h2 className="text-2xl sm:text-2xl md:text-4xl text-primary font-itim leading-tight why-underline mb-8 mx-[-50px] md:mx-0">
          Currently exported to several countries, <br /> including
        </h2>

        <div className="relative inline-block">
          {/* Background image */}
          <img
            src={CountriesBg}
            alt="Countries Background"
            className="h-auto"
          />

          {/* Countries list on top */}
          <div className="absolute inset-0 flex justify-start items-start p-8 mx-[-5vw] md:mx-0">
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
    </MainLayout>
  );
};

export default About;
