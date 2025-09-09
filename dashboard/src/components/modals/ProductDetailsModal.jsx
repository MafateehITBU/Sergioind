import { Modal, Button } from "react-bootstrap";

const ProductDetailsModal = ({ show, handleClose, product }) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="h5">Product Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {product ? (
          <div>
            <h5>{product.name}</h5>
            <p>
              <strong>Category:</strong> {product.category?.name}
            </p>
            <p>
              <strong>Stock:</strong> {product.stock}
            </p>
            <p>
              <strong>Sizes:</strong>{" "}
              {product.sizes && product.sizes.length > 0
                ? product.sizes.map((size) => size.name).join(", ")
                : "N/A"}
            </p>
            <p>
              <strong>Flavor:</strong> {product.flavor || "N/A"}
            </p>
            <br />
            <p>
              <strong>Description:</strong> {product.description}
            </p>
          </div>
        ) : (
          <p>No product details available.</p>
        )}
      </Modal.Body>
      <Modal.Footer className="justify-content-center">
        <Button
          variant="secondary"
          onClick={handleClose}
          style={{ width: "120px" }}
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
export default ProductDetailsModal;
