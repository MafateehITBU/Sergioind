import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import axiosInstance from "../../../axiosConfig";
import { toast } from 'react-toastify';

const AddAdminModal = ({ show, handleClose, fetchAdmins }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [image, setImage] = useState(null);
    const [permissions, setPermissions] = useState([]);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const allPermissions = ['Users', 'Categories', 'Files', 'Products', 'Quotations', 'Contact-us', 'Gallery', 'VideoGallery'];

    const validateForm = () => {
        const newErrors = {};
        if (!name.trim()) newErrors.name = 'Name is required';
        if (!email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = 'Invalid email format';
        }
        if (!password || password.length < 6)
            newErrors.password = 'Password must be at least 6 characters';
        if (!phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^07[7-9]\d{7}$/.test(phone)) {
            newErrors.phone = 'Phone must start with 07 followed by 7, 8, or 9 and 7 digits';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const resetForm = () => {
        setName('');
        setEmail('');
        setPassword('');
        setPhone('');
        setImage(null);
        setPermissions([]);
        setErrors({});
    };

    const handlePermissionChange = (perm) => {
        setPermissions(prev =>
            prev.includes(perm)
                ? prev.filter(p => p !== perm)
                : [...prev, perm]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('password', password);
            formData.append('phoneNumber', phone);
            if (image) formData.append('image', image);
            permissions.forEach(p => formData.append('permissions[]', p));

            await axiosInstance.post('/admin/register', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            toast.success('Admin added successfully');
            fetchAdmins?.();
            resetForm();
            handleClose();
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || 'Failed to add admin');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title className="h5">Add New Admin</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    isInvalid={!!errors.name}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.name}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    isInvalid={!!errors.email}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.email}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    isInvalid={!!errors.password}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.password}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Phone</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={phone}
                                    onChange={e => setPhone(e.target.value)}
                                    isInvalid={!!errors.phone}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.phone}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group className="mb-3">
                        <Form.Label>Image (optional)</Form.Label>
                        <Form.Control
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImage(e.target.files[0])}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Permissions</Form.Label>
                        <div className="d-flex flex-wrap">
                            {allPermissions.map((perm) => (
                                <Form.Check
                                    key={perm}
                                    type="checkbox"
                                    id={perm}
                                    label={perm}
                                    checked={permissions.includes(perm)}
                                    onChange={() => handlePermissionChange(perm)}
                                    className="d-flex align-items-start me-3"
                                >
                                    <Form.Check.Input
                                        type="checkbox"
                                        style={{ marginTop: '5px', marginRight: '-5px' }}
                                    />
                                    <Form.Check.Label>{perm}</Form.Check.Label>
                                </Form.Check>
                            ))}
                        </div>
                    </Form.Group>

                    <div className="text-center">
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={isSubmitting}
                            style={{ width: "160px" }}
                        >
                            {isSubmitting ? 'Adding Admin...' : 'Add Admin'}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default AddAdminModal;