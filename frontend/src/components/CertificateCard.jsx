import React from "react";
import { Icon } from "@iconify/react";
import axiosInstance from "../axiosConfig";
import { toast } from "react-toastify";

const CertificateCard = ({ certificate }) => {
  const handleDownload = async () => {
    try {
      // increment download count in backend
      await axiosInstance.get(`/filecenter/${certificate.id}/download`);

      // fetch the file directly from Cloudinary
      const response = await fetch(certificate.file.url);
      const blob = await response.blob();

      // create a temporary download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", certificate.file.originalName || "file");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // cleanup
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error(error.message || "Something went wrong", {
        position: "top-right",
      });
    }
  };

  const handleView = async () => {
    try {
      await axiosInstance.get(`/filecenter/${certificate.id}/view`);

      // Open the file URL in a new tab
      window.open(certificate.file.url, "_blank");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong", {
        position: "top-right",
      });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col">
      {/* Image */}
      <img
        src={certificate.image?.url}
        alt={certificate.name}
        className="w-full h-48 object-cover"
      />

      {/* Description */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <p className="text-gray-700 text-sm mb-5 flex-1">
          {certificate.description}
        </p>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-2">
          {/* Download Icon */}
          <button
            onClick={handleDownload}
            className="text-gray-500 hover:text-gray-700 transition cursor-pointer"
            title="Download"
          >
            <Icon icon="mdi-light:download" width={22} height={22} />
          </button>

          {/* View Icon */}
          <button
            onClick={handleView}
            className="text-gray-500 hover:text-gray-700 transition cursor-pointer"
            title="View"
          >
            <Icon icon="mdi:print-preview" width={22} height={22} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CertificateCard;
