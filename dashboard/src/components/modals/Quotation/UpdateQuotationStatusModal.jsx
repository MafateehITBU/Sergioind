import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axiosInstance from '../../../axiosConfig';
import { toast } from 'react-toastify';

const UpdateQuotationStatusModal = ({
    show,
    handleClose,
    quotation,
    fetchQuotations
}) => {
    const [status, setStatus] = useState('');
    const [adminResponse, setAdminResponse] = useState('');
    const [totalPrice, setTotalPrice] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (quotation) {
            setStatus(quotation.status || '');
            setAdminResponse('');
            setTotalPrice('');
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
                totalPrice: totalPrice ? parseFloat(totalPrice) : undefined,
            };

            await axiosInstance.patch(
                `/quotation-requests/${quotation._id}/status`,
                payload
            );

            toast.success('Quotation status updated successfully');
            fetchQuotations?.();
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
                <Modal.Title>Update Quotation Status</Modal.Title>
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
                            <option value="ongoing">Ongoing</option>
                            <option value="sent">Sent</option>
                            <option value="closed">Closed</option>
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

                    <Form.Group className="mb-3">
                        <Form.Label>Total Price</Form.Label>
                        <Form.Control
                            type="number"
                            min="0"
                            step="0.01"
                            value={totalPrice}
                            onChange={(e) => setTotalPrice(e.target.value)}
                            placeholder="Optional"
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

export default UpdateQuotationStatusModal;