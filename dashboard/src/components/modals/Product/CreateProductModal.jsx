import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col, Card } from "react-bootstrap";
import axiosInstance from "../../../axiosConfig";
import { toast } from "react-toastify";

const Section = ({ title, children }) => (
  <Card className="mb-3 shadow-sm border-0">
    <Card.Body>
      <h6 className="mb-3 text-muted">{title}</h6>
      {children}
    </Card.Body>
  </Card>
);

const CreateProductModal = ({ show, handleClose, fetchProducts }) => {
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [description, setDescription] = useState("");
  const [flavor, setFlavor] = useState("");
  const [category, setCategory] = useState("");
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedDetails, setSelectedDetails] = useState([""]);
  const [selectedSizes, setSelectedSizes] = useState([
    { name: "", weight: { value: "", unit: "g" } },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // fetch categories
  useEffect(() => {
    if (!show) return;
    (async () => {
      try {
        const res = await axiosInstance.get("/categories");
        setCategories(res.data.data || []);
      } catch {
        toast.error("Failed to load categories");
      }
    })();
  }, [show]);

  const resetForm = () => {
    setName("");
    setSku("");
    setDescription("");
    setFlavor("");
    setSelectedDetails([""]);
    setCategory("");
    setImages([]);
    setSelectedSizes([{ name: "", weight: { value: "", unit: "g" } }]);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDetailsChange = (i, v) => {
    const newDetails = [...selectedDetails];
    newDetails[i] = v;
    setSelectedDetails(newDetails);
  };

  const addDetail = () => setSelectedDetails([...selectedDetails, ""]);
  const removeDetail = (i) =>
    setSelectedDetails(selectedDetails.filter((_, idx) => idx !== i));

  const handleSizeChange = (i, f, v) => {
    const newSizes = [...selectedSizes];
    if (f === "name") newSizes[i].name = v;
    if (f === "weightValue") newSizes[i].weight.value = v;
    if (f === "weightUnit") newSizes[i].weight.unit = v;
    setSelectedSizes(newSizes);
  };

  const addSize = () =>
    setSelectedSizes([
      ...selectedSizes,
      { name: "", weight: { value: "", unit: "g" } },
    ]);
  const removeSize = (i) =>
    setSelectedSizes(selectedSizes.filter((_, idx) => idx !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("sku", sku);
    formData.append("description", description);
    formData.append(
      "details",
      JSON.stringify(selectedDetails.filter((d) => d.trim() !== ""))
    );
    formData.append("category", category);
    formData.append("flavor", flavor); // single flavor field
    formData.append("sizes", JSON.stringify(selectedSizes));
    images.forEach((img) => {
      if (img instanceof File) formData.append("images", img);
    });

    try {
      await axiosInstance.post(`/products`, formData);
      toast.success("Product created");
      fetchProducts?.();
      handleClose();
      resetForm();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create");
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
        <Modal.Title>Create Product</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {/* Basic Info */}
          <Section title="Basic Information">
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>SKU</Form.Label>
                  <Form.Control
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>

            {/* Single Flavor */}
            <Form.Group className="mt-3">
              <Form.Label>Flavor</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter a Flavor"
                value={flavor}
                onChange={(e) => setFlavor(e.target.value)}
              />
            </Form.Group>

            {/* Details */}
            <Form.Group className="mt-3">
              <Form.Label>Details</Form.Label>
              {selectedDetails.map((detail, i) => (
                <Row key={i} className="align-items-center mb-2">
                  <Col md={10}>
                    <Form.Control
                      type="text"
                      value={detail}
                      placeholder="Enter a Detail"
                      onChange={(e) => handleDetailsChange(i, e.target.value)}
                    />
                  </Col>
                  <Col md={2} className="text-end">
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => removeDetail(i)}
                    >
                      ×
                    </Button>
                  </Col>
                </Row>
              ))}

              <Button variant="outline-secondary" size="sm" onClick={addDetail}>
                + Add Detail
              </Button>
            </Form.Group>
          </Section>

          {/* Inventory */}
          <Section title="Inventory">
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
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
            </Row>
          </Section>

          {/* Sizes */}
          <Section title="Sizes">
            {selectedSizes.map((size, i) => (
              <Row key={i} className="align-items-center mb-2">
                <Col md={4}>
                  <Form.Control
                    type="text"
                    value={size.name}
                    placeholder="Size name"
                    onChange={(e) =>
                      handleSizeChange(i, "name", e.target.value)
                    }
                  />
                </Col>
                <Col md={4}>
                  <Form.Control
                    type="number"
                    value={size.weight.value}
                    placeholder="Weight"
                    onChange={(e) =>
                      handleSizeChange(i, "weightValue", e.target.value)
                    }
                  />
                </Col>
                <Col md={3}>
                  <Form.Select
                    value={size.weight.unit}
                    onChange={(e) =>
                      handleSizeChange(i, "weightUnit", e.target.value)
                    }
                  >
                    <option value="g">g</option>
                    <option value="kg">kg</option>
                  </Form.Select>
                </Col>
                <Col md={1} className="text-end">
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => removeSize(i)}
                  >
                    ×
                  </Button>
                </Col>
              </Row>
            ))}
            <Button variant="outline-secondary" size="sm" onClick={addSize}>
              + Add Size
            </Button>
          </Section>

          {/* Images */}
          <Section title="Images">
            <Form.Control type="file" multiple onChange={handleImageChange} />
            <div className="d-flex flex-wrap gap-2 mt-3">
              {images.map((img, i) => {
                const url =
                  img instanceof File ? URL.createObjectURL(img) : img.url;
                return (
                  <div
                    key={i}
                    style={{
                      position: "relative",
                      width: 90,
                      height: 90,
                      borderRadius: 8,
                      overflow: "hidden",
                      border: "1px solid #ddd",
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
                      onClick={() => handleRemoveImage(i)}
                      style={{
                        position: "absolute",
                        top: 2,
                        right: 2,
                        background: "rgba(0,0,0,0.6)",
                        color: "white",
                        border: "none",
                        borderRadius: "50%",
                        width: 22,
                        height: 22,
                        cursor: "pointer",
                        fontSize: 14,
                        lineHeight: "20px",
                      }}
                    >
                      ×
                    </button>
                  </div>
                );
              })}
            </div>
          </Section>

          <div className="text-center">
            <Button type="submit" disabled={isSubmitting} className="px-4">
              {isSubmitting ? "Creating..." : "Create Product"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateProductModal;
