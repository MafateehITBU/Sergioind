import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSingIn = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      console.error(
        "Login failed:",
        err.response?.data?.message || err.message
      );
      setError(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  return (
    <section className="min-h-screen flex">
      <div className="flex flex-1 min-h-screen">
        {/* Left Side */}
        <div className="relative hidden md:flex md:flex-col md:justify-center md:items-center md:w-2/5 bg-[#59CB00] text-white text-center overflow-hidden !p-6">
          <div className="green-bg absolute inset-0 -z-10 overflow-hidden">
            <div className="circle circle-top-right"></div>
            <div className="circle circle-bottom-left"></div>
          </div>
          <div className="relative w-[400px] z-10 !px-3 flex flex-col justify-center items-center">
            <h2 className="font-bold !mb-13 !text-5xl font-itim">
              Welcome back!
            </h2>
            <p>
              Please sign in to manage your account, track orders, or request
              quotations
            </p>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex flex-col justify-center items-center flex-1 py-10 px-6 md:px-12">
          <div className="max-w-[464px] w-full">
            <h4 className="!mb-12 text-center !text-4xl font-semibold font-itim">
              Sign in
            </h4>

            <form onSubmit={handleSingIn} noValidate>
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

              {/* Email Field */}
              <div className="!mb-4">
                <label
                  htmlFor="email"
                  className="block !mb-2 font-semibold !text-gray-700 text-sm"
                >
                  Email Address
                </label>

                <div className="flex items-center bg-[#e4e4e4] rounded-xl border border-[#e4e4e4] h-14">
                  <span className="text-gray-400 !ml-3 pointer-events-none">
                    <Icon icon="mage:email" width={20} height={20} />
                  </span>

                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Email"
                    className="flex-grow bg-transparent border-none text-base outline-none !px-3"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="relative !mb-5">
                <label
                  htmlFor="password"
                  className="block !mb-2 font-semibold text-gray-700 text-sm"
                >
                  Password
                </label>

                <div className="flex items-center bg-[#e4e4e4] rounded-xl border border-[#e4e4e4] h-14">
                  <span className="text-gray-400 !ml-3 pointer-events-none">
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
                    className="flex-grow bg-transparent border-none text-base outline-none !px-3"
                  />

                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="text-gray-400 hover:text-gray-700 focus:outline-none !mr-3"
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

              {/* Forgot Password */}
              <div className="flex justify-end !mb-6">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="!text-sm !text-gray-500 !hover:text-gray-700 focus:outline-none"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Don't have an account (sign up link) */}
              <div className="text-center !mb-6">
                <span className="!text-sm text-gray-500">
                  Don't have an account?{" "}
                </span>
                <a
                  href="/register"
                  className="!text-sm !text-[#59CB00] hover:underline"
                >
                  Sign Up
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full h-14 bg-primary text-white text-sm font-semibold !rounded-xl hover:bg-[#5faf22] transition-colors cursor-pointer"
              >
                Sign In
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignIn;
