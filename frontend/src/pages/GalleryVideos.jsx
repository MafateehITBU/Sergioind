import { useState, useEffect } from "react";
import axiosInstance from "../axiosConfig";
import Header from "../components/Header";
import Footer from "../components/Footer";
import GalleryHero from "../components/GalleryHero";
import VideoCard from "../components/VideoCard";
import Bg from "../assets/imgs/video-bg.png";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

const GalleryVideo = () => {
  const [videos, setVideos] = useState([]);
  const { t } = useTranslation("gallery");

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const res = await axiosInstance.get("/video-gallery");
      setVideos(res.data.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again.",
        { position: "top-right" }
      );
    }
  };

  return (
    <>
      <Header />

      <GalleryHero
        bgImage={Bg}
        title={t("videos.title")}
        desc={t("videos.desc")}
      />

      {/* Video Cards */}
      <section className="py-16 pb-40 container mx-auto px-6">
        <h1 className="font-itim text-4xl text-primary why-underline mb-10">
          {t("videos.sub-title")}
        </h1>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((video) => (
            <VideoCard
              key={video._id}
              videoUrl={video.videoUrl}
              title={video.title}
            />
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
};

export default GalleryVideo;
