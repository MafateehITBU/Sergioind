import axiosInstance from "../axiosConfig";
import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import HeroBadge from "../components/HeroBadge";
import PostCard from "../components/PostCard";
import Bg from "../assets/imgs/careers-bg.png";
import Img from "../assets/imgs/no-quotation.png";
import { Icon } from "@iconify/react";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

function Career() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showCount, setShowCount] = useState(5);
  const [isSending, setIsSending] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    specialty: "",
    file: null,
  });

  // Filters state
  const [search, setSearch] = useState("");
  const [experience, setExperience] = useState("All");
  const [location, setLocation] = useState("All");
  const [employmentType, setEmploymentType] = useState("All");

  const navigate = useNavigate();

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
  };

  const fetchPosts = async () => {
    try {
      const res = await axiosInstance("/post");
      setPosts(res.data.data);
      setFilteredPosts(res.data.data);
      if (res.data.data.length > 0) {
        setSelectedPost(res.data.data[0]); // default first post
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again.",
        { position: "top-right" }
      );
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    handleFilter();
  }, [search, experience, location, employmentType, posts]);

  const handleFilter = () => {
    let temp = [...posts];

    // Search filter
    if (search.trim() !== "") {
      temp = temp.filter((post) =>
        post.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Experience filter
    if (experience !== "All") {
      if (experience === "0-1") {
        temp = temp.filter((post) => post.experienceYears <= 1);
      } else if (experience === "2-4") {
        temp = temp.filter(
          (post) => post.experienceYears >= 2 && post.experienceYears <= 4
        );
      } else if (experience === "5+") {
        temp = temp.filter((post) => post.experienceYears >= 5);
      }
    }

    // Location filter
    if (location !== "All") {
      temp = temp.filter((post) => post.location === location);
    }

    // Employment Type filter
    if (employmentType !== "All") {
      temp = temp.filter((post) => post.employmentType === employmentType);
    }

    setFilteredPosts(temp);
    if (temp.length > 0) setSelectedPost(temp[0]); // reset selection
  };

  const handleModalSubmit = async () => {
    if (!formData.name || !formData.specialty || !formData.file) {
      toast.error("Please fill all fields and upload your CV.", {
        position: "top-right",
      });
      return;
    }

    const fd = new FormData();
    fd.append("name", formData.name);
    fd.append("specialty", formData.specialty);
    fd.append("cv", formData.file);

    try {
      setIsSending(true);
      const res = await axiosInstance.post("/cv", fd);
      toast.success(res.data.message || "CV sent successfully!", {
        position: "top-right",
      });
      setShowModal(false);
      setFormData({ name: "", specialty: "", file: null });
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again.",
        { position: "top-right" }
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <Header />
      <HeroBadge bgImage={Bg} badgeText="Careers" />
      <ToastContainer />

      <div className="mx-3 md:mx-0">
        {/* Main Content */}
        {filteredPosts && (
          <section dir="ltr" className="py-30 min-h-screen bg-gray-50">
            {/* Search and filters */}
            <div className="max-w-7xl mx-auto px-6 py-16 bg-white border-white rounded-2xl flex flex-col gap-6">
              {/* Search bar */}
              <div className="flex items-center justify-center w-full">
                <div className="relative w-[50%]">
                  {/* Icon */}
                  <Icon
                    icon="material-symbols:search"
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl"
                  />

                  {/* Input */}
                  <input
                    type="text"
                    placeholder="Search for jobs.."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#e6e5e5] focus:outline-none"
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="flex  flex-col md:flex-row flex-wrap gap-5 md:gap-25 items-center justify-center">
                {/* Experience Level */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Experience Level
                  </label>
                  <select
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="border-2 border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="All">All Experience Level</option>
                    <option value="0-1">0-1 years</option>
                    <option value="2-4">2-4 years</option>
                    <option value="5+">5+ years</option>
                  </select>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Location
                  </label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="border-2 border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="All">All Location</option>
                    <option value="On-site">On-site</option>
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>

                {/* Employment Type */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Employment Type
                  </label>
                  <select
                    value={employmentType}
                    onChange={(e) => setEmploymentType(e.target.value)}
                    className="border-2 border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="All">All Types</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Posts Layout */}
            {filteredPosts.length > 0 ? (
              <div className="max-w-7xl mx-auto mt-10 grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Left side: Post list */}
                <div className="col-span-2">
                  {filteredPosts.slice(0, showCount).map((post) => (
                    <PostCard
                      key={post._id}
                      post={post}
                      isActive={selectedPost?._id === post._id}
                      onClick={() => setSelectedPost(post)}
                    />
                  ))}
                </div>

                {/* Right side: Post details */}
                <div className="col-span-2 bg-white rounded-lg p-6 shadow sticky top-20 self-start">
                  {selectedPost ? (
                    <>
                      {/* Title */}
                      <h2 className="text-2xl font-semibold mb-4">
                        {selectedPost.title}
                      </h2>

                      {/* Tags */}
                      <div className="flex gap-9 mb-4">
                        <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                          {selectedPost.employmentType}
                        </span>
                        <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                          Jordan
                        </span>
                        <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                          {selectedPost.location}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-gray-700 leading-relaxed mb-6">
                        {selectedPost.description}
                      </p>

                      {/* Extra details */}
                      <ul className="text-gray-600 space-y-4 mb-6">
                        <li>
                          <div className="font-semibold mb-1">
                            Employment Type:
                          </div>
                          {selectedPost.employmentType}
                        </li>
                        <li>
                          <div className="font-semibold mb-1">
                            Work place Type:
                          </div>
                          {selectedPost.location}
                        </li>
                        <li>
                          <div className="font-semibold mb-1">
                            Experience Required:
                          </div>
                          {selectedPost.experienceYears} Years
                        </li>
                        <li>
                          <div className="font-semibold mb-1">
                            Job Location:
                          </div>{" "}
                          Jordan, Amman
                        </li>
                      </ul>

                      {/* Apply Button */}
                      <button
                        className="px-6 py-3 w-full bg-primary text-white rounded-lg hover:scale-105 transition transform duration-400 cursor-pointer"
                        onClick={() =>
                          navigate("/apply", { state: { post: selectedPost } })
                        }
                      >
                        Apply Now
                      </button>
                    </>
                  ) : (
                    <p className="text-gray-600">
                      Select a job to view details.
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="max-w-7xl mx-auto mt-10">
                <div className="text-center py-16">
                  <div className="flex items-center justify-center mx-auto mb-4">
                    <img src={Img} alt="No items" className="w-50 h-50" />
                  </div>
                  <h3 className="text-4xl font-itim text-text mb-2">
                    No Jobs Found
                  </h3>
                  <p className="text-gray-500">
                    We couldn't find any job postings matching your criteria.
                  </p>
                </div>
              </div>
            )}

            {/* View More Button */}
            {filteredPosts.length > showCount && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={() => setShowCount((prev) => prev + 5)}
                  className="px-8 py-3 rounded-lg border border-gray-700 text-gray-700 hover:bg-gray-700 hover:text-white transform transition duration-400 cursor-pointer"
                >
                  View more
                </button>
              </div>
            )}
          </section>
        )}

        {/* Send CV section */}
        <section
          dir="ltr"
          className="w-full bg-white py-11 mb-50 flex flex-col items-center justify-center gap-6"
        >
          <h1 className="text-4xl font-semibold">Drop your CV</h1>
          <p>
            Send us your CV and we’ll contact you when a suitable opportunity is
            available.
          </p>

          <button
            onClick={() => setShowModal(true)}
            className="px-8 py-3 w-[30%] bg-primary text-white rounded-lg transform transition duration-400 cursor-pointer hover:scale-105"
          >
            Apply Now
          </button>
        </section>

        {/* Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={modalVariants}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-white rounded-lg p-6 w-96">
                <h2 className="text-xl font-semibold mb-4">Apply for Job</h2>

                {/* Name */}
                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full border p-2 rounded mb-3"
                />

                {/* Specialty */}
                <input
                  type="text"
                  placeholder="Specialty"
                  value={formData.specialty}
                  onChange={(e) =>
                    setFormData({ ...formData, specialty: e.target.value })
                  }
                  className="w-full border p-2 rounded mb-3"
                />

                {/* CV File Upload */}
                <label className="block border-2 border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-primary transition mb-3">
                  <span className="text-gray-600">
                    {formData.file ? formData.file.name : "Choose CV File"}
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setFormData({ ...formData, file: e.target.files[0] });
                      }
                    }}
                  />
                </label>

                {/* Actions */}
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-gray-300 rounded cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleModalSubmit}
                    disabled={isSending}
                    className="px-4 py-2 bg-primary text-white rounded cursor-pointer"
                  >
                    {isSending ? "Sending..." : "Send Application"}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Footer />
    </>
  );
}

export default Career;
