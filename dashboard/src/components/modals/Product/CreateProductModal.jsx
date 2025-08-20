import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import axiosInstance from "../../../axiosConfig";
import { toast } from "react-toastify";

const CreateProductModal = ({ show, handleClose, fetchProducts }) => {
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");
  const [images, setImages] = useState([]);
  const [flavors, setFlavors] = useState([]);
  const [categories, setCategories] = useState([]);

  const [selectedFlavors, setSelectedFlavors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([
    { name: "", weight: { value: "", unit: "g" } },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!show) return;

    const fetchOptions = async () => {
      try {
        const [flavorRes, categoryRes] = await Promise.all([
          axiosInstance.get("/flavors"),
          axiosInstance.get("/categories"),
        ]);
        setFlavors(flavorRes.data.data || []);
        setCategories(categoryRes.data.data || []);
      } catch {
        toast.error("Failed to load options");
      }
    };

    fetchOptions();
  }, [show]);

  const resetForm = () => {
    setName("");
    setSku("");
    setDescription("");
    setCategory("");
    setStock("");
    setImages([]);
    setSelectedFlavors([]);
    setSelectedSizes([{ name: "", weight: { value: "", unit: "g" } }]);
  };

  const toggleFlavor = (id) => {
    setSelectedFlavors((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
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

    if (!name || !sku || !description  || !category) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("sku", sku);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("stock", stock);

      selectedFlavors.forEach((flavor) => formData.append("flavors", flavor));

      if (selectedSizes.length > 0) {
        formData.append("sizes", JSON.stringify(selectedSizes));
      }

      if (images.length > 0) {
        images.forEach((file) => {
          formData.append("images", file);
        });
      }

      await axiosInstance.post("/products", formData);

      toast.success("Product created successfully");
      fetchProducts?.();
      resetForm();
      handleClose();
    } catch (err) {
      if (
        err.response?.data?.errors &&
        Array.isArray(err.response.data.errors)
      ) {
        err.response.data.errors.forEach((error) => {
          toast.error(`${error.field}: ${error.message}`);
        });
      } else {
        toast.error(err.response?.data?.message || "Failed to create product");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={() => {
        resetForm();
        handleClose();
      }}
      centered
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>Add New Product</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {/* Basic Info */}
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

          {/* Category / Stock */}
          <Row>

            <Col md={6}>
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

            <Col md={6}>
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

          {/* Images with Preview & Remove */}
          <Form.Group className="mb-3" controlId="productImages">
            <Form.Label>Images</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
            />
          </Form.Group>
          {images.length > 0 && (
            <div className="d-flex flex-wrap gap-2 mt-2">
              {images.map((img, idx) => {
                const url = URL.createObjectURL(img);
                return (
                  <div
                    key={idx}
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
                      alt={`preview-${idx}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      onLoad={() => URL.revokeObjectURL(url)}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
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

          {/* Flavors */}
          <Form.Group className="mb-3" controlId="productFlavors">
            <Form.Label>Flavors</Form.Label>
            <div className="d-flex flex-wrap gap-2">
              {flavors.map((flavor) => (
                <Form.Check
                  key={flavor._id}
                  type="checkbox"
                  id={`flavor-${flavor._id}`}
                >
                  <Form.Check.Input
                    type="checkbox"
                    checked={selectedFlavors.includes(flavor._id)}
                    onChange={() => toggleFlavor(flavor._id)}
                    style={{ marginRight: "10px", marginTop: "5px" }}
                  />
                  <Form.Check.Label>{flavor.name}</Form.Check.Label>
                </Form.Check>
              ))}
            </div>
          </Form.Group>

          {/* Sizes */}
          <Form.Group className="mb-3" controlId="productSizes">
            <Form.Label>Sizes</Form.Label>
            {selectedSizes.map((size, index) => (
              <Row key={index} className="mb-2">
                <Col md={4}>
                  <Form.Control
                    type="text"
                    placeholder="Name"
                    value={size.name}
                    onChange={(e) => {
                      const newSizes = [...selectedSizes];
                      newSizes[index].name = e.target.value;
                      setSelectedSizes(newSizes);
                    }}
                  />
                </Col>
                <Col md={4}>
                  <Form.Control
                    type="number"
                    placeholder="Weight value"
                    value={size.weight.value}
                    onChange={(e) => {
                      const newSizes = [...selectedSizes];
                      newSizes[index].weight.value = e.target.value;
                      setSelectedSizes(newSizes);
                    }}
                  />
                </Col>
                <Col md={3}>
                  <Form.Select
                    value={size.weight.unit}
                    onChange={(e) => {
                      const newSizes = [...selectedSizes];
                      newSizes[index].weight.unit = e.target.value;
                      setSelectedSizes(newSizes);
                    }}
                  >
                    <option value="g">g</option>
                    <option value="kg">kg</option>
                  </Form.Select>
                </Col>
                <Col md={1} className="d-flex align-items-center">
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() =>
                      setSelectedSizes(
                        selectedSizes.filter((_, i) => i !== index)
                      )
                    }
                  >
                    ×
                  </Button>
                </Col>
              </Row>
            ))}
            <Button
              variant="secondary"
              size="sm"
              onClick={() =>
                setSelectedSizes([
                  ...selectedSizes,
                  { name: "", weight: { value: "", unit: "g" } },
                ])
              }
              className="mt-2"
            >
              + Add Size
            </Button>
          </Form.Group>

          <div className="text-center">
            <Button
              type="submit"
              disabled={isSubmitting}
              style={{ width: "160px" }}
            >
              {isSubmitting ? "Creating..." : "Create Product"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateProductModal;