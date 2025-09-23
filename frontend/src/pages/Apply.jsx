import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Icon } from "@iconify/react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { toast, ToastContainer } from "react-toastify";
import axiosInstance from "../axiosConfig";

const Apply = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const post = location.state?.post;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    speciality: "",
    experienceYears: "",
    gender: "",
    phoneNumber: "",
    governorate: "",
    city: "",
    cv: null,
  });

  const jordanCities = [
    "Amman",
    "Irbid",
    "Zarqa",
    "Madaba",
    "Balqa",
    "Mafraq",
    "Ajloun",
    "Jerash",
    "Karak",
    "Tafilah",
    "Ma'an",
    "Aqaba",
  ];

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const submissionData = new FormData();
      submissionData.append("postId", post._id);
      submissionData.append("name", formData.name);
      submissionData.append("email", formData.email);
      submissionData.append("speciality", formData.speciality);
      submissionData.append("experienceYears", formData.experienceYears || "0");
      submissionData.append("gender", formData.gender);
      submissionData.append("phoneNumber", formData.phoneNumber);
      submissionData.append(
        "address",
        JSON.stringify({ governorate: formData.governorate, city: formData.city })
      );

      if (formData.cv) {
        submissionData.append("cv", formData.cv);
      }

      const res = await axiosInstance.post("/applicant", submissionData);

      toast.success("Application submitted successfully!");

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate("/careers");
      }, 2000);
    } catch (err) {
      console.error("Error submitting application:", err);
      toast.error(
        err.response?.data?.message || "Failed to submit application."
      );
    }
  };

  return (
    <>
      <Header />
      <ToastContainer />
      <div className="py-30 px-5 md:px-20 flex flex-col md:flex-row gap-6">
        {/* Job Details */}
        <div className="md:w-1/2 bg-white rounded-lg p-6 shadow sticky top-20 self-start">
          {post ? (
            <>
              {/* Title */}
              <h2 className="text-2xl font-semibold mb-4">{post.title}</h2>

              {/* Tags */}
              <div className="flex gap-9 mb-4">
                <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                  {post.employmentType}
                </span>
                <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                  Jordan
                </span>
                <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                  {post.location}
                </span>
              </div>

              {/* Description */}
              <p className="text-gray-700 leading-relaxed mb-6">
                {post.description}
              </p>

              {/* Extra details */}
              <ul className="text-gray-600 space-y-4 mb-6">
                <li>
                  <div className="font-semibold mb-1">Employment Type:</div>
                  {post.employmentType}
                </li>
                <li>
                  <div className="font-semibold mb-1">Work place Type:</div>
                  {post.location}
                </li>
                <li>
                  <div className="font-semibold mb-1">Experience Required:</div>
                  {post.experienceYears} Years
                </li>
                <li>
                  <div className="font-semibold mb-1">Job Location:</div>{" "}
                  Jordan, Amman
                </li>
              </ul>
            </>
          ) : (
            <p className="text-gray-600">Select a job to view details.</p>
          )}
        </div>

        {/* Application Form */}
        <div className="flex-1 bg-white p-9 rounded-lg shadow">
          <h2 className="text-4xl font-itim mb-6 text-center">
            Apply for this job
          </h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Full Name */}
            <div>
              <label className="block text-md font-semibold mb-1">
                Full Name
              </label>
              <div className="relative">
                <Icon
                  icon="mdi:account-outline"
                  className="absolute left-3 top-3 text-gray-400"
                />
                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Mohammed Ali Awad"
                  className="w-full pl-10 pr-3 py-3 bg-[#f1eeee] rounded text-sm border-2 border-transparent
                    focus:outline-none focus:border-[#59cb00]   "
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-md font-semibold mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Icon
                  icon="mdi:phone-outline"
                  className="absolute left-3 top-3 text-gray-400"
                />
                <input
                  type="tel"
                  name="phoneNumber"
                  placeholder="e.g. 0795888888"
                  className="w-full pl-10 pr-3 py-3 bg-[#f1eeee] rounded text-sm border-2 border-transparent
            focus:outline-none focus:border-[#59cb00]"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-md font-semibold mb-1">
                Email Address
              </label>
              <div className="relative">
                <Icon
                  icon="mdi:email-outline"
                  className="absolute left-3 top-3 text-gray-400"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="e.g. mohammed@example.com"
                  className="w-full pl-10 pr-3 py-3 bg-[#f1eeee] rounded text-sm border-2 border-transparent
            focus:outline-none focus:border-[#59cb00]"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Speciality / Major */}
            <div>
              <label className="block text-md font-semibold mb-1">
                Speciality
              </label>
              <div className="relative">
                <Icon
                  icon="mdi:book-outline"
                  className="absolute left-3 top-3 text-gray-400"
                />
                <input
                  type="text"
                  name="speciality"
                  placeholder="e.g. Factory Manager"
                  className="w-full pl-10 pr-3 py-3 bg-[#f1eeee] rounded text-sm border-2 border-transparent
            focus:outline-none focus:border-[#59cb00]"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-md font-semibold mb-1">
                Address
              </label>
              <div className="flex flex-col md:flex-row md:gap-3">
                {/* governorate */}
                <div className="flex-1">
                  <select
                    name="governorate"
                    className="w-full p-3 bg-[#f1eeee] rounded text-sm border-2 border-transparent focus:outline-none focus:border-[#59cb00]"
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select governorate</option>
                    {jordanCities.map((governorate, idx) => (
                      <option key={idx} value={governorate}>
                        {governorate}
                      </option>
                    ))}
                  </select>
                </div>
                {/* city */}
                <div className="flex-1">
                  <div className="relative">
                    <Icon
                      icon="mdi:map-marker-outline"
                      className="absolute left-3 top-3 text-gray-400"
                    />
                    <input
                      type="text"
                      name="city"
                      placeholder="city"
                      className="w-full pl-10 pr-3 py-3 bg-[#f1eeee] rounded text-sm border-2 border-transparent
                focus:outline-none focus:border-[#59cb00]"
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Gender + Experience Years */}
            <div className="flex flex-col md:flex-row md:gap-3">
              <div className="flex-1">
                <label className="block text-md font-semibold mb-1">
                  Gender
                </label>
                <select
                  name="gender"
                  className="w-full p-3 bg-[#f1eeee] rounded text-sm border-2 border-transparent focus:outline-none focus:border-[#59cb00]"
                  onChange={handleChange}
                  required
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-md font-semibold mb-1">
                  Experience Years
                </label>
                <input
                  type="number"
                  min="0"
                  name="experienceYears"
                  placeholder="e.g. 6"
                  className="w-full p-3 bg-[#f1eeee] rounded text-sm border-2 border-transparent
            focus:outline-none focus:border-[#59cb00]"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Upload CV */}
            <div>
              <label className="block text-md font-semibold mb-1">
                Upload CV
              </label>
              <input
                type="file"
                name="cv"
                accept=".pdf,.doc,.docx"
                className="w-full py-3 bg-[#f1eeee] rounded text-sm border-2 border-transparent file:mr-4 file:py-2 file:px-4 file:rounded file:border file:border-gray-300 file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300 file:cursor-pointer"
                onChange={(e) =>
                  setFormData({ ...formData, cv: e.target.files[0] })
                }
                required
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-primary text-white py-2 rounded hover:scale-103 transition duration-400 cursor-pointer"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Apply;
