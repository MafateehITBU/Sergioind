import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axiosInstance from "../../../axiosConfig";
import { toast } from "react-toastify";

const UpdateGalleryModal = ({ show, handleClose, fetchGalleries, gallery }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [deleteImages, setDeleteImages] = useState([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // On modal open, populate fields with gallery data
  useEffect(() => {
    if (gallery) {
      setTitle(gallery.title || "");
      setDescription(gallery.description || "");
      setExistingImages(gallery.images || []);
      setNewImages([]);
      setDeleteImages([]);
      setErrors({});
    }
  }, [gallery]);

  // Handle new images added
  const handleNewImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages((prev) => [...prev, ...files]);
  };

  // Remove existing image by public_id
  const handleRemoveExistingImage = (public_id) => {
    setExistingImages((prev) =>
      prev.filter((img) => img.public_id !== public_id)
    );
    setDeleteImages((prev) => [...prev, public_id]);
  };

  // Remove new image by index
  const handleRemoveNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setExistingImages([]);
    setNewImages([]);
    setDeleteImages([]);
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);

      newImages.forEach((img) => formData.append("images", img));

      // Send deleteImages array as multiple fields named deleteImages[]
      deleteImages.forEach((id) => formData.append("deleteImages[]", id));

      const response = await axiosInstance.put(
        `/gallery/${gallery._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(response.data.message, { position: "top-right" });
      resetForm();
      fetchGalleries();
      handleClose();
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors(error.response.data.errors || {});
      } else {
        toast.error("An unexpected error occurred.", { position: "top-right" });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Update Gallery</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="galleryTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter gallery title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              isInvalid={!!errors.title}
            />
            <Form.Control.Feedback type="invalid">
              {errors.title}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="galleryDescription" className="mt-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter gallery description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              isInvalid={!!errors.description}
            />
            <Form.Control.Feedback type="invalid">
              {errors.description}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Existing images preview with remove */}
          {existingImages.length > 0 && (
            <>
              <Form.Label className="mt-3">Existing Images</Form.Label>
              <div className="d-flex flex-wrap gap-2 mt-2">
                {existingImages.map(({ public_id, url }) => (
                  <div
                    key={public_id}
                    style={{
                      position: "relative",
                      width: 80,
                      height: 80,
                      borderRadius: 8,
                      overflow: "hidden",
                      border: "1px solid #ccc",
                    }}
                  >
                    <img
                      src={url}
                      alt="existing-img"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveExistingImage(public_id)}
                      style={{
                        position: "absolute",
                        top: 2,
                        right: 2,
                        background: "rgba(0,0,0,0.6)",
                        color: "white",
                        border: "none",
                        borderRadius: "50%",
                        width: 20,
                        height: 20,
                        cursor: "pointer",
                        lineHeight: "18px",
                        fontWeight: "bold",
                      }}
                      aria-label="Remove image"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* New images input */}
          <Form.Group controlId="galleryNewImages" className="mt-3">
            <Form.Label>Add New Images</Form.Label>
            <Form.Control
              type="file"
              multiple
              accept="image/*"
              onChange={handleNewImageChange}
              isInvalid={!!errors.images}
            />
            <Form.Control.Feedback type="invalid">
              {errors.images}
            </Form.Control.Feedback>
          </Form.Group>

          {/* New images preview with remove */}
          {newImages.length > 0 && (
            <div className="d-flex flex-wrap gap-2 mt-2">
              {newImages.map((img, index) => {
                const url = URL.createObjectURL(img);
                return (
                  <div
                    key={index}
                    style={{
                      position: "relative",
                      width: 80,
                      height: 80,
                      borderRadius: 8,
                      overflow: "hidden",
                      border: "1px solid #ccc",
                    }}
                  >
                    <img
                      src={url}
                      alt={`new-img-${index}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      onLoad={() => URL.revokeObjectURL(url)}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveNewImage(index)}
                      style={{
                        position: "absolute",
                        top: 2,
                        right: 2,
                        background: "rgba(0,0,0,0.6)",
                        color: "white",
                        border: "none",
                        borderRadius: "50%",
                        width: 20,
                        height: 20,
                        cursor: "pointer",
                        lineHeight: "18px",
                        fontWeight: "bold",
                      }}
                      aria-label="Remove image"
                    >
                      &times;
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Submit button aligned bottom right */}
          <div className="mt-4 d-flex justify-content-end">
            <Button variant="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Gallery"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default UpdateGalleryModal;
