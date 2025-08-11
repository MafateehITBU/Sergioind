import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axiosInstance from "../../../axiosConfig";
import { toast } from "react-toastify";

const CreateVideoGalleryModal = ({ show, handleClose, fetchVideos }) => {
  const [title, setTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const resetForm = () => {
    setTitle("");
    setVideoUrl("");
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await axiosInstance.post("/video-gallery", {
        title,
        videoUrl,
      });
      toast.success(response.data.message, { position: "top-right" });
      resetForm();
      fetchVideos();
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
        <Modal.Title>Create Video</Modal.Title>
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

          <Form.Group controlId="galleryvideoUrl" className="mt-3">
            <Form.Label>Youtube Video Url</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter video Url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              isInvalid={!!errors.videoUrl}
            />
            <Form.Control.Feedback type="invalid">
              {errors.videoUrl}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Create Video button aligned bottom right */}
          <div className="mt-4 d-flex justify-content-end">
            <Button variant="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Video"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateVideoGalleryModal;
