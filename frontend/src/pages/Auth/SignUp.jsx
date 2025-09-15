import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useTranslation } from "react-i18next";
import { parsePhoneNumberFromString } from "libphonenumber-js";

const SignUp = () => {
  const { t } = useTranslation("auth");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSingUp = async (e) => {
    e.preventDefault();
    setError("");

    // --- FRONTEND VALIDATIONS ---
    if (!name || !email || !password || !phone) {
      setError(
        "Please provide all required fields: name, email, password, phoneNumber"
      );
      return;
    }

    if (name.length < 2 || name.length > 50) {
      setError("Name must be between 2 and 50 characters");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email");
      return;
    }

    // validate phone
    const phoneNumberObj = parsePhoneNumberFromString(phone);
    if (!phoneNumberObj || !phoneNumberObj.isValid()) {
      setError(
        "Please enter a valid international phone number (include country code, e.g. +962...)"
      );
      return;
    }

    // --- API CALL ---
    try {
      const formattedPhone = phoneNumberObj.number;
      await register(name, email, password, formattedPhone);
      navigate("/");
    } catch (err) {
      console.error(
        "Registration failed:",
        err.response?.data?.message || err.message
      );
      setError(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  return (
    <section className="min-h-screen flex">
      <div className="flex flex-1 min-h-screen">
        {/* Left Side */}
        <div className="flex flex-col justify-center items-center flex-1 py-10 px-6 md:px-12">
          <div className="max-w-[464px] w-full">
            <h4 className="mb-12 text-center text-5xl  font-itim">
              {" "}
              {t("signup.form.title")}{" "}
            </h4>

            <form onSubmit={handleSingUp} noValidate>
              {error && (
                <div
                  role="alert"
                  className="mb-4 flex items-center justify-between bg-red-100 border border-red-300 text-red-700 px-6 py-3 rounded-lg font-semibold text-lg"
                >
                  <span>{error}</span>
                  <button
                    type="button"
                    onClick={() => setError("")}
                    className="text-red-700 text-2xl leading-none"
                    aria-label="Close error"
                  >
                    <Icon icon="iconamoon:sign-times-light" />
                  </button>
                </div>
              )}
              {/* Name Field */}
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block mb-2 font-semibold text-gray-700 text-sm"
                >
                  {t("signup.form.fullName")}
                </label>
                <div className="flex items-center bg-[#e4e4e4] rounded-xl border border-[#e4e4e4] h-14">
                  <span className="text-gray-400 ml-3 pointer-events-none">
                    <Icon icon="mdi:account" width={20} height={20} />
                  </span>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="e.g. Ali Mohammed Awad"
                    className="flex-grow bg-transparent border-none text-base outline-none px-3"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block mb-2 font-semibold text-gray-700 text-sm"
                >
                  {t("signup.form.email")}
                </label>

                <div className="flex items-center bg-[#e4e4e4] rounded-xl border border-[#e4e4e4] h-14">
                  <span className="text-gray-400 ml-3 pointer-events-none">
                    <Icon icon="mage:email" width={20} height={20} />
                  </span>

                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="e.g. mohammed@example.com"
                    className="flex-grow bg-transparent border-none text-base outline-none px-3"
                  />
                </div>
              </div>

              {/* Phone Field */}
              <div className="mb-4">
                <label
                  htmlFor="phone"
                  className="block mb-2 font-semibold text-gray-700 text-sm"
                >
                  {t("signup.form.phone")}
                </label>
                <div className="flex items-center bg-[#e4e4e4] rounded-xl border border-[#e4e4e4] h-14">
                  <span className="text-gray-400 ml-3 pointer-events-none">
                    <Icon icon="mdi:phone" width={20} height={20} />
                  </span>
                  <input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={(e) => {
                      let value = e.target.value;
                      // allow digits and a leading +
                      if (!value.startsWith("+")) {
                        value = value.replace(/\D/g, ""); // remove non-digits if no +
                      } else {
                        value = "+" + value.slice(1).replace(/\D/g, ""); // keep + and digits only
                      }
                      setPhone(value);
                    }}
                    required
                    placeholder="e.g. +962795894444"
                    className="flex-grow bg-transparent border-none text-base outline-none px-3"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="relative mb-5">
                <label
                  htmlFor="password"
                  className="block mb-2 font-semibold text-gray-700 text-sm"
                >
                  {t("signup.form.pass")}
                </label>

                <div className="flex items-center bg-[#e4e4e4] rounded-xl border border-[#e4e4e4] h-14">
                  <span className="text-gray-400 ml-3 pointer-events-none">
                    <Icon
                      icon="solar:lock-password-outline"
                      width={20}
                      height={20}
                    />
                  </span>

                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Password"
                    className="flex-grow bg-transparent border-none text-base outline-none px-3"
                  />

                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="text-gray-400 hover:text-gray-700 focus:outline-none mr-3"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    tabIndex={-1}
                  >
                    <Icon
                      icon={showPassword ? "mdi:eye-off" : "mdi:eye"}
                      width={24}
                      height={24}
                    />
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="relative mb-6">
                <label
                  htmlFor="confirmPassword"
                  className="block mb-2 font-semibold text-gray-700 text-sm"
                >
                  {t("signup.form.confirm")}
                </label>
                <div className="flex items-center bg-[#e4e4e4] rounded-xl border border-[#e4e4e4] h-14">
                  <span className="text-gray-400 ml-3 pointer-events-none">
                    <Icon
                      icon="solar:lock-password-outline"
                      width={20}
                      height={20}
                    />
                  </span>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Confirm Password"
                    className="flex-grow bg-transparent border-none text-base outline-none px-3"
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="text-gray-400 hover:text-gray-700 focus:outline-none mr-3"
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                    tabIndex={-1}
                  >
                    <Icon
                      icon={showConfirmPassword ? "mdi:eye-off" : "mdi:eye"}
                      width={24}
                      height={24}
                    />
                  </button>
                </div>
              </div>

              {/* Already have an account (sign in link) */}
              <div className="text-center mb-6">
                <span className="text-sm text-gray-500">
                  {t("signup.form.signin")}{" "}
                </span>
                <a
                  href="/login"
                  className="text-sm text-[#59CB00] hover:underline"
                >
                  {t("signup.form.signinLink")}
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full h-14 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-secondary transition-colors duration-200 cursor-pointer"
              >
                {t("signup.form.btn")}
              </button>
            </form>
          </div>
        </div>

        {/* Right Side */}
        <div className="relative hidden md:flex md:flex-col md:justify-center md:items-center md:w-2/5 bg-[#59CB00] text-white text-center overflow-hidden p-6">
          <div className="green-bg absolute inset-0 -z-10 overflow-hidden">
            <div className="circle circle-top-right"></div>
            <div className="circle circle-bottom-left"></div>
          </div>
          <div className="relative w-[500px] z-10 px-3 flex flex-col justify-center items-center">
            <h2 className="font-bold mb-13 text-5xl font-itim">
              {t("signup.welcome.title")}
            </h2>
            <p>{t("signup.welcome.p")}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignUp;
