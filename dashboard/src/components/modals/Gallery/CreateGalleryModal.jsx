import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axiosInstance from "../../../axiosConfig";
import { toast } from "react-toastify";

const CreateGalleryModal = ({ show, handleClose, fetchGalleries }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]); // array of File objects

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setImages([]);
    setErrors({});
  };

  // Add new selected images
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
  };

  // Remove image by index
  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    images.forEach((image) => {
      formData.append("images", image);
    });

    try {
      const response = await axiosInstance.post("/gallery", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
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
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Create Gallery</Modal.Title>
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

          <Form.Group controlId="galleryImages" className="mt-3">
            <Form.Label>Images</Form.Label>
            <Form.Control
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              isInvalid={!!errors.images}
            />
            <Form.Control.Feedback type="invalid">
              {errors.images}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Preview thumbnails */}
          {images.length > 0 && (
            <div className="d-flex flex-wrap gap-2 mt-2">
              {images.map((img, index) => {
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
                      alt={`preview-${index}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      onLoad={() => URL.revokeObjectURL(url)} // free memory
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
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

          {/* Create Gallery button aligned bottom right */}
          <div className="mt-4 d-flex justify-content-end">
            <Button variant="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Gallery"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateGalleryModal;