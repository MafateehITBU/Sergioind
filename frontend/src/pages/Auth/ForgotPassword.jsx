import { useState, useRef } from "react";
import axiosInstance from "../../axiosConfig";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import Lock from "../../assets/imgs/forgot_password.png";
import { useTranslation } from "react-i18next";

const ResetPassword = () => {
  const { t } = useTranslation("auth");
  const validations = t("forgot.step3.validations", { returnObjects: true });

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    try {
      await axiosInstance.put("/user/send-otp", { email });
      toast.success("OTP sent successfully", { position: "top-right" });
      setStep(2);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error sending OTP", {
        position: "top-right",
      });
    }
  };

  const handleOtpChange = (e, index) => {
    const val = e.target.value;
    if (/^[0-9]?$/.test(val)) {
      // Only allow single digit or empty
      const newOtp = [...otp];
      newOtp[index] = val;
      setOtp(newOtp);
      if (val !== "" && index < otp.length - 1) {
        // Focus next input if exists and current input is filled
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const fullOtp = otp.join("");
      await axiosInstance.post("/user/verify-otp", { email, otp: fullOtp });
      setStep(3);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Invalid OTP. Please try again.",
        { position: "top-right" }
      );
    }
  };

  const handleResetPassword = async () => {
    if (password !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Passwords do not match",
        confirmButtonColor: "#59CB00",
      });
      return;
    }

    if (password.length < 8 || !/[A-Z0-9!@#$%^&*]/.test(password)) {
      Swal.fire({
        icon: "error",
        title: "Password does not meet criteria",
        confirmButtonColor: "#59CB00",
      });
      return;
    }

    try {
      await axiosInstance.post("/user/reset-password", {
        email,
        newPassword: password,
        confirmPassword,
      });

      Swal.fire({
        icon: "success",
        title: "Password Reset Successfully",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      }).then(() => {
        navigate("/login");
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: error.response?.data?.message || "Something went wrong",
        confirmButtonColor: "#59CB00",
      });
    }
  };

  const renderStep1 = () => (
    <div className="flex flex-col items-center justify-center px-4 py-8 max-w mx-auto w-full">
      <img src={Lock} alt="Lock Icon" className="mx-auto mb-6" />
      <h3 className="text-center text-4xl mb-5 font-itim">
        {t("forgot.step1.title")}
      </h3>
      <p className="text-center mb-18 text-gray-600">
        {t("forgot.step1.description")}
      </p>

      <div className="relative w-full mb-6 max-w-md">
        <Icon
          icon="mdi:email-outline"
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full pl-10 pr-4 h-11 rounded-lg border bg-[#e4e4e4] border-[#e4e4e4] focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <button
        onClick={handleSendOtp}
        className="w-[25%] bg-primary hover:scale-105 transform text-white font-semibold py-3 rounded-lg transition duration-400 cursor-pointer"
      >
        {t("forgot.step1.btn")}
      </button>

      <p
        onClick={() => navigate("/login")}
        className="flex items-center gap-2 mt-12 cursor-pointer text-gray-700 hover:text-green-600 select-none"
      >
        <Icon icon="ic:baseline-arrow-back" className="text-xl" />
        {t("forgot.step1.loginLink")}
      </p>
    </div>
  );

  const renderStep2 = () => (
    <div className="flex flex-col items-center justify-center px-4 py-8 max-w mx-auto w-full">
      <h2 className="text-4xl mb-5 font-itim"> {t("forgot.step2.title")}</h2>
      <p className="mb-8 text-center text-gray-600 max-w-sm">
        {t("forgot.step2.description")}
      </p>

      {/* OTP inputs - force LTR */}
      <div
        className="flex justify-center gap-3 mb-6"
        style={{ direction: "ltr" }} // forces LTR layout
      >
        {otp.map((digit, index) => (
          <input
            key={index}
            maxLength={1}
            value={digit}
            onChange={(e) => handleOtpChange(e, index)}
            ref={(el) => (inputRefs.current[index] = el)}
            className="w-30 h-30 text-center rounded-md border border-gray-300 
                     focus:outline-none focus:ring-2 focus:ring-green-500 
                     text-lg shadow-md"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            style={{ direction: "ltr", textAlign: "center" }} // enforce LTR typing
          />
        ))}
      </div>

      <div className="flex w-[800px] justify-end">
        <div className="mb-6 text-gray-600 ">
          {t("forgot.step2.notRecieve")}{" "}
          <button
            onClick={handleSendOtp}
            className="text-primary hover:underline focus:outline-none cursor-pointer"
          >
            {t("forgot.step2.notRecieveLink")}
          </button>
        </div>
      </div>

      <button
        className="w-[25%] bg-primary hover:scale-105 transform text-white font-semibold py-3 rounded-lg transition duration-400"
        onClick={handleVerifyOtp}
      >
        {t("forgot.step2.btn")}
      </button>
    </div>
  );

  const renderStep3 = () => {
    const isPasswordValid =
      password.length >= 8 && /[A-Z0-9!@#$%^&*]/.test(password);

    return (
      <div className="flex flex-col items-center px-4 py-8 max-w mx-auto w-full">
        <div className="flex flex-col items-center w-full">
          <h2 className="text-4xl mb-3 font-itim">{t("forgot.step3.title")}</h2>
          <p className="mb-8 text-center text-gray-600">
            {t("forgot.step3.description")}
          </p>

          {/* New Password */}
          <div className="relative w-full max-w-md">
            <label className="block mb-2 font-semibold">
              {t("forgot.step3.newPass")}
            </label>
            <div className="flex items-center w-full mb-6 max-w-md border bg-[#e4e4e4] border-[#e4e4e4] rounded-lg focus-within:ring-2 focus-within:ring-green-500">
              <Icon
                icon="mdi:lock-outline"
                className="ml-3 text-gray-400 text-xl"
              />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 py-3 px-4 rounded-r-lg focus:outline-none "
              />
              <Icon
                icon={showPassword ? "mdi:eye-off-outline" : "mdi:eye-outline"}
                onClick={() => setShowPassword(!showPassword)}
                className="mr-3 cursor-pointer text-gray-400 text-xl select-none"
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div className="relative w-full mb-6 max-w-md ">
            <label className="block mb-2 font-semibold">
              {t("forgot.step3.confirmPass")}
            </label>
            <div className="flex items-center w-full max-w-md border bg-[#e4e4e4] border-[#e4e4e4] rounded-lg focus-within:ring-2 focus-within:ring-green-500">
              <Icon
                icon="mdi:lock-outline"
                className="ml-3 text-gray-400 text-xl"
              />
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="flex-1 py-3 px-4 rounded-r-lg focus:outline-none"
              />
              <Icon
                icon={
                  showConfirmPassword
                    ? "mdi:eye-off-outline"
                    : "mdi:eye-outline"
                }
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="mr-3 cursor-pointer text-gray-400 text-xl select-none"
              />
            </div>
          </div>
        </div>

        {/* Password validation hint */}
        {password && !isPasswordValid && (
          <div className="self-center text-left text-sm max-w-md mb-5 mt-5">
            <p>{t("forgot.step3.validationTitle")}</p>
            <ul className="list-disc list-inside text-gray-600">
              {validations.map((v, idx) => (
                <li key={idx}>{v}</li>
              ))}
            </ul>
          </div>
        )}

        <button
          className="mt-4 self-center w-[25%] bg-primary hover:scale-105 transform text-white font-semibold py-3 rounded-lg transition duration-400 cursor-pointer"
          onClick={handleResetPassword}
        >
          {t("forgot.step3.btn")}
        </button>
      </div>
    );
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
      <ToastContainer />
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
    </div>
  );
};

export default ResetPassword;
