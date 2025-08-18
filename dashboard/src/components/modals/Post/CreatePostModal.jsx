import React, { useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";
import axiosInstance from "../../../axiosConfig";

const CreatePostModal = ({ show, handleClose, fetchPosts }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    employmentType: "",
    location: "",
    experienceYears: "",
    speciality: "",
    endDate: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};

    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!form.description.trim())
      newErrors.description = "Description is required";
    if (!form.employmentType.trim())
      newErrors.employmentType = "Employment type is required";
    if (!form.location.trim()) newErrors.location = "Location is required";

    const expYears = Number(form.experienceYears);
    if (isNaN(expYears) || expYears < 0) {
      newErrors.experienceYears =
        "Experience years must be a non-negative number";
    }

    if (!form.speciality.trim())
      newErrors.speciality = "Speciality is required";

    if (!form.endDate) {
      newErrors.endDate = "End date is required";
    } else {
      const today = new Date();
      const endDate = new Date(form.endDate);
      if (endDate <= today) {
        newErrors.endDate = "End date must be after today";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsSubmitting(true);
      await axiosInstance.post("/post", form);
      toast.success("Post created successfully!");
      fetchPosts();
      handleClose();
      // Reset form
      setForm({
        title: "",
        description: "",
        employmentType: "",
        location: "",
        experienceYears: "",
        speciality: "",
        endDate: "",
      });
      setErrors({});
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to create post");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Create New Post</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              name="title"
              value={form.title}
              onChange={handleChange}
              isInvalid={!!errors.title}
            />
            <Form.Control.Feedback type="invalid">
              {errors.title}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              name="description"
              as="textarea"
              rows={3}
              value={form.description}
              onChange={handleChange}
              isInvalid={!!errors.description}
            />
            <Form.Control.Feedback type="invalid">
              {errors.description}
            </Form.Control.Feedback>
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Employment Type</Form.Label>
                <Form.Select
                  name="employmentType"
                  value={form.employmentType}
                  onChange={handleChange}
                  isInvalid={!!errors.employmentType}
                >
                  <option value="">Select Employment Type</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.employmentType}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Job Location</Form.Label>
                <Form.Select
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  isInvalid={!!errors.location}
                >
                  <option value="">Select Location</option>
                  <option value="On-site">On-site</option>
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.location}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Experience Years</Form.Label>
                <Form.Control
                  name="experienceYears"
                  type="number"
                  value={form.experienceYears}
                  onChange={handleChange}
                  isInvalid={!!errors.experienceYears}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.experienceYears}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Speciality</Form.Label>
                <Form.Control
                  name="speciality"
                  value={form.speciality}
                  onChange={handleChange}
                  isInvalid={!!errors.speciality}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.speciality}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>End Date</Form.Label>
            <Form.Control
              name="endDate"
              type="date"
              value={form.endDate}
              onChange={handleChange}
              isInvalid={!!errors.endDate}
            />
            <Form.Control.Feedback type="invalid">
              {errors.endDate}
            </Form.Control.Feedback>
          </Form.Group>

          <Button
            type="submit"
            variant="success"
            className="w-100"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating Post..." : "Create Post"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreatePostModal;