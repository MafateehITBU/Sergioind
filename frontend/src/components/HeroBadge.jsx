import React from "react";
import { useTranslation } from "react-i18next";

const HeroBadge = ({ bgImage, badgeText }) => {
  const { i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";

  return (
    <section className="w-full relative pt-5">
      <div
        className="relative w-full h-[60vh] sm:h-[50vh] bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60"></div>

        {/* Green Badge */}
        <div
          className={`absolute bottom-[-40px] max-w-[90%] sm:max-w-[80%]`}
          style={{
            [isRTL ? "right" : "left"]: "5vw",
          }}
        >
          {/* White background layer */}
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: "white",
              clipPath: isRTL
                ? "polygon(20% 0, 100% 0, 100% 100%, 0 100%)"
                : "polygon(0 0, 100% 0, 80% 100%, 0 100%)",
              transform: isRTL ? "translateX(-1rem)" : "translateX(1rem)",
              zIndex: 0,
            }}
          ></div>

          {/* Green foreground layer */}
          <div
            className="relative text-white font-itim text-2xl sm:text-3xl px-8 sm:px-12 py-5 sm:py-7 truncate"
            style={{
              backgroundColor: "#59cb00",
              clipPath: isRTL
                ? "polygon(20% 0, 100% 0, 100% 100%, 0 100%)"
                : "polygon(0 0, 100% 0, 80% 100%, 0 100%)",
              zIndex: 1,
            }}
          >
            {badgeText}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBadge;
