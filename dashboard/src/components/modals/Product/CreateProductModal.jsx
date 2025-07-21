import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import axiosInstance from '../../../axiosConfig';
import { toast } from 'react-toastify';

const CreateProductModal = ({ show, handleClose, fetchProducts }) => {
    const [name, setName] = useState('');
    const [sku, setSku] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [stock, setStock] = useState('');
    const [image, setImage] = useState(null);

    const [flavors, setFlavors] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [categories, setCategories] = useState([]);

    const [selectedFlavors, setSelectedFlavors] = useState([]);
    const [selectedSizes, setSelectedSizes] = useState([]);

    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!show) return;

        const fetchOptions = async () => {
            try {
                const [flavorRes, sizeRes, categoryRes] = await Promise.all([
                    axiosInstance.get('/flavors'),
                    axiosInstance.get('/sizes'),
                    axiosInstance.get('/categories'),
                ]);
                setFlavors(flavorRes.data.data || []);
                setSizes(sizeRes.data.data || []);
                setCategories(categoryRes.data.data || []);
            } catch {
                toast.error('Failed to load options');
            }
        };

        fetchOptions();
    }, [show]);

    const resetForm = () => {
        setName('');
        setSku('');
        setDescription('');
        setPrice('');
        setCategory('');
        setStock('');
        setImage(null);
        setSelectedFlavors([]);
        setSelectedSizes([]);
    };

    const toggleFlavor = (id) => {
        setSelectedFlavors((prev) =>
            prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
        );
    };

    const toggleSize = (id) => {
        setSelectedSizes((prev) =>
            prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !sku || !description || !price || !category) {
            toast.error('Please fill all required fields');
            return;
        }

        setIsSubmitting(true);

        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('sku', sku);
            formData.append('description', description);
            formData.append('price', price);
            formData.append('category', category);
            formData.append('stock', stock);
            selectedFlavors.forEach((flavor) => formData.append('flavors', flavor));
            selectedSizes.forEach((size) => formData.append('sizes', size));

            if (image) {
                formData.append('image', image);
            }

            await axiosInstance.post('/products', formData);

            toast.success('Product created successfully');
            fetchProducts?.();
            resetForm();
            handleClose();
        } catch (err) {
            if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
                err.response.data.errors.forEach((error) => {
                    toast.error(`${error.field}: ${error.message}`);
                });
            } else {
                toast.error(err.response?.data?.message || 'Failed to create product');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal show={show} onHide={() => { resetForm(); handleClose(); }} centered size="md">
            <Modal.Header closeButton>
                <Modal.Title>Add New Product</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3" controlId="productName">
                                <Form.Label>Name *</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group className="mb-3" controlId="productSku">
                                <Form.Label>SKU *</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={sku}
                                    onChange={(e) => setSku(e.target.value)}
                                    required
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group className="mb-3" controlId="productDescription">
                        <Form.Label>Description *</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={2}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Row>
                        <Col md={4}>
                            <Form.Group className="mb-3" controlId="productPrice">
                                <Form.Label>Price *</Form.Label>
                                <Form.Control
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    required
                                />
                            </Form.Group>
                        </Col>

                        <Col md={4}>
                            <Form.Group className="mb-3" controlId="productCategory">
                                <Form.Label>Category *</Form.Label>
                                <Form.Select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((c) => (
                                        <option key={c._id} value={c._id}>
                                            {c.name}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>

                        <Col md={4}>
                            <Form.Group className="mb-3" controlId="productStock">
                                <Form.Label>Stock</Form.Label>
                                <Form.Control
                                    type="number"
                                    min="0"
                                    value={stock}
                                    onChange={(e) => setStock(e.target.value)}
                                    placeholder="0"
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group className="mb-3" controlId="productImage">
                        <Form.Label>Image</Form.Label>
                        <Form.Control
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImage(e.target.files[0])}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="productFlavors">
                        <Form.Label>Flavors</Form.Label>
                        <div className="d-flex flex-wrap gap-2">
                            {flavors.map((flavor) => (
                                <Form.Check key={flavor._id} type="checkbox" id={`flavor-${flavor._id}`}>
                                    <Form.Check.Input
                                        type="checkbox"
                                        checked={selectedFlavors.includes(flavor._id)}
                                        onChange={() => toggleFlavor(flavor._id)}
                                        style={{ marginRight: '10px', marginTop: "5px" }}
                                    />
                                    <Form.Check.Label>{flavor.name}</Form.Check.Label>
                                </Form.Check>
                            ))}
                        </div>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="productSizes">
                        <Form.Label>Sizes</Form.Label>
                        <div className="d-flex flex-wrap gap-2">
                            {sizes.map((size) => (
                                <Form.Check key={size._id} type="checkbox" id={`size-${size._id}`}>
                                    <Form.Check.Input
                                        type="checkbox"
                                        checked={selectedSizes.includes(size._id)}
                                        onChange={() => toggleSize(size._id)}
                                        style={{ marginRight: '10px', marginTop: "5px" }}
                                    />
                                    <Form.Check.Label>{size.name}</Form.Check.Label>
                                </Form.Check>
                            ))}
                        </div>
                    </Form.Group>

                    <div className="text-center">
                        <Button type="submit" disabled={isSubmitting} style={{ width: '160px' }}>
                            {isSubmitting ? 'Creating...' : 'Create Product'}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default CreateProductModal;