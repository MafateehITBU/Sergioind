import axiosInstance from "../axiosConfig";
import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import HeroBadge from "../components/HeroBadge";
import PostCard from "../components/PostCard";
import Bg from "../assets/imgs/careers-bg.png";
import { Icon } from "@iconify/react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Career() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showCount, setShowCount] = useState(5);

  // Filters state
  const [search, setSearch] = useState("");
  const [experience, setExperience] = useState("All");
  const [location, setLocation] = useState("All");
  const [employmentType, setEmploymentType] = useState("All");

  const navigate = useNavigate();

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

  return (
    <>
      <Header />
      <HeroBadge bgImage={Bg} badgeText="Careers" />

      {/* Main Content */}
      <section className="py-30 min-h-screen bg-gray-50">
        {/* Search and filters */}
        <div className="max-w-7xl mx-auto px-6 py-16 bg-white border-white rounded-2xl flex flex-col gap-6">
          {/* Search bar */}
          <div className="flex items-center justify-center w-full">
            <input
              type="text"
              placeholder="Search for jobs.."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-[50%] px-8 py-3  rounded-l-lg bg-[#e6e5e5] focus:outline-none"
            />
            <button
              onClick={handleFilter}
              className="px-6 py-3 bg-[#e6e5e5] text-text text-2xl rounded-r-lg"
            >
              <Icon
                icon="material-symbols:search"
                className="cursor-pointer "
              />
            </button>
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
              <label className="block text-sm font-medium mb-1">Location</label>
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

            {/* View Jobs Button */}
            <button
              onClick={handleFilter}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:scale-105 transform  transition duration-400 self-end"
            >
              View Jobs
            </button>
          </div>
        </div>

        {/* Posts Layout */}
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
                    <div className="font-semibold mb-1">Employment Type:</div>
                    {selectedPost.employmentType}
                  </li>
                  <li>
                    <div className="font-semibold mb-1">Work place Type:</div>
                    {selectedPost.location}
                  </li>
                  <li>
                    <div className="font-semibold mb-1">
                      Experience Required:
                    </div>
                    {selectedPost.experienceYears} Years
                  </li>
                  <li>
                    <div className="font-semibold mb-1">Job Location:</div>{" "}
                    Jordan, Amman
                  </li>
                </ul>

                {/* Apply Button */}
                <button
                  className="px-6 py-3 w-full bg-primary text-white rounded-lg hover:scale-105 transition transform duration-400 cursor-pointer"
                  onClick={() => navigate("/apply", { state: { post: selectedPost } })}
                >
                  Apply Now
                </button>
              </>
            ) : (
              <p className="text-gray-600">Select a job to view details.</p>
            )}
          </div>
        </div>

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
      <Footer />
    </>
  );
}

export default Career;
