import React from 'react';
import { Modal, Table } from 'react-bootstrap';

const QuotationItemsModal = ({ show, handleClose, items }) => {
    return (
        <Modal show={show} onHide={handleClose} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Quotation Items</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {(!items || items.length === 0) ? (
                    <div>No items to display.</div>
                ) : (
                    <Table bordered striped>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Product</th>
                                <th>SKU</th>
                                <th>Price</th>
                                <th>Flavor</th>
                                <th>Size</th>
                                <th>Quantity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, idx) => (
                                <tr key={item._id || idx}>
                                    <td>{idx + 1}</td>
                                    <td>{item.product?.name || '-'}</td>
                                    <td>{item.product?.sku || '-'}</td>
                                    <td>{item.product?.formattedPrice || item.product?.price || '-'}</td>
                                    <td>{item.flavor?.name || '-'}</td>
                                    <td>{item.size?.name || '-'}</td>
                                    <td>{item.quantity}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </Modal.Body>
        </Modal>
    );
};

export default QuotationItemsModal;