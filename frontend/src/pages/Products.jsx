import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axiosInstance from "../axiosConfig";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

import Header from "../components/Header";
import Footer from "../components/Footer";
import HeroBadge from "../components/HeroBadge";
import ProductCard from "../components/ProductCard";
import Bg from "../assets/imgs/products-bg.png";

const Products = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");

  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get("/products");
      const activeProducts = response.data.data.filter(
        (product) => product.isActive
      );
      setProducts(activeProducts);
      setFilteredProducts(activeProducts);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again.",
        { position: "top-right" }
      );
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get("/categories");
      const activeCategories = response.data.data.filter(
        (cat) => cat.isActive
      );
      setCategories(activeCategories);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again.",
        { position: "top-right" }
      );
    }
  };

  const handleProductClick = (productId) => {
    navigate("/product-details", { state: { product: productId } });
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const filterByCategory = (categoryId) => {
    setActiveCategory(categoryId);
    if (categoryId === "all") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        (product) => product.category?._id === categoryId
      );
      setFilteredProducts(filtered);
    }
  };

  return (
    <>
      <Header />
      <ToastContainer />
      <HeroBadge bgImage={Bg} badgeText={isRTL ? "المنتجات" : "Products"} />

      <section className="bg-white min-h-screen pt-8 pb-16 sm:pt-12 sm:pb-20">
        <div className="max-w-7xl mx-auto px-4 my-10 sm:px-6 lg:px-8">
          {/* Page Title */}
          <h1
            className={`text-2xl sm:text-3xl md:text-4xl font-itim why-underline text-primary ${
              isRTL ? "text-right" : "text-left"
            }`}
          >
            {isRTL ? "اختر نكهتك المفضلة" : "Choose Your favorite Taste"}
          </h1>

          {/* Categories */}
          <div className="mt-6 mb-20 flex flex-wrap justify-center gap-3 sm:gap-4 overflow-x-auto md:overflow-visible pb-4 px-4 md:px-0 -mx-4 md:mx-0">
            <button
              className={`flex-shrink-0 min-w-[100px] sm:min-w-[120px] px-4 py-2 sm:py-3 rounded-xl text-center cursor-pointer transition
                          ${
                            activeCategory === "all"
                              ? "bg-primary text-white"
                              : "bg-white text-primary border border-primary"
                          }`}
              onClick={() => filterByCategory("all")}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category._id}
                className={`flex-shrink-0 min-w-[100px] sm:min-w-[120px] px-4 py-2 sm:py-3 rounded-xl text-center cursor-pointer transition
                            ${
                              activeCategory === category._id
                                ? "bg-primary text-white"
                                : "bg-white text-primary border border-primary"
                            }`}
                onClick={() => filterByCategory(category._id)}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <section className="mt-8 sm:mt-12">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
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
                <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">
                  No products found
                </h3>
                <p className="text-gray-500 text-sm sm:text-base">
                  Try selecting a different category
                </p>
              </div>
            ) : (
              <motion.div
                layout
                className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-15 mt-6 sm:mt-10"
              >
                <AnimatePresence>
                  {filteredProducts.map((product) => (
                    <motion.div
                      key={product._id}
                      layout
                      initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: isRTL ? 50 : -50 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ProductCard
                        product={product}
                        onClick={handleProductClick}
                        isRTL={isRTL}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </section>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Products;
