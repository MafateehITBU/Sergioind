import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import axiosInstance from "../../../axiosConfig";
import { toast } from "react-toastify";

const UpdateProductModal = ({
  show,
  handleClose,
  productId,
  fetchProducts,
}) => {
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");
  const [images, setImages] = useState([]); // will hold {url} or File
  const [flavors, setFlavors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedFlavors, setSelectedFlavors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([
    { name: "", weight: { value: "", unit: "g" } },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch flavors and categories
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

  // Fetch product data
  useEffect(() => {
    if (!show || !productId) return;

    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const res = await axiosInstance.get(`/products/${productId}`);
        const product = res.data.data;
        console.log("Product: ", product);

        setName(product.name || "");
        setSku(product.sku || "");
        setDescription(product.description || "");
        setCategory(product.category?._id || "");
        setStock(product.stock || "");
        setSelectedFlavors(product.flavors?.map((f) => f._id) || []);
        setSelectedSizes(
          product.sizes?.length
            ? product.sizes
            : [{ name: "", weight: { value: "", unit: "g" } }]
        );

        // Map backend images to {url}
        setImages(
          product.image?.map((img) => ({
            url: img.url,
            public_id: img.public_id,
          })) || []
        );
      } catch {
        toast.error("Failed to load product data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [show, productId]);

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

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
  };

  const handleRemoveImage = async (public_id, index) => {
    // If it's an existing image (has public_id), call backend
    if (public_id) {
      try {
        await axiosInstance.delete(`/products/${productId}/delete-image`, {
          data: { public_id },
        });
        toast.success("Image deleted successfully");
      } catch {
        toast.error("Failed to delete image");
        return;
      }
    }
    // Remove from frontend state
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSizeChange = (index, field, value) => {
    const newSizes = [...selectedSizes];
    if (field === "name") newSizes[index].name = value;
    if (field === "weightValue") newSizes[index].weight.value = value;
    if (field === "weightUnit") newSizes[index].weight.unit = value;
    setSelectedSizes(newSizes);
  };

  const addSize = () => {
    setSelectedSizes([
      ...selectedSizes,
      { name: "", weight: { value: "", unit: "g" } },
    ]);
  };

  const removeSize = (index) => {
    setSelectedSizes(selectedSizes.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("sku", sku);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("stock", stock);

    selectedFlavors.forEach((f) => formData.append("flavors", f));
    formData.append("sizes", JSON.stringify(selectedSizes));

    images.forEach((img) => {
      if (img instanceof File) formData.append("images", img);
      else if (img.url) formData.append("existingImages", img.url); // backend support
    });

    try {
      await axiosInstance.put(`/products/${productId}`, formData);
      toast.success("Product updated successfully");
      fetchProducts?.();
      handleClose();
      resetForm();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update product");
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
        <Modal.Title>Update Product</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {isLoading ? (
          <div>Loading product data...</div>
        ) : (
          <Form onSubmit={handleSubmit}>
            {/* Name & SKU */}
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Name </Form.Label>
                  <Form.Control
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>SKU </Form.Label>
                  <Form.Control
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Description */}
            <Form.Group className="mb-3">
              <Form.Label>Description </Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>

            {/* Category & Stock */}
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category </Form.Label>
                  <Form.Select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
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
                <Form.Group className="mb-3">
                  <Form.Label>Stock</Form.Label>
                  <Form.Control
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Flavors */}
            <Form.Group className="mb-3">
              <Form.Label>Flavors</Form.Label>
              <div className="d-flex flex-wrap gap-2">
                {flavors.map((flavor) => (
                  <Form.Check key={flavor._id} type="checkbox">
                    <Form.Check.Input
                      type="checkbox"
                      checked={selectedFlavors.includes(flavor._id)}
                      onChange={() => toggleFlavor(flavor._id)}
                    />
                    <Form.Check.Label>{flavor.name}</Form.Check.Label>
                  </Form.Check>
                ))}
              </div>
            </Form.Group>

            {/* Sizes */}
            <Form.Group className="mb-3">
              <Form.Label>Sizes</Form.Label>
              {selectedSizes.map((size, index) => (
                <Row key={index} className="mb-2">
                  <Col md={4}>
                    <Form.Control
                      type="text"
                      value={size.name}
                      placeholder="Name"
                      onChange={(e) =>
                        handleSizeChange(index, "name", e.target.value)
                      }
                    />
                  </Col>
                  <Col md={4}>
                    <Form.Control
                      type="number"
                      value={size.weight.value}
                      placeholder="Weight"
                      onChange={(e) =>
                        handleSizeChange(index, "weightValue", e.target.value)
                      }
                    />
                  </Col>
                  <Col md={3}>
                    <Form.Select
                      value={size.weight.unit}
                      onChange={(e) =>
                        handleSizeChange(index, "weightUnit", e.target.value)
                      }
                    >
                      <option value="g">g</option>
                      <option value="kg">kg</option>
                    </Form.Select>
                  </Col>
                  <Col md={1}>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => removeSize(index)}
                    >
                      ×
                    </Button>
                  </Col>
                </Row>
              ))}
              <Button variant="secondary" size="sm" onClick={addSize}>
                + Add Size
              </Button>
            </Form.Group>

            {/* Images */}
            <Form.Group className="mb-3">
              <Form.Label>Images</Form.Label>
              <Form.Control type="file" multiple onChange={handleImageChange} />
              <div className="d-flex flex-wrap gap-2 mt-2">
                {images.map((img, index) => {
                  const url =
                    img instanceof File ? URL.createObjectURL(img) : img.url;
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
                        alt="preview"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        onLoad={() =>
                          img instanceof File && URL.revokeObjectURL(url)
                        }
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(img.public_id, index)}
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
                      >
                        &times;
                      </button>
                    </div>
                  );
                })}
              </div>
            </Form.Group>

            <div className="text-center">
              <Button
                type="submit"
                disabled={isSubmitting}
                style={{ width: "160px" }}
              >
                {isSubmitting ? "Updating..." : "Update Product"}
              </Button>
            </div>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default UpdateProductModal;
