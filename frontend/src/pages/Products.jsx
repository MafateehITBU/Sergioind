import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axiosInstance from "../axiosConfig";
import { useTranslation } from "react-i18next";

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
      setProducts(response.data.data);
      setFilteredProducts(response.data.data); // show all initially
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
      setCategories(response.data.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again.",
        { position: "top-right" }
      );
    }
  };

  const handleProductClick = (productId) => {
    console.log("Product clicked:", productId);
    navigate("/product-details", { state: { product: productId } });
  };

  const getProductImage = (product) => {
    return (
      product.image[0].url ||
      "https://via.placeholder.com/300x200?text=No+Image"
    );
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Filter products by category
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
      <HeroBadge bgImage={Bg} badgeText={isRTL ? `المنتجات` : `Products`} />

      <section className="container pt-30 pb-30 min-h-screen bg-white">
        <h1 className="text-4xl font-itim why-underline text-primary">
          {isRTL ? "اختر نكهتك المفضلة" : "Choose Your favorite Taste"}
        </h1>

        {/* Main Content */}
        <div className="mt-12">
          {/* Categories */}
          <div className="flex flex-wrap justify-center items-center gap-4 overflow-x-auto pb-4">
            <button
              className={`min-w-[120px] px-4 py-3 rounded-xl text-center cursor-pointer transition 
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
                className={`min-w-[120px] px-4 py-3 rounded-xl text-center cursor-pointer transition 
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
          <section className="py-16 pb-40 bg-white">
            <div className="max-w-7xl mx-auto px-6">
              {filteredProducts.length === 0 ? (
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
                    No products found
                  </h3>
                  <p className="text-gray-500">
                    Try selecting a different category
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-10">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      onClick={handleProductClick}
                      isRTL={isRTL}
                    />
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Products;
