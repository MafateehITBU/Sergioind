import React from "react";

const ProductCard = ({ product, onClick, isRTL }) => {
  const getProductImage = (product) => {
    return (
      product?.image?.[0]?.url ||
      "https://via.placeholder.com/300x200?text=No+Image"
    );
  };

  return (
    <div className="group relative mb-10">
      {/* Card wrapper */}
      <div
        className="relative rounded-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 h-[330px] shadow-lg cursor-pointer"
        onClick={() => onClick(product._id)}
      >
        {/* Floating Product Image */}
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 z-10">
          <img
            src={getProductImage(product)}
            alt={product.name}
            className="h-40 w-auto object-contain transition-transform duration-500 transform -translate-y-10 group-hover:-translate-y-16 group-hover:scale-110 drop-shadow-xl"
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/300x200?text=No+Image";
            }}
          />
        </div>

        {/* Upper Section with wave */}
        <div className="relative h-40 bg-zinc-800 rounded-t-xl">
          <div className="pointer-events-none absolute bottom-0 left-0 right-0">
            <svg
              viewBox="0 0 1440 120"
              preserveAspectRatio="none"
              className="w-full h-16 group-hover:h-24 transition-transform duration-500 text-white"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M0,64 C80,104 160,104 240,64 C320,24 400,24 480,64 C560,104 640,104 720,64 C800,24 880,24 960,64 C1040,104 1120,104 1200,64 C1280,24 1360,24 1440,64 L1440,120 L0,120 Z"></path>
            </svg>
          </div>
        </div>

        {/* Lower Section */}
        <div className="bg-white p-6 relative h-[170px] flex flex-col rounded-b-xl">
          <h3 className="text-xl font-bold text-gray-800 mb-3 text-start">
            {isRTL ? product.nameAr : product.name}
          </h3>
          <p className="text-gray-400 text-sm flex-1 text-start">
            {isRTL ? product.descriptionAr : product.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
