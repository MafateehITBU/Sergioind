import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import axiosInstance from "../axiosConfig";
import HeroBadge from "../components/HeroBadge";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ContactBg from "../assets/imgs/contact-bg.png";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);

    // Validations
    if (
      !formData.name ||
      !formData.email ||
      !formData.phoneNumber ||
      !formData.message
    ) {
      toast.error("Please Fill all the fields", { position: "top-right" });
    }

    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email", { position: "top-right" });
      return;
    }

    const phoneRegex =
      /^(\+?1)?[-.\s]?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      toast.error("Please enter a valid phone number", {
        position: "top-right",
      });
      return;
    }
    try {
      await axiosInstance.post("/contact-us", formData);
      toast.success("Message Sent Successfully", { position: "top-right" });

      // Reset form
      setFormData({
        name: "",
        email: "",
        phoneNumber: "",
        message: "",
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again.",
        { position: "top-right" }
      );
    }
  };

  return (
    <>
      <Header />

      <ToastContainer />
      {/* Hero Section */}
      <HeroBadge bgImage={ContactBg} badgeText="Contact Us" />

      {/* Contact Content */}
      <section className="py-25 pb-40 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl sm:text-2xl md:text-4xl text-primary font-itim leading-tight why-underline mb-5">
                  Let's get in touch
                </h2>
                <p className="text-lg text-secondary mb-8">
                  Lorem ipsum dolor sit amet consectetur. A in fringilla
                  pulvinar cursus. Adipiscing eget habitant commodo et.
                </p>
              </div>

              {/* Contact Details */}
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-lg font-semibold text-text">
                      Tell: &nbsp;
                    </span>
                    <span className="text-gray-600">+962 7 9120 1150</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-lg font-semibold text-text">
                      Email: &nbsp;
                    </span>
                    <span className="text-text">info@sergio-ind.com</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <span className="text-lg font-semibold text-text">
                      Location: &nbsp;
                    </span>
                    <span className="text-text">
                      Jordan - Amman - Sahab - King Abdullah Industrial City -
                      Second Door.
                    </span>
                  </div>
                </div>
              </div>

              {/* Follow Us */}
              <div>
                <h2 className="text-2xl sm:text-2xl md:text-4xl text-primary font-itim leading-tight why-underline mb-5">
                  Follow Us
                </h2>

                <div className="flex flex-row gap-5">
                  {/* Instagram */}
                  <a
                    href="https://www.instagram.com/sergio.industries/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center hover:scale-110 transition"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-full h-full"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M15.5 5H9.5C7.29 5 5.5 6.79 5.5 9V15C5.5 17.21 7.29 19 9.5 19H15.5C17.71 19 19.5 17.21 19.5 15V9C19.5 6.79 17.71 5 15.5 5Z"
                        stroke="#000"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M12.5 15C10.84 15 9.5 13.66 9.5 12C9.5 10.34 10.84 9 12.5 9C14.16 9 15.5 10.34 15.5 12C15.5 13.66 14.16 15 12.5 15Z"
                        stroke="#000"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <rect
                        x="16"
                        y="8"
                        width="2"
                        height="2"
                        rx="1"
                        fill="#000"
                      />
                    </svg>
                  </a>

                  {/* Facebook */}
                  <a
                    href="https://www.facebook.com/sergio.ind/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center hover:scale-110 transition"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-full h-full"
                    >
                      <path
                        d="M20 12.05C19.98 10.53 19.53 9.04 18.69 7.76C17.86 6.49 16.67 5.48 15.28 4.85C13.89 4.23 12.35 4.01 10.84 4.23C9.33 4.45 7.92 5.1 6.77 6.1C5.61 7.09 4.77 8.4 4.33 9.86C3.9 11.32 3.89 12.88 4.31 14.34C4.73 15.81 5.56 17.13 6.7 18.14C7.84 19.15 9.24 19.81 10.75 20.05V14.38H8.75V12.05H10.75V10.28C10.7 9.87 10.75 9.45 10.88 9.06C11.01 8.67 11.23 8.31 11.52 8.01C11.8 7.71 12.15 7.48 12.54 7.33C12.92 7.18 13.34 7.11 13.75 7.14C14.35 7.15 14.95 7.2 15.54 7.3V9.3H14.54C14.19 9.3 13.86 9.41 13.59 9.62C13.37 9.89 13.25 10.21 13.24 10.56V12.07H15.46L15.1 14.4H13.25V20C15.14 19.7 16.86 18.73 18.1 17.28C19.34 15.82 20.01 13.96 20 12.05Z"
                        fill="#000"
                      />
                    </svg>
                  </a>

                  {/* LinkedIn */}
                  <a
                    href="https://www.linkedin.com/in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center hover:scale-110 transition"
                  >
                    <svg
                      viewBox="0 0 32 32"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-full h-full mt-1"
                      fill="#000"
                    >
                      <g transform="scale(0.85) translate(2,2)">
                        <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4V24h-4V8zm7.5 0h3.8v2.2h.1c.53-1 1.82-2.2 3.75-2.2C19.4 8 22 10.3 22 14.5V24h-4v-8.6c0-2-1-3.4-3-3.4s-2.5 1.3-2.5 3.3V24h-4V8z" />
                      </g>
                    </svg>
                  </a>
                </div>
              </div>

              {/* Map */}
              <div className="mt-8">
                <div className="w-full h-80 rounded-xl overflow-hidden shadow-lg">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3389.4752409517573!2d36.01480277508245!3d31.839280731317718!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151b5bcc04a68175%3A0xbb60791ee9519d78!2sSergio%20for%20food%20Industries!5e0!3m2!1sen!2sjo!4v1755337069019!5m2!1sen!2sjo"
                    width="600"
                    height="450"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-primary rounded-xl shadow-lg p-15">
              <h2 className="text-3xl font-itim text-white mb-2">
                Send us a Message
              </h2>
              <p className="text-white text-[1.1rem] mb-8">
                Lorem ipsum dolor sit amet consectetur. A in fringilla pulvinar
                cursus.
              </p>

              <form
                onSubmit={handleSubmit}
                className="space-y-6 relative pb-20"
              >
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-lg font-medium text-white mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-[#f9f9f9] border-[#f9f9f9] focus:outline-none focus:ring-2 focus:ring-gray-50"
                  />
                </div>

                {/* Name & PhoneNumber */}
                <div className="flex justify-between gap-4">
                  <div className="w-1/2">
                    <label
                      htmlFor="name"
                      className="block text-lg font-medium text-white mb-2"
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-[#f9f9f9] border-[#f9f9f9] focus:outline-none focus:ring-2 focus:ring-gray-50"
                    />
                  </div>

                  <div className="w-1/2">
                    <label
                      htmlFor="phoneNumber"
                      className="block text-lg font-medium text-white mb-2"
                    >
                      Phone
                    </label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      required
                      pattern="[0-9]{10}"
                      maxLength={10}
                      inputMode="numeric"
                      className="w-full px-4 py-3 rounded-lg bg-[#f9f9f9] border-[#f9f9f9] focus:outline-none focus:ring-2 focus:ring-gray-50"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className="block text-lg font-medium text-white mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={8}
                    className="w-full px-4 py-3 rounded-lg bg-[#f9f9f9] border-[#f9f9f9] focus:outline-none focus:ring-2 focus:ring-gray-50"
                  ></textarea>
                </div>

                {/* Send Button */}
                <button
                  className="absolute bottom-0 right-0 bg-white text-primary text-lg px-6 py-3 rounded-lg font-semibold hover:scale-105 transition duration-300 cursor-pointer"
                  type="submit"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Contact;
