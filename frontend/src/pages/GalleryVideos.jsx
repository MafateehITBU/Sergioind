import { useState, useEffect } from "react";
import axiosInstance from "../axiosConfig";
import Header from "../components/Header";
import Footer from "../components/Footer";
import GalleryHero from "../components/GalleryHero";
import VideoCard from "../components/VideoCard";
import Bg from "../assets/imgs/video-bg.png";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";

const GalleryVideo = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation("gallery");

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axiosInstance.get("/video-gallery");
        // Filter active videos
        const activeVideos = res.data.data.filter((video) => video.isActive);
        setVideos(activeVideos);
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Something went wrong. Please try again.",
          { position: "top-right" }
        );
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  return (
    <>
      <Header />

      <GalleryHero
        bgImage={Bg}
        title={t("videos.title")}
        desc={t("videos.desc")}
      />

      <section className="py-16 pb-40 container mx-auto px-6 min-h-screen">
        <h1 className="font-itim text-4xl text-primary why-underline mb-10">
          {t("videos.sub-title")}
        </h1>

        {loading ? (
          <div className="flex justify-center items-center min-h-[50vh]">
            <ClipLoader size={70} color="#36d7b7" />
          </div>
        ) : videos.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg">
              {t("videos.empty") || "No videos available at the moment."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map((video) => (
              <VideoCard
                key={video._id}
                videoUrl={video.videoUrl}
                title={video.title}
              />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </>
  );
};

export default GalleryVideo;
