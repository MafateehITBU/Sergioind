import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axiosInstance from "../../../axiosConfig";
import { toast } from "react-toastify";

function getYouTubeId(url) {
  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.hostname.includes("youtu.be")) {
      return parsedUrl.pathname.slice(1).split("?")[0];
    }
    if (parsedUrl.hostname.includes("youtube.com")) {
      if (parsedUrl.searchParams.has("v")) {
        return parsedUrl.searchParams.get("v");
      }
      if (parsedUrl.pathname.startsWith("/embed/")) {
        return parsedUrl.pathname.split("/embed/")[1].split("?")[0];
      }
    }
  } catch {
    return null;
  }
  return null;
}

const UpdateVideoGallery = ({
  show,
  handleClose,
  video,
  fetchVideos,
}) => {
  const [title, setTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Initialize form when modal opens or video changes
  useEffect(() => {
    if (show && video) {
      setTitle(video.title || "");
      setVideoUrl(video.videoUrl || "");
      setErrors({});
    }
  }, [show, video]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await axiosInstance.put(
        `/video-gallery/${video._id}`,
        {
          title,
          videoUrl,
        }
      );
      toast.success(response.data.message, { position: "top-right" });
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

  const videoId = getYouTubeId(videoUrl);

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Update Video</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="videoTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter video title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              isInvalid={!!errors.title}
            />
            <Form.Control.Feedback type="invalid">
              {errors.title}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="videoUrl" className="mt-3">
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

          {/* Video preview iframe */}
          {videoId && (
            <div className="mt-4 d-flex justify-content-center">
              <iframe
                width="560"
                height="315"
                src={`https://www.youtube.com/embed/${videoId}`}
                title="Video Preview"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          )}

          <div className="mt-4 d-flex justify-content-end">
            <Button
              variant="secondary"
              onClick={handleClose}
              disabled={isSubmitting}
              className="me-2"
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Video"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default UpdateVideoGallery;