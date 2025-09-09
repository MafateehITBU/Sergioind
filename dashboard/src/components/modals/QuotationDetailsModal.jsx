import { Modal, Button } from "react-bootstrap";

const QuotationDetailsModal = ({ show, handleClose, quotation }) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="h5">Quotation Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {quotation ? (
          <div>
            <p>
              <strong>Customer Name:</strong> {quotation.name}
            </p>
            <p>
              <strong>Comapny Name:</strong> {quotation.companyName || "N/A"}
            </p>
            <p>
              <strong>Customer Email:</strong> {quotation.email}
            </p>
            <p>
              <strong>Status:</strong> {quotation.status}
            </p>
            <p>
              <strong>Created At:</strong>{" "}
              {new Date(quotation.createdAt).toLocaleString()}
            </p>
            <p>
              <strong>Notes:</strong> {quotation.note || "N/A"}
            </p>
            <h6 className="mt-3">Products:</h6>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Flavor</th>
                  <th>Size</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {quotation.items.map((item, index) => (
                  <tr key={index}>
                    <td>{item.product?.name || "N/A"}</td>
                    <td>{item.product?.sku || "N/A"}</td>
                    <td>{item.product?.flavor || "N/A"}</td>
                    <td>{item.size || "N/A"}</td>
                    <td>{item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No quotation details available.</p>
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
export default QuotationDetailsModal;
