import { useQuotation } from "../context/QuotationContext";
import { useState, useEffect, useRef } from "react";
import axiosInstance from "../axiosConfig";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Icon } from "@iconify/react";
import Swal from "sweetalert2";
import { Helmet } from "@dr.pogodin/react-helmet";

import Header from "../components/Header";
import Footer from "../components/Footer";
import Img from "../assets/imgs/no-quotation.png";
import ShapesCaptcha from "../components/ShapesCaptcha";

const Quotation = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";

  const { items, clearItems, removeItem, addItem } = useQuotation();
  const [form, setForm] = useState({
    name: "",
    companyName: "",
    email: "",
    phoneNumber: "",
    note: "",
  });

  const [products, setProducts] = useState([]);

  // --- Captcha + submit wiring ---
  const [isCaptchaOpen, setIsCaptchaOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const sendBtnRef = useRef(null);

  const fetchProductsDetails = async () => {
    try {
      const productIds = items.map((item) => item.product);
      if (productIds.length === 0) return;

      const responses = await Promise.all(
        productIds.map((id) => axiosInstance.get(`/products/${id}`))
      );
      const productsData = responses.map((res) => res.data.data);
      setProducts(productsData);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again.",
        { position: "top-right" }
      );
    }
  };

  useEffect(() => {
    fetchProductsDetails();
  }, [items]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Actual send (called after captcha passes)
  const actuallySend = async () => {
    try {
      setIsSubmitting(true);

      const payload = {
        ...form,
        items: items,
      };

      await axiosInstance.post("/quotation-requests", payload);

      clearItems();

      Swal.fire({
        icon: "success",
        title: isRTL ? "تم إرسال طلب العرض" : "Quotation request sent",
        text: isRTL ? "سنتواصل معك قريبًا" : "We will contact you shortly",
        showConfirmButton: false,
        timer: 4000,
      });
    } catch (err) {
      console.error("Error response:", err.response?.data);
      toast.error(
        err.response?.data?.message ||
          "Something went wrong. Please try again.",
        { position: "top-right" }
      );
    } finally {
      setIsSubmitting(false);
      setIsCaptchaOpen(false);
    }
  };

  const handleSubmit = () => {
    // validate form
    if (!form.name || !form.email || !form.phoneNumber) {
      toast.error("Please fill in all required fields", {
        position: "top-right",
      });
      return;
    }

    // email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      toast.error("Please enter a valid email address", {
        position: "top-right",
      });
      return;
    }

    // phone number regex (Jordanian format)
    const phoneRegex = /^(?:\+962|0)?7[789]\d{7}$/;
    if (!phoneRegex.test(form.phoneNumber)) {
      toast.error("Please enter a valid phone number", {
        position: "top-right",
      });
      return;
    }

    if (items.length === 0) {
      toast.error("Please add at least one product", { position: "top-right" });
      return;
    }

    // Open captcha instead of sending immediately
    setIsCaptchaOpen(true);
  };

  const handleIncrease = (productId, size) => {
    addItem(productId, size, 1);
  };

  const handleDecrease = (productId, size) => {
    const item = items.find((i) => i.product === productId && i.size === size);
    if (item && item.quantity > 1) {
      addItem(productId, size, -1);
    }
  };

  const title = "Sergio | Quotation";
  const description =
    "Request a custom quotation for our premium food products including corn chips, and snack varieties. Get competitive prices directly from our factory.";
  const canonical = "https://sergio-ind.com/quotations";
  const ogImage = "https://sergio-ind.com/og/OG_image.png";

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />
        <meta name="robots" content="index, follow" />
        <meta
          name="keywords"
          content="corn chips quotation, snack quotation, food products quotation, food industry quotation, snack production quote, snack factory Jordan"
        />

        {/* Open Graph */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content={ogImage} />
      </Helmet>

      <Header />
      <ToastContainer />

      <div className="max-w-6xl mx-auto py-40 px-4">
        {items.length === 0 ? (
          // Empty state
          <div className="text-center py-16">
            <div className="flex items-center justify-center mx-auto mb-4">
              <img src={Img} alt="No items" className="w-50 h-50" />
            </div>
            <h3 className="text-4xl font-itim text-text mb-2">
              {isRTL
                ? "لا توجد طلبات عروض أسعار حتى الآن"
                : "No Quotation Requests Yet"}
            </h3>
            <p className="text-gray-500">
              {isRTL
                ? "لم تقم بإنشاء أي طلبات عروض أسعار حتى الآن."
                : "You haven’t created any quotation requests."}
            </p>
            <button
              onClick={() => navigate("/products")}
              className="mt-6 w-[70%] bg-primary text-white px-6 py-3 rounded-lg cursor-pointer hover:scale-105 transition duration-300"
            >
              {isRTL ? "إضافة طلب عرض سعر" : "Add Quotation Request"}
            </button>
          </div>
        ) : (
          // Quotation request layout
          <div>
            <h1 className="text-4xl font-itim why-underline text-primary mb-15">
              {isRTL ? "طلب عرض سعر" : "Quotation Request"}
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Left - Products Table */}
              <div className="border border-gray-300 rounded-2xl p-5">
                {/* Table headers */}
                <div className="grid grid-cols-3 font-semibold text-gray-700 border-b pb-2 mb-4">
                  <span>
                    {" "}
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
                    {isRTL ? "المنتج" : "Product"}
                  </span>
                  <span>{isRTL ? "الوصف" : "Description"}</span>
                  <span className="text-center">
                    {isRTL ? "الكمية" : "Quantity"}
                  </span>
                </div>

                <div className="space-y-6">
                  {items.map((item, i) => {
                    const product = products.find(
                      (p) => p._id === item.product
                    );
                    return (
                      <div
                        key={i}
                        className="grid grid-cols-3 items-center gap-4 border-gray-300 border-b pb-4"
                      >
                        {/* Product column */}
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => removeItem(item.product, item.size)}
                            className="text-gray-500 text-2xl cursor-pointer"
                          >
                            ×
                          </button>
                          {product && product.image?.length > 0 && (
                            <img
                              src={product.image[0].url}
                              alt={product.name}
                              className="w-20 h-20 object-contain"
                            />
                          )}
                        </div>

                        {/* Description column */}
                        <div>
                          <p className="font-semibold mb-2">
                            {isRTL ? product?.nameAr : product?.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {isRTL
                              ? product?.descriptionAr
                              : product?.description}
                          </p>
                        </div>

                        {/* Quantity column */}
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() =>
                              handleDecrease(item.product, item.size)
                            }
                            className="px-2 py-1 rounded cursor-pointer text-white bg-primary"
                          >
                            −
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            onClick={() =>
                              handleIncrease(item.product, item.size)
                            }
                            className="px-2 py-1 rounded cursor-pointer text-white bg-primary"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right - Form */}
              <div className="border border-gray-300 rounded-2xl p-5 relative pb-28">
                <h2 className="text-3xl font-itim mb-2">
                  {isRTL ? "معلومات الاتصال" : "Contact Information"}
                </h2>
                <p className="text-gray-500 mb-6">
                  {isRTL
                    ? "يرجى ملء النموذج أدناه لطلب عرض سعر"
                    : "Please fill out the form below to request a quotation"}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* Name */}
                  <div>
                    <label className="block mb-1 font-semibold">
                      {isRTL ? "الاسم الكامل " : "Full Name "}
                    </label>
                    <div className="relative">
                      <Icon
                        icon="mdi:account"
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#c5c5c5]"
                      />
                      <input
                        name="name"
                        placeholder={
                          isRTL
                            ? "مثال: محمد علي عواد"
                            : "e.g. Mohamed Ali Awad"
                        }
                        value={form.name}
                        onChange={handleChange}
                        className="pl-10 bg-[#e4e4e4] focus:outline-none focus:ring-2 focus:ring-primary p-3 rounded w-full"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block mb-1 font-semibold">
                      {isRTL ? "البريد الإلكتروني " : "Email Address "}
                    </label>
                    <div className="relative">
                      <Icon
                        icon="mdi:email"
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#c5c5c5]"
                      />
                      <input
                        name="email"
                        placeholder="e.g. mohammed@ex.com"
                        value={form.email}
                        onChange={handleChange}
                        className="pl-10 bg-[#e4e4e4] focus:outline-none focus:ring-2 focus:ring-primary p-3 rounded w-full"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block mb-1 font-semibold">
                      {isRTL ? "رقم الهاتف " : "Phone Number "}
                    </label>
                    <div className="relative">
                      <Icon
                        icon="mdi:phone"
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#c5c5c5]"
                      />
                      <input
                        name="phoneNumber"
                        placeholder="e.g. 0795555555"
                        value={form.phoneNumber}
                        onChange={handleChange}
                        className="pl-10 bg-[#e4e4e4] focus:outline-none focus:ring-2 focus:ring-primary p-3 rounded w-full"
                      />
                    </div>
                  </div>

                  {/* Company */}
                  <div>
                    <label className="block mb-1 font-semibold">
                      {isRTL ? "اسم الشركة" : "Company Name"}
                    </label>
                    <div className="relative">
                      <Icon
                        icon="mdi:office-building"
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#c5c5c5]"
                      />
                      <input
                        name="companyName"
                        placeholder={
                          isRTL
                            ? "مثال: حلول المستقبل التقنية"
                            : "e.g. Future Tech Solutions"
                        }
                        value={form.companyName}
                        onChange={handleChange}
                        className="pl-10 bg-[#e4e4e4] focus:outline-none focus:ring-2 focus:ring-primary p-3 rounded w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Note */}
                <div className="mb-4">
                  <label className="block mb-1 font-semibold">
                    {isRTL ? "رسالة" : "Message"}
                  </label>
                  <textarea
                    name="note"
                    placeholder={
                      isRTL
                        ? "اكتب أي تعليقات، أسئلة، أو طلبات خاصة هنا..."
                        : "Write any comments, questions, or special requests here..."
                    }
                    value={form.note}
                    onChange={handleChange}
                    className="bg-[#e4e4e4] p-4 rounded w-full h-32 border-none  focus:outline-none focus:ring-2 focus:ring-primary"
                  ></textarea>
                </div>

                <button
                  ref={sendBtnRef}
                  onClick={handleSubmit}
                  disabled={items.length === 0 || isSubmitting}
                  className="bg-primary text-white px-6 py-3 rounded-lg w-full cursor-pointer hover:scale-105 transition duration-300 disabled:opacity-60"
                >
                  {isSubmitting
                    ? isRTL
                      ? "جار الإرسال..."
                      : "Sending…"
                    : isRTL
                    ? "إرسال"
                    : "Send"}
                </button>

                {/* Captcha anchored above the Send button */}
                <ShapesCaptcha
                  open={isCaptchaOpen}
                  language={i18n.language}
                  anchorRef={sendBtnRef}
                  onClose={() => setIsCaptchaOpen(false)}
                  onPass={actuallySend}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default Quotation;
