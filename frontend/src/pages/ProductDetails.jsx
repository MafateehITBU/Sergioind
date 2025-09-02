import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axiosInstance from "../axiosConfig";
import { useTranslation } from "react-i18next";

import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import CornerBg from "../assets/imgs/corner-img1.png";
import CornerBg2 from "../assets/imgs/corner-img2.png";

const ProductDetails = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product;

  const [productDetails, setProductDetails] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/products/${product}`);
      setProductDetails(response.data.data);

      // Default selections
      setSelectedImage(response.data.data?.image?.[0]);
      setSelectedSize(response.data.data?.sizes?.[0]);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again.",
        { position: "top-right" }
      );
      navigate("/products");
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async () => {
    try {
      const res = await axiosInstance.get(
        `/products/category/${productDetails?.category?._id}`
      );
      setRelatedProducts(res.data.data.filter((p) => p._id !== product));
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again.",
        { position: "top-right" }
      );
    }
  };

  useEffect(() => {
    if (!product) {
      toast.error("No product specified", { position: "top-right" });
      navigate("/products");
      return;
    }

    fetchProductDetails();
  }, [product]);

  useEffect(() => {
    if (productDetails) {
      fetchRelatedProducts();
    }
  }, [productDetails]);

  return (
    <>
      <Header />
      <ToastContainer />
      {/* Product Details Section */}
      {loading ? (
        <div className="min-h-screen flex items-center justify-center">
          <p>Loading...</p>
        </div>
      ) : !productDetails ? (
        <div className="min-h-screen flex items-center justify-center">
          <p>{isRTL ? "المنتج غير موجود" : "Product not found."}</p>
        </div>
      ) : (
        <section className="pt-30 pb-30 min-h-screen bg-white relative">
          <div className="max-w-7xl mx-auto px-6 py-16">
            <div className="flex flex-col lg:flex-row gap-10">
              {/* Left Side - Images */}
              <div className="flex-1 flex flex-col">
                <div className="flex-1 flex items-center justify-center bg-white rounded-lg mb-6">
                  <img
                    src={selectedImage?.url}
                    alt="Product"
                    className="max-h-[500px] object-contain rounded-lg"
                  />
                </div>
                <div className="flex space-x-4 overflow-x-auto">
                  {productDetails?.image.map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`w-24 h-20 rounded-lg cursor-pointer flex items-center justify-center border-2 ${
                        selectedImage?.url === img.url
                          ? "bg-white border-primary"
                          : "bg-gray-100 border-transparent"
                      }`}
                    >
                      <img
                        src={img.url}
                        alt={productDetails?.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Side - Details */}
              <div className="flex-1 flex flex-col relative">
                <h1 className="text-5xl font-bold mb-10">
                  {isRTL ? productDetails?.nameAr : productDetails?.name}
                </h1>
                <p className="text-gray-700 mb-6">
                  {isRTL
                    ? productDetails?.descriptionAr
                    : productDetails?.description}
                </p>

                {/* SKU */}
                <div className="border-b border-[#e4e4e4] text-[#e4e4e4] mb-8">
                  <p className=" text-xl">
                    {isRTL ? "رمز المنتج" : "Product Code:"}{" "}
                    {productDetails?.sku}
                  </p>
                </div>

                {/* Product Sizes */}
                <div className="mb-6">
                  <div className="flex space-x-4">
                    {productDetails?.sizes.map((size) => (
                      <div
                        key={size._id}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 rounded-lg cursor-pointer transition border ${
                          selectedSize?._id === size._id
                            ? "bg-white text-primary border-primary"
                            : "bg-primary text-white border-transparent"
                        }`}
                      >
                        {size?.name}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Product details */}
                <div className="mb-10">
                  <h2 className="text-2xl font-semibold mb-6">
                    {isRTL ? "التفاصيل" : "Details:"}
                  </h2>
                  <div className="flex flex-col md:flex-row md:justify-between">
                    {/* right side the details */}
                    <ul className="list-disc list-inside space-y-2 text-[20px]">
                      {(isRTL
                        ? productDetails?.detailsAr
                        : productDetails?.details
                      )?.map((detail, index) => (
                        <li key={index} className="text-gray-600">
                          {detail}
                        </li>
                      ))}
                    </ul>

                    {/* Left side: Weight, Made in, Storage */}
                    <div className="space-y-2 text-[20px]">
                      <p>
                        <strong>{isRTL ? "الوزن:" : "Weight:"} </strong>{" "}
                        {selectedSize
                          ? `${selectedSize?.weight?.value} ${selectedSize?.weight?.unit}`
                          : "—"}
                      </p>
                      <p>
                        <strong>{isRTL ? "صنع في:" : "Made in:"} </strong>{" "}
                        {isRTL ? "الأردن" : "Jordan"}
                      </p>
                      <p>
                        <strong>{isRTL ? "التخزين:" : "Storage:"} </strong>{" "}
                        {isRTL
                          ? "يُحفظ في مكان جاف وبارد"
                          : "Keep in a dry and cool place"}
                      </p>
                    </div>
                  </div>
                </div>

                <button className="bg-primary text-white w-full px-6 py-3 rounded-lg hover:scale-105 transition duration-500 cursor-pointer">
                  {isRTL ? "طلب عرض سعر" : "Quotation Request"}
                </button>

                {/* CornerBg2 under text on the right */}
                <img
                  src={CornerBg2}
                  alt=""
                  className="hidden lg:block absolute -bottom-10 right-0 w-110 opacity-90 pointer-events-none translate-x-35"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CornerBg2 between the 2 sections on the left */}
      <div className="relative">
        <img
          src={CornerBg}
          alt=""
          className="hidden lg:block absolute -top-20 left-0 w-32 opacity-90 pointer-events-none z-10 bg-white"
        />
      </div>

      {/* Related Products Section Centered */}
      <section className="pt-5 pb-30 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-5xl font-itim mb-10 text-center">
            {isRTL ? "منتجات ذات صلة" : "Related Products"}
          </h2>
          {relatedProducts.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No related products found
              </h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {relatedProducts.map((prod) => (
                <ProductCard key={prod._id} product={prod} isRTL={isRTL} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
};

export default ProductDetails;
