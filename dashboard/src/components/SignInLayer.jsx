import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const SignInLayer = () => {

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
      console.error("Login failed:", err.response?.data?.message || err.message);
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <section className="auth min-vh-100 d-flex">
      {/* Wrapper with container class to support Bootstrap's grid */}
      <div className="container-fluid p-0 d-flex">
        {/* Left side (1/3 of the screen) */}
        <div className="auth-left col-lg-4 col-md-4 p-0 position-relative text-white d-flex align-items-center justify-content-center text-center">
          <div className="green-bg position-absolute w-100 h-100">
            <div className="circle circle-top-right"></div>
            <div className="circle circle-bottom-left"></div>
          </div>
          <div className="z-1 px-3 d-flex justify-content-center align-items-center flex-column text-center">
            <h2 className="fw-bold mb-3 text-light">Welcome back!</h2>
            <p>Welcome back! please enter your details</p>
          </div>
        </div>

        {/* Right side (2/3 of the screen) */}
        <div className="auth-right col-lg-8 col-md-8 d-flex align-items-center justify-content-center py-4 px-3">
          <div className="max-w-464-px mx-auto w-100">
            <div>
              <h4 className="mb-50 text-center">Sign In</h4>
            </div>

            <form onSubmit={handleSingIn}>
              {error && (
                <div className="mb-4 alert alert-danger bg-danger-100 text-danger-600 border-danger-100 px-24 py-11 mb-0 fw-semibold text-lg radius-8 d-flex align-items-center justify-content-between" role="alert">
                  {error}
                  <button className="remove-button text-danger-600 text-xxl line-height-1">
                    <Icon icon="iconamoon:sign-times-light" className="icon" />
                  </button>
                </div>
              )}

              {/* Email Field */}
              <div className="icon-field mb-16">
                <label htmlFor="email" className="form-label">Email Address</label>
                <span className="icon top-50 mt-3 translate-middle-y">
                  <Icon icon="mage:email" />
                </span>
                <input
                  type="email"
                  className="form-control h-56-px bg-neutral-50 radius-12"
                  placeholder="Email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Password Field */}
              <div className="position-relative mb-20">
                <label htmlFor="password" className="form-label">Password</label>
                <div className="icon-field">
                  <span className="icon top-50 translate-middle-y">
                    <Icon icon="solar:lock-password-outline" />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control h-56-px bg-neutral-50 radius-12"
                    placeholder="Password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <span
                  className="mt-3 toggle-password cursor-pointer position-absolute end-0 top-50 translate-middle-y me-16 text-secondary-light"
                  onClick={togglePasswordVisibility}
                >
                  <Icon icon={showPassword ? "mdi:eye-off" : "mdi:eye"} />
                </span>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                className="btn text-light text-sm btn-sm px-12 py-16 w-100 radius-12 mt-32"
                style={{ backgroundColor: "#59CB00" }}
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

export default SignInLayer;