import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axiosInstance from "../../../axiosConfig";
import { toast } from "react-toastify";

const allPermissions = [
  "Users",
  "Categories",
  "Files",
  "Products",
  "Quotations",
  "Contact-us",
  "Gallery",
  "VideoGallery",
  "Posts",
  "Cvs",
];

const UpdateAdminModal = ({ show, handleClose, admin, fetchAdmins }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [image, setImage] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (admin) {
      setName(admin.name || "");
      setEmail(admin.email || "");
      setPhoneNumber(admin.phoneNumber || "");
      setImage(null); // Don't prefill image input
      setPermissions(admin.permissions || []);
    }
  }, [admin]);

  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) newErrors.name = "Name is required";

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email format";
    }

    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^07[7-9]\d{7}$/.test(phoneNumber)) {
      newErrors.phoneNumber =
        "Phone must start with 07 followed by 7, 8, or 9 and 7 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePermissionChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setPermissions((prev) => [...prev, value]);
    } else {
      setPermissions((prev) => prev.filter((perm) => perm !== value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("phoneNumber", phoneNumber);
      formData.append("permissions", JSON.stringify(permissions)); // send as stringified array
      if (image) formData.append("image", image);

      await axiosInstance.put(`/admin/${admin._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Admin updated successfully");
      fetchAdmins();
      handleClose();
    } catch (error) {
      console.error("Error updating admin:", error);
      toast.error(error.response?.data?.message || "Failed to update admin");
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title className="h5">Update Admin</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit} className="d-flex flex-column">
          <Form.Group controlId="name" className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              isInvalid={!!errors.name}
              placeholder="Enter admin name"
            />
            <Form.Control.Feedback type="invalid">
              {errors.name}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="email" className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              isInvalid={!!errors.email}
              placeholder="Enter email"
            />
            <Form.Control.Feedback type="invalid">
              {errors.email}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="phoneNumber" className="mb-3">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              isInvalid={!!errors.phoneNumber}
              placeholder="Enter phone number"
            />
            <Form.Control.Feedback type="invalid">
              {errors.phoneNumber}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="image" className="mb-3">
            <Form.Label>Profile Image</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </Form.Group>

          <Form.Group controlId="permissions" className="mb-3">
            <Form.Label>Permissions</Form.Label>
            <div className="container-fluid">
              <div className="row">
                {allPermissions.map((perm, index) => (
                  <div key={perm} className="col-md-4 mb-2">
                    {" "}
                    {/* 3 per row */}
                    <Form.Check className="d-flex align-items-start">
                      <Form.Check.Input
                        type="checkbox"
                        value={perm}
                        checked={permissions.includes(perm)}
                        onChange={handlePermissionChange}
                        className="mt-1"
                      />
                      <Form.Check.Label>{perm}</Form.Check.Label>
                    </Form.Check>
                  </div>
                ))}
              </div>
            </div>
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            className="align-self-center mt-3"
            style={{ width: "160px" }}
          >
            Update Admin
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default UpdateAdminModal;
