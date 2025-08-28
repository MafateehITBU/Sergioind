import React from "react";
import { useTranslation } from "react-i18next";

const GalleryHero = ({ bgImage, title, desc }) => {
  const { i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";

  return (
    <section className="w-full relative">
      <div
        className="relative w-full h-[60vh] bg-cover bg-center flex items-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60"></div>

        {/* Content */}
        <div
          className={`container relative z-10 text-white px-6 mt-15 ${
            isRTL ? "ml-auto text-right" : "mr-auto text-left"
          }`}
        >
          <h1 className="text-7xl font-bold uppercase max-w-4xl">{title}</h1>
          <p className="mt-7 text-lg max-w-2xl">{desc}</p>
        </div>
      </div>
    </section>
  );
};

export default GalleryHero;
