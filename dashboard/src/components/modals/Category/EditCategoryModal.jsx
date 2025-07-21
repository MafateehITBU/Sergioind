import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import axiosInstance from '../../../axiosConfig';

const EditCategoryModal = ({ show, handleClose, selectedCategory, fetchData }) => {
    const [form, setForm] = useState({
        name: '',
        description: '',
    });
    const [image, setImage] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (selectedCategory) {
            setForm({
                name: selectedCategory.name || '',
                description: selectedCategory.description || ''
            });
            setImage(null);
            setErrors({});
        }
    }, [selectedCategory]);

    const validate = () => {
        const newErrors = {};
        if (!form.name.trim()) newErrors.name = 'Name is required';
        if (!form.description.trim()) newErrors.description = 'Description is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        const formData = new FormData();
        formData.append('name', form.name);
        formData.append('description', form.description);
        if (image) formData.append('image', image);

        try {
            setIsSubmitting(true);
            await axiosInstance.put(`/categories/${selectedCategory._id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success('Category updated successfully!');
            fetchData();
            handleClose();
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || 'Failed to update category');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Edit Category</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            name="name"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            isInvalid={!!errors.name}
                        />
                        <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="description"
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            isInvalid={!!errors.description}
                        />
                        <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>New Image (optional)</Form.Label>
                        <Form.Control
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImage(e.target.files[0])}
                        />
                    </Form.Group>

                    <Button
                        type="submit"
                        variant="primary"
                        className="w-100"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Updating...' : 'Update Category'}
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default EditCategoryModal;