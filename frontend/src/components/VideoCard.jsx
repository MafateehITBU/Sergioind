import { useState } from "react";

const getYouTubeId = (url) => {
  try {
    const regExp =
      /^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|watch\?.+&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[1].length === 11 ? match[1] : null;
  } catch {
    return null;
  }
};

const VideoCard = ({ videoUrl, title }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Extract ID from url
  const videoId = getYouTubeId(videoUrl);

  if (!videoId) return null; // skip invalid videos

  const thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  return (
    <>
      {/* Card */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Thumbnail */}
        <div
          className="relative cursor-pointer"
          onClick={() => setIsOpen(true)}
        >
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-56 object-cover"
          />
          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-red-600 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg">
              ▶
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="p-4 text-center">
          <h3 className="text-lg font-medium text-gray-800">{title}</h3>
        </div>
      </div>

      {/* Modal for playing video */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-black rounded-lg overflow-hidden w-[90%] md:w-[70%] lg:w-[50%] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              width="100%"
              height="400"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
              title={title}
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </>
  );
};

export default VideoCard;
