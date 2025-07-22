import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axiosInstance from '../../../axiosConfig';
import { toast } from 'react-toastify';

const UpdateContactStatusModal = ({
    show,
    handleClose,
    quotation,
    fetchContactUs
}) => {
    const [status, setStatus] = useState('');
    const [adminResponse, setAdminResponse] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (quotation) {
            setStatus(quotation.status || '');
            setAdminResponse('');
        }
    }, [quotation]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!status || !adminResponse) {
            toast.error('Please fill all required fields');
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                status,
                adminResponse,
            };

            await axiosInstance.patch(
                `/contact-us/${quotation._id}/status`,
                payload
            );

            toast.success('Contact-us status updated successfully');
            fetchContactUs?.();
            handleClose();
        } catch (err) {
            console.error(err);
            toast.error('Failed to update quotation status');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal
            show={show}
            onHide={() => {
                handleClose();
            }}
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>Update Contact Status</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Status *</Form.Label>
                        <Form.Select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            required
                        >
                            <option value="">Select Status</option>
                            <option value="pending">Pending</option>
                            <option value="ongoing">Ongoing</option>
                            <option value="closed">Closed</option>
                            <option value="spam">Spam</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Admin Response *</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={adminResponse}
                            onChange={(e) => setAdminResponse(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <div className="text-center">
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Updating...' : 'Update'}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default UpdateContactStatusModal;