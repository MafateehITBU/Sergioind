import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import HeroBadge from "../components/HeroBadge";
import CertificateCard from "../components/CertificateCard";
import Bg from "../assets/imgs/certificate-bg.png";
import axiosInstance from "../axiosConfig";
import { ToastContainer, toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import ClipLoader from "react-spinners/ClipLoader";
import { Helmet } from "@dr.pogodin/react-helmet";

function Certificate() {
  const { i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";
  const isArabic = i18n.language?.startsWith("ar");

  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  // keep <html> language & direction correct
  useEffect(() => {
    document.documentElement.lang = isArabic ? "ar" : "en";
    document.documentElement.dir = isArabic ? "rtl" : "ltr";
  }, [isArabic]);

  const fetchCertificates = async () => {
    try {
      const response = await axiosInstance.get("/filecenter");
      const activeCertificates = response.data.data.filter(
        (certificate) => certificate.isActive
      );
      setCertificates(activeCertificates);
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

  useEffect(() => {
    fetchCertificates();
  }, []);

  // SEO strings
  const title = isArabic ? "سيرجيو | الشهادات" : "Sergio | Certificates";

  const description = isArabic
    ? "اطّلع على شهادات الجودة والاعتمادات الرسمية لسيرجيو للصناعات، ومعايير الامتثال التي نلتزم بها لتقديم سناكس عالية الجودة بأمان."
    : "View Sergio Industries’ quality certificates and official accreditations. Explore our compliance standards and commitment to safe, high-quality snacks.";

  const canonical = "https://sergio-ind.com/certificate";
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
          content="Sergio certificates, food safety certifications, quality certifications, ISO certification, snack industry standards, food manufacturing compliance, Sergio Industries"
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
      <HeroBadge bgImage={Bg} badgeText={isRTL ? "شهادات" : "Certificate"} />

      {/* Main Content */}
      <section className="pt-16 pb-30 min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-start">
            <h2 className="text-2xl sm:text-2xl md:text-4xl text-primary font-itim leading-tight why-underline mb-5">
              {isRTL
                ? "شهادات الجودة الخاصة بنا"
                : "Our Quality Certifications"}
            </h2>
          </div>

          {loading ? (
            <div className="flex justify-center items-center min-h-[50vh]">
              <ClipLoader size={70} color="#36d7b7" />
            </div>
          ) : certificates.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-600 text-lg">
                {isRTL
                  ? "لا توجد شهادات متاحة حاليا."
                  : "No certificates available at the moment."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
              {certificates.map((cert) => (
                <CertificateCard key={cert.id} certificate={cert} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Certificate;
