import { useState, useEffect } from "react";
import axiosInstance from "../axiosConfig";
import Header from "../components/Header";
import Footer from "../components/Footer";
import GalleryHero from "../components/GalleryHero";
import Bg from "../assets/imgs/images-bg.png";
import TeamImg from "../assets/imgs/production-team.png";
import CircleBg from "../assets/imgs/imgs-circle.png";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";

const GalleryPhotos = () => {
  const { t, i18n } = useTranslation("gallery");
  const isRTL = i18n.dir() === "rtl";
  const points = t("images.intro.points", { returnObjects: true });

  const [albums, setAlbums] = useState([]);
  const [expandedAlbum, setExpandedAlbum] = useState(null);
  const [fullscreenImg, setFullscreenImg] = useState(null);

  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    try {
      const res = await axiosInstance.get("/gallery");
      const activeAlbums = response.data.data.filter(
        (album) => album.isActive
      );
      setAlbums(activeAlbums);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again.",
        { position: "top-right" }
      );
    }
  };

  const toggleAlbum = (id) => {
    setExpandedAlbum(expandedAlbum === id ? null : id);
  };

  return (
    <>
      <Header />

      <GalleryHero
        bgImage={Bg}
        title={t("images.title")}
        desc={t("images.desc")}
      />

      <section className="py-16 container mx-auto px-6">
        {/* Intro Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Side */}
          <div>
            <div className="relative inline-block mb-6">
              <h2 className="text-xl font-extrabold relative z-10">
                {t("images.intro.title")}
              </h2>
              <h1 className="text-h1 text-primary">
                {t("images.intro.sub-title")}
              </h1>
              <img
                src={CircleBg}
                alt="circle background"
                className={`absolute ${
                  isRTL ? "-top-15 " : "-top-4 -left-2"
                } w-40 h-40 opacity-40 z-0`}
              />
            </div>
            <p className="text-lg text-gray-700 mb-6">{t("images.intro.p")}</p>
            <ul className="space-y-5">
              {points.map((point, index) => (
                <li key={index} className="flex items-start">
                  <Icon
                    icon="mdi:check-circle"
                    className="text-primary text-2xl mr-2 flex-shrink-0"
                  />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Side */}
          <div className="flex justify-center">
            <img
              src={TeamImg}
              alt="Production Team"
              className="w-full max-w-md"
            />
          </div>
        </div>

        {/* Albums Section */}
        <div className="mt-20">
          {albums.map((album) => {
            const isExpanded = expandedAlbum === album._id;
            const previewImages = album.images.slice(0, 2);
            const extraImages = album.images.slice(2);

            return (
              <div key={album._id} className="mb-30">
                {/* Album Title + View All */}
                <div className="flex justify-between items-center border-b border-gray-300 pb-2 mb-6">
                  <h3 className="text-4xl font-itim">
                    {isRTL ? album.titleAr : album.title}
                  </h3>
                  {album.images.length > 2 && (
                    <button
                      onClick={() => toggleAlbum(album._id)}
                      className="text-gray-500 hover:text-primary transition-colors cursor-pointer"
                    >
                      {isExpanded
                        ? isRTL
                          ? "إخفاء"
                          : "Hide"
                        : isRTL
                        ? "عرض جميع الصور"
                        : "View All"}
                    </button>
                  )}
                </div>

                {/* First 2 images (left small, right big) */}
                <div className="grid grid-cols-3 gap-4">
                  {previewImages[0] && (
                    <div
                      className="col-span-1 overflow-hidden rounded-lg shadow-md cursor-pointer"
                      onClick={() => setFullscreenImg(previewImages[0].url)}
                    >
                      <img
                        src={previewImages[0].url}
                        alt={`Album ${album.title} - 1`}
                        className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  {previewImages[1] && (
                    <div
                      className="col-span-2 overflow-hidden rounded-lg shadow-md cursor-pointer"
                      onClick={() => setFullscreenImg(previewImages[1].url)}
                    >
                      <img
                        src={previewImages[1].url}
                        alt={`Album ${album.title} - 2`}
                        className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                </div>

                {/* Extra images (smooth reveal) */}
                <AnimatePresence>
                  {isExpanded && extraImages.length > 0 && (
                    <motion.div
                      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                    >
                      {extraImages.map((img, idx) => (
                        <motion.div
                          key={idx}
                          className="overflow-hidden rounded-lg shadow-md cursor-pointer"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: idx * 0.1 }}
                          onClick={() => setFullscreenImg(img.url)}
                        >
                          <img
                            src={img.url}
                            alt={`Album ${album.title} - Extra ${idx + 1}`}
                            className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      <Footer />

      {/* Fullscreen Modal */}
      {fullscreenImg && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setFullscreenImg(null)}
        >
          <img
            src={fullscreenImg}
            alt="Fullscreen"
            className="max-h-[90vh] max-w-[90vw] rounded-lg shadow-lg"
          />
        </div>
      )}
    </>
  );
};

export default GalleryPhotos;
