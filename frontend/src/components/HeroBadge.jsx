import React from "react";

const HeroBadge = ({ bgImage, badgeText }) => {
  return (
    <section className="w-full relative pt-11">
      <div
        className="relative w-full h-[60vh] bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
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
            {badgeText}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBadge;
