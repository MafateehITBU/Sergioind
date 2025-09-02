import React from "react";
import { useTranslation } from "react-i18next";

const HeroBadge = ({ bgImage, badgeText }) => {
  const { i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";

  return (
    <section className="w-full relative pt-5">
      <div
        className="relative w-full h-[60vh] bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60"></div>

        {/* Green Badge */}
        <div
          className="absolute bottom-[-40px]"
          style={{
            [isRTL ? "right" : "left"]: "80px",
          }}
        >
          {/* White background layer */}
          <div
            className={`absolute inset-0`}
            style={{
              backgroundColor: "white",
              clipPath: isRTL
                ? "polygon(20% 0, 100% 0, 100% 100%, 0 100%)"
                : "polygon(0 0, 100% 0, 80% 100%, 0 100%)",
              transform: isRTL ? "translateX(-1rem)" : "translateX(1rem)", // flip translation
              zIndex: 0,
            }}
          ></div>

          {/* Green foreground layer */}
          <div
            className="relative text-white font-itim text-3xl px-12 py-7"
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
