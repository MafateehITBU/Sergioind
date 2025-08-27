import React from "react";

function PostCard({ post, isActive, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer p-8 mb-3 rounded-lg border ${
        isActive ? "border-[#59cb00] bg-white" : "border-gray-200 bg-white"
      }`}
    >
      {/* Title */}
      <h3 className={`text-lg font-semibold ${isActive? "text-primary" : "text-gray-800"} `}>{post.title}</h3>

      {/* Tags */}
      <div className="flex gap-9 my-4 text-sm">
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
      <p className="text-sm text-gray-600 mt-2 line-clamp-2">
        {post.description}
      </p>
    </div>
  );
}

export default PostCard;
