import React, { useEffect, useState } from 'react';
import { useTable, useGlobalFilter, useSortBy } from 'react-table';
import { Modal, Button, Form } from 'react-bootstrap';
import { Icon } from '@iconify/react';
import axiosInstance from "../axiosConfig";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaSortUp, FaSortDown, FaSort } from 'react-icons/fa';
import DeleteModal from './modals/DeleteModal.jsx';

const GlobalFilter = ({ globalFilter, setGlobalFilter }) => (
    <input
        className="form-control w-100"
        value={globalFilter || ''}
        onChange={e => setGlobalFilter(e.target.value)}
        placeholder="Search Flavors..."
    />
);

const FlavorsLayer = () => {
    const [flavors, setFlavors] = useState([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({ name: '', description: '', color: '#ffffff' });
    const [selectedFlavorEdit, setSelectedFlavorEdit] = useState(null);

    const [selectedFlavorDelete, setSelectedFlavorDelete] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const fetchData = async () => {
        try {
            const response = await axiosInstance.get('/flavors', {
                params: { page, limit: 5, search }
            });
            setFlavors(response.data.data || []);
            setTotalPages(response.data.pagination?.totalPages || 1);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [page, search]);

    const openCreateModal = () => {
        setEditMode(false);
        setFormData({ name: '', description: '', color: '#ffffff' });
        setShowModal(true);
    };

    const openEditModal = (flavor) => {
        setEditMode(true);
        setFormData({
            name: flavor.name,
            description: flavor.description || '',
            color: flavor.color || '#ffffff'
        });
        setSelectedFlavorEdit(flavor);
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
        setFormData({ name: '', description: '', color: '#ffffff' });
        setSelectedFlavorEdit(null);
    };

    const handleSubmit = async () => {
        try {
            if (editMode && selectedFlavorEdit) {
                await axiosInstance.put(`/flavors/${selectedFlavorEdit._id}`, formData);
                toast.success("Flavor updated!", { position: "top-right" });
            } else {
                await axiosInstance.post('/flavors', formData);
                toast.success("Flavor created!", { position: "top-right" });
            }
            handleModalClose();
            fetchData();
        } catch (error) {
            toast.error("Operation failed", { position: "top-right" });
            console.error(error);
        }
    };

    const handleDelete = (flavor) => {
        setSelectedFlavorDelete(flavor);
        setShowDeleteModal(true);
    };

    const columns = React.useMemo(() => [
        {
            Header: '#',
            Cell: ({ row }) => (page - 1) * 5 + row.index + 1,
        },
        { Header: 'Name', accessor: row => row.name || '-' },
        {
            Header: 'Description',
            accessor: row => row.description || '-',
            Cell: ({ value }) => (
                <span
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        maxWidth: '300px',
                        whiteSpace: 'normal',
                        wordBreak: 'break-word',
                        textAlign: 'center',
                        margin: '0 auto',
                    }}
                >
                    {value}
                </span>
            )
        },
        {
            Header: 'Color',
            accessor: row => row.color || '-',
            Cell: ({ value }) => (
                <span
                    style={{
                        display: 'inline-block',
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                        background: value,
                        border: '1px solid #ccc'
                    }}
                />
            )
        },
        {
            Header: 'Actions',
            Cell: ({ row }) => (
                <div className="d-flex justify-content-center gap-2">
                    <button
                        className="btn btn-sm btn-primary"
                        onClick={() => openEditModal(row.original)}
                    >
                        <Icon icon="mdi:pencil" />
                    </button>
                    <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(row.original)}
                    >
                        <Icon icon="mdi:delete" />
                    </button>
                </div>
            ),
        },
    ], [page]);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        rows,
        setGlobalFilter,
        state: { globalFilter }
    } = useTable(
        { columns, data: flavors },
        useGlobalFilter,
        useSortBy
    );

    useEffect(() => {
        setGlobalFilter(search);
    }, [search, setGlobalFilter]);

    return (
        <div className="card basic-data-table" style={{ minHeight: '65vh' }}>
            <ToastContainer />
            <div className="card-header d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
                <h5 className='card-title mb-0 flex-shrink-0 w-35 w-md-100 w-sm-100'>Flavors</h5>
                <div className="w-35 w-md-100 w-sm-100">
                    <GlobalFilter globalFilter={search} setGlobalFilter={setSearch} />
                </div>
                <div className="w-35 w-md-100 w-sm-100">
                    <button
                        className="btn btn-success w-100 w-md-auto"
                        onClick={openCreateModal}
                    >
                        <span className="ms-1">Add New Flavor</span>
                    </button>
                </div>
            </div>

            <div className="card-body p-0 d-flex flex-column">
                {flavors.length === 0 ? (
                    <div className="text-center p-4">No flavors found</div>
                ) : (
                    <>
                        <div className="table-responsive">
                            <table className="table bordered-table mb-0" {...getTableProps()}>
                                <thead>
                                    {headerGroups.map(headerGroup => (
                                        <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                                            {headerGroup.headers.map(column => (
                                                <th {...column.getHeaderProps(column.getSortByToggleProps())} key={column.id} style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                                                    {column.render('Header')}{' '}
                                                    {column.isSorted ? (
                                                        column.isSortedDesc ? <FaSortDown /> : <FaSortUp />
                                                    ) : (
                                                        <FaSort style={{ opacity: 0.3 }} />
                                                    )}
                                                </th>
                                            ))}
                                        </tr>
                                    ))}
                                </thead>
                                <tbody {...getTableBodyProps()}>
                                    {rows.map(row => {
                                        prepareRow(row);
                                        return (
                                            <tr {...row.getRowProps()} key={row.id}>
                                                {row.cells.map(cell => (
                                                    <td {...cell.getCellProps()} key={cell.column.id} style={{ textAlign: 'center', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                                                        {cell.render('Cell')}
                                                    </td>
                                                ))}
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <div className="d-flex justify-content-end mt-auto px-3 pb-4">
                            <ul className="pagination mb-0">
                                <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                                    <button className="page-link" onClick={() => setPage(prev => Math.max(prev - 1, 1))}>Prev</button>
                                </li>
                                {[...Array(totalPages).keys()].map(p => (
                                    <li key={p} className={`page-item ${p + 1 === page ? 'active' : ''}`}>
                                        <button className="page-link" onClick={() => setPage(p + 1)}>{p + 1}</button>
                                    </li>
                                ))}
                                <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                                    <button className="page-link" onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}>Next</button>
                                </li>
                            </ul>
                        </div>
                    </>
                )}
            </div>

            {/* Create/Edit Modal */}
            <Modal show={showModal} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{editMode ? 'Edit Flavor' : 'Create Flavor'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Enter flavor name"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Enter description"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3 d-flex justify-content-between">
                            <Form.Label style={{ marginTop: "10px" }}>Color</Form.Label>
                            <div className='d-flex'>
                                <Form.Control
                                    type="color"
                                    value={formData.color}
                                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                    title="Choose color"
                                    className='mx-3'
                                    style={{width: "60px"}}
                                />
                                <div className="mt-2">
                                    Selected color: <code>{formData.color}</code>
                                </div>
                            </div>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleModalClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        {editMode ? 'Update' : 'Create'}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Delete Modal */}
            {selectedFlavorDelete && (
                <DeleteModal
                    show={showDeleteModal}
                    handleClose={() => setShowDeleteModal(false)}
                    item={selectedFlavorDelete}
                    itemType="flavors"
                    fetchData={fetchData}
                />
            )}
        </div>
    );
};

export default FlavorsLayer;