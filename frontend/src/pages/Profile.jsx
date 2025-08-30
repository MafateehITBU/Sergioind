import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Icon } from "@iconify/react";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
import axiosInstance from "../axiosConfig";
import { useAuth } from "../context/AuthContext";
import { toast, ToastContainer } from "react-toastify";

// Normalize backend response
const normalizeUser = (data) => ({
  id: data._id,
  name: data.name,
  email: data.email,
  phoneNumber: data.phoneNumber,
  image: data.image?.url || null,
  isActive: data.isActive,
});

const Profile = () => {
  const { t } = useTranslation("profile");
  const { user, loading, updateUser } = useAuth();

  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showPhotoPreview, setShowPhotoPreview] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
  });

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    showCurrent: false,
    showNew: false,
  });

  const [photo, setPhoto] = useState(user?.image || null);
  const [newPhotoFile, setNewPhotoFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9, y: -30 },
    visible: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.9, y: -30 },
  };

  // Save Info
  const handleSaveInfo = async () => {
    try {
      setIsSubmitting(true);
      const res = await axiosInstance.put(`/user/${user?.id}`, formData);

      if (res.data.success) {
        const updatedUser = normalizeUser(res.data.data);
        updateUser(updatedUser);

        setFormData({
          name: updatedUser.name,
          email: updatedUser.email,
          phoneNumber: updatedUser.phoneNumber,
        });

        toast.success(res.data.message || "Info updated successfully!");
        setShowInfoModal(false);
      } else {
        toast.error(res.data.message || "Failed to update info");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update info");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Save Password
  const handleSavePassword = async () => {
    try {
      setIsSubmitting(true);
      const res = await axiosInstance.put("/user/change-password", {
        email: user?.email,
        currentPassword: passwords.current,
        newPassword: passwords.new,
      });

      toast.success(res.data.message || "Password updated successfully!");
      setShowPasswordModal(false);
      setPasswords({
        current: "",
        new: "",
        showCurrent: false,
        showNew: false,
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update password");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Save Photo
  const handleSavePhoto = async () => {
    if (!newPhotoFile) return;

    const fd = new FormData();
    fd.append("image", newPhotoFile);

    try {
      setIsSubmitting(true);
      const res = await axiosInstance.put(`/user/${user?.id}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const updatedUser = normalizeUser(res.data.data);
      updateUser(updatedUser);
      setPhoto(updatedUser.image);
      setNewPhotoFile(null);

      toast.success(res.data.message || "Photo updated successfully!");
      setShowPhotoModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to upload photo");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Icon icon="line-md:loading-loop" className="text-4xl text-gray-500" />
      </div>
    );
  }

  return (
    <>
      <Header />
      <ToastContainer />

      <section className="container mx-auto px-6 py-40 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Info & Password */}
        <div className="lg:col-span-2 space-y-8">
          {/* Private Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xlg font-itim">
                {t("private_info") || "Private Information"}
              </h2>
              <button
                onClick={() => setShowInfoModal(true)}
                className="flex items-center bg-primary hover:scale-105 transition text-white px-3 py-1 rounded-md text-sm cursor-pointer"
              >
                <Icon icon="mdi:pencil" className="mr-1" />
                {t("edit") || "Edit"}
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center border-b pb-2">
                <Icon icon="mdi:account" className="text-gray-500 mr-2" />
                <span>{user?.name}</span>
              </div>
              <div className="flex items-center border-b pb-2">
                <Icon icon="mdi:email" className="text-gray-500 mr-2" />
                <span>{user?.email}</span>
              </div>
              <div className="flex items-center border-b pb-2">
                <Icon icon="mdi:phone" className="text-gray-500 mr-2" />
                <span>{user?.phoneNumber || "Not Set"}</span>
              </div>
            </div>
          </div>

          {/* Change Password */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xlg font-itim">
                {t("change_password") || "Change Password"}
              </h2>
              <button
                onClick={() => setShowPasswordModal(true)}
                className="flex items-center bg-primary hover:scale-105 transition text-white px-3 py-1 rounded-md text-sm cursor-pointer"
              >
                <Icon icon="mdi:pencil" className="mr-1" />
                {t("edit") || "Edit"}
              </button>
            </div>
            <div className="flex items-center border-b pb-2">
              <Icon icon="mdi:lock" className="text-gray-500 mr-2" />
              <span>****************</span>
            </div>
          </div>
        </div>

        {/* Profile Photo */}
        <div className="flex flex-col items-center bg-white rounded-lg shadow p-6">
          <div
            onClick={() => setShowPhotoPreview(true)}
            className="w-full h-64 bg-gray-200 flex items-center justify-center cursor-pointer"
          >
            {photo ? (
              <img
                src={photo}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <Icon icon="mdi:account" className="text-gray-500 text-7xl" />
            )}
          </div>
          <button
            onClick={() => setShowPhotoModal(true)}
            className="mt-4 flex items-center font-itim text-[20px] text-gray-600 hover:text-primary cursor-pointer"
          >
            <Icon icon="mdi:camera" className="mr-1" />
            {t("edit_photo") || "Edit photo"}
          </button>
        </div>
      </section>

      {/* Info Modal */}
      <AnimatePresence>
        {showInfoModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalVariants}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-white rounded-lg p-6 w-96">
              <h2 className="text-xl mb-4">
                {t("edit_info") || "Edit Information"}
              </h2>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full border p-2 rounded mb-3"
              />
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full border p-2 rounded mb-3"
              />
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumber: e.target.value })
                }
                className="w-full border p-2 rounded mb-3"
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowInfoModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveInfo}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-primary text-white rounded cursor-pointer"
                >
                  {isSubmitting ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Password Modal */}
      <AnimatePresence>
        {showPasswordModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalVariants}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-white rounded-lg p-6 w-96">
              <h2 className="text-xl mb-4">
                {t("change_password") || "Change Password"}
              </h2>
              <div className="mb-3 relative">
                <input
                  type={passwords.showCurrent ? "text" : "password"}
                  value={passwords.current}
                  onChange={(e) =>
                    setPasswords({ ...passwords, current: e.target.value })
                  }
                  placeholder="Current Password"
                  className="w-full border p-2 rounded"
                />
                <Icon
                  onClick={() =>
                    setPasswords({
                      ...passwords,
                      showCurrent: !passwords.showCurrent,
                    })
                  }
                  icon={passwords.showCurrent ? "mdi:eye-off" : "mdi:eye"}
                  className="absolute right-3 top-3 cursor-pointer text-gray-500"
                />
              </div>
              <div className="mb-3 relative">
                <input
                  type={passwords.showNew ? "text" : "password"}
                  value={passwords.new}
                  onChange={(e) =>
                    setPasswords({ ...passwords, new: e.target.value })
                  }
                  placeholder="New Password"
                  className="w-full border p-2 rounded"
                />
                <Icon
                  onClick={() =>
                    setPasswords({ ...passwords, showNew: !passwords.showNew })
                  }
                  icon={passwords.showNew ? "mdi:eye-off" : "mdi:eye"}
                  className="absolute right-3 top-3 cursor-pointer text-gray-500"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePassword}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-primary text-white rounded cursor-pointer"
                >
                  {isSubmitting ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Photo Upload Modal */}
      <AnimatePresence>
        {showPhotoModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalVariants}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-white rounded-lg p-6 w-96">
              <h2 className="text-xl mb-4">
                {t("edit_photo") || "Edit Photo"}
              </h2>

              {/* Custom File Upload Box */}
              <label className="block border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-primary transition">
                <span className="text-gray-600">
                  {newPhotoFile ? "Photo Selected" : "Choose Photo"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setNewPhotoFile(e.target.files[0]);
                    }
                  }}
                />
              </label>

              {/* Preview */}
              {newPhotoFile && (
                <div className="mt-4">
                  <img
                    src={URL.createObjectURL(newPhotoFile)}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded"
                  />
                </div>
              )}

              {/* Buttons */}
              <div className="flex justify-end mt-4 space-x-2">
                <button
                  onClick={() => {
                    setNewPhotoFile(null);
                    setShowPhotoModal(false);
                  }}
                  className="px-4 py-2 bg-gray-300 rounded cursor-pointer"
                >
                  Cancel
                </button>
                {newPhotoFile && (
                  <button
                    onClick={handleSavePhoto}
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-primary text-white rounded cursor-pointer"
                  >
                    {isSubmitting ? "Saving..." : "Save"}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fullscreen Photo Preview */}
      <AnimatePresence>
        {showPhotoPreview && (
          <motion.div
            className="fixed inset-0 bg-black flex items-center justify-center z-50 cursor-pointer"
            onClick={() => setShowPhotoPreview(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <img
              src={photo}
              alt="Profile Preview"
              className="max-h-[90%] max-w-[90%] object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
};

export default Profile;
