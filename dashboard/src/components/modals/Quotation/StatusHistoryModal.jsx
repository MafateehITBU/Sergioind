import React from 'react';
import { Modal, Table } from 'react-bootstrap';
import dayjs from 'dayjs';

const StatusHistoryModal = ({ show, handleClose, quot }) => {
    const history = quot?.statusHistory ?? [];

    return (
        <Modal show={show} onHide={handleClose} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Status History</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {history.length === 0 ? (
                    <div className="text-center p-3">No status history available.</div>
                ) : (
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Status</th>
                                <th>Changed By</th>
                                <th>Response</th>
                                <th>Total Price</th>
                                <th>Changed At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.map((item, index) => (
                                <tr key={item._id || index}>
                                    <td>{index + 1}</td>
                                    <td>{item.status}</td>
                                    <td>{item.changedBy?.name}</td>
                                    <td>{quot.adminResponse ?? "-"}</td>
                                    <td>{quot.totalPrice?? "-"}</td>
                                    <td>{dayjs(item.changedAt).format('YYYY-MM-DD HH:mm')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </Modal.Body>
        </Modal>
    );
};

export default StatusHistoryModal;