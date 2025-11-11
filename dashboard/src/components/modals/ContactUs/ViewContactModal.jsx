import { Modal, Button } from "react-bootstrap";

const ViewContactModal = ({ show, handleClose, contact }) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="h5">Contact Details</Modal.Title>
      </Modal.Header>
      <Modal.Body
        style={{
          maxHeight: "60vh",
          overflowY: "auto",
          wordBreak: "break-word",
          whiteSpace: "pre-wrap",
        }}
      >
        {contact ? (
          <div>
            <p>
              <strong>Name:</strong> {contact.name || "N/A"}
            </p>
            <p>
              <strong>Email:</strong> {contact.email || "N/A"}
            </p>
            <p>
              <strong>Phone:</strong> {contact.phoneNumber || "N/A"}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span className="badge bg-info text-dark">
                {contact.status
                  ? contact.status.charAt(0).toUpperCase() +
                    contact.status.slice(1)
                  : "N/A"}
              </span>
            </p>
            <p>
              <strong>Message:</strong>
              <br />
              <div
                style={{
                  background: "#f8f9fa",
                  padding: "10px",
                  borderRadius: "8px",
                  marginTop: "5px",
                  overflowWrap: "break-word",
                  wordBreak: "break-word",
                }}
              >
                {contact.message || "No message provided."}
              </div>
            </p>
          </div>
        ) : (
          <p>No contact details available.</p>
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

export default ViewContactModal;
