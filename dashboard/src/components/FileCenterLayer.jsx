import React, { useEffect, useState } from 'react';
import { useTable, useGlobalFilter, useSortBy } from 'react-table';
import { Modal, Button, Form } from 'react-bootstrap';
import { Icon } from '@iconify/react';
import axiosInstance from '../axiosConfig';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaSortUp, FaSortDown, FaSort } from 'react-icons/fa';
import DeleteModal from './modals/DeleteModal.jsx';

const GlobalFilter = ({ globalFilter, setGlobalFilter }) => (
    <input
        className="form-control w-100"
        value={globalFilter || ''}
        onChange={e => setGlobalFilter(e.target.value)}
        placeholder="Search Files..."
    />
);

const FileCenterLayer = () => {
    const [files, setFiles] = useState([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({ name: '', description: '' });
    const [selectedFileEdit, setSelectedFileEdit] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [fileFile, setFileFile] = useState(null);

    const [selectedFileDelete, setSelectedFileDelete] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const fetchData = async () => {
        try {
            const response = await axiosInstance.get('/filecenter', {
                params: { page, limit: 5, search }
            });
            setFiles(response.data.data || []);
            setTotalPages(response.data.pagination?.totalPages || 1);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [page, search]);

    // When opening create modal
    const openCreateModal = () => {
        setEditMode(false);
        setFormData({ name: '', description: '' });
        setImageFile(null);
        setFileFile(null);
        setShowModal(true);
    };

    // When opening edit modal
    const openEditModal = (file) => {
        setEditMode(true);
        setFormData({ name: file.name, description: file.description || '' });
        setSelectedFileEdit(file);
        setImageFile(null);
        setFileFile(null);
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
        setFormData({ name: '', description: '' });
        setSelectedFileEdit(null);
    };

    // Submit handler
    const handleSubmit = async () => {
        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('description', formData.description);

            if (imageFile) data.append('image', imageFile);
            if (fileFile) data.append('file', fileFile);

            if (editMode && selectedFileEdit) {
                await axiosInstance.put(`/filecenter/${selectedFileEdit._id}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                toast.success('File updated!', { position: 'top-right' });
            } else {
                await axiosInstance.post('/filecenter', data, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                toast.success('File created!', { position: 'top-right' });
            }
            handleModalClose();
            fetchData();
        } catch (error) {
            toast.error('Operation failed', { position: 'top-right' });
            console.error(error);
        }
    };

    const handleDelete = (file) => {
        setSelectedFileDelete(file);
        setShowDeleteModal(true);
    };

    const handleToggleActivation = async (id) => {
        try {
            await axiosInstance.patch(`/filecenter/${id}/toggle-status`);
            toast.success('Status updated!', { position: 'top-right' });
            fetchData();
        } catch (error) {
            toast.error('Failed to toggle status', { position: 'top-right' });
            console.error(error);
        }
    };

    const columns = React.useMemo(() => [
        {
            Header: '#',
            Cell: ({ row }) => (page - 1) * 5 + row.index + 1,
        },
        {
            Header: 'Image',
            accessor: row => row.image?.url,
            Cell: ({ value }) => (
                <img
                    src={value || '/placeholder.jpg'}
                    alt="file"
                    style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '5px' }}
                />
            )
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
            Header: 'File',
            accessor: row => row.file?.url,
            Cell: ({ value }) => (
                <a
                    href={value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-info"
                >
                    View
                </a>
            )
        },
        { Header: 'File Type', accessor: row => row.file?.fileType.split('/')[1] || '-' },
        { Header: 'Downloads', accessor: row => row.downloadCount || 0 },
        { Header: 'Views', accessor: row => row.viewCount || 0 },
        {
            Header: 'isActive',
            accessor: row => row.isActive,
            Cell: ({ row, value }) => (
                <div className="dropdown">
                    <span
                        className={`badge bg-${value ? 'success' : 'danger'} dropdown-toggle`}
                        role="button"
                        data-bs-toggle="dropdown"
                        style={{ cursor: 'pointer' }}
                    >
                        {value ? 'Active' : 'Inactive'}
                    </span>
                    <ul className="dropdown-menu">
                        <li>
                            <button
                                className="dropdown-item"
                                onClick={() => handleToggleActivation(row.original._id)}
                            >
                                {value ? 'Deactivate' : 'Activate'}
                            </button>
                        </li>
                    </ul>
                </div>
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
            )
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
        { columns, data: files },
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
                <h5 className="card-title mb-0 flex-shrink-0 w-35 w-md-100 w-sm-100">File Center</h5>
                <div className="w-35 w-md-100 w-sm-100">
                    <GlobalFilter globalFilter={search} setGlobalFilter={setSearch} />
                </div>
                <div className="w-35 w-md-100 w-sm-100">
                    <button
                        className="btn btn-success w-100 w-md-auto"
                        onClick={openCreateModal}
                    >
                        <span className="ms-1">Add New File</span>
                    </button>
                </div>
            </div>

            <div className="card-body p-0 d-flex flex-column">
                {files.length === 0 ? (
                    <div className="text-center p-4">No files found</div>
                ) : (
                    <>
                        <div className="table-responsive">
                            <table className="table bordered-table mb-0" {...getTableProps()}>
                                <thead>
                                    {headerGroups.map(headerGroup => (
                                        <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                                            {headerGroup.headers.map(column => (
                                                <th
                                                    {...column.getHeaderProps(column.getSortByToggleProps())}
                                                    key={column.id}
                                                    style={{ textAlign: 'center', whiteSpace: 'nowrap' }}
                                                >
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
                                                    <td
                                                        {...cell.getCellProps()}
                                                        key={cell.column.id}
                                                        style={{
                                                            textAlign: 'center',
                                                            verticalAlign: 'middle',
                                                            whiteSpace: 'nowrap',
                                                        }}
                                                    >
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
                                    <button className="page-link" onClick={() => setPage(p => Math.max(p - 1, 1))}>Prev</button>
                                </li>
                                {[...Array(totalPages).keys()].map(p => (
                                    <li key={p} className={`page-item ${p + 1 === page ? 'active' : ''}`}>
                                        <button className="page-link" onClick={() => setPage(p + 1)}>{p + 1}</button>
                                    </li>
                                ))}
                                <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                                    <button className="page-link" onClick={() => setPage(p => Math.min(p + 1, totalPages))}>Next</button>
                                </li>
                            </ul>
                        </div>
                    </>
                )}
            </div>

            {/* Create/Edit Modal */}
            <Modal show={showModal} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{editMode ? 'Edit File' : 'Create File'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Enter file name"
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

                        <Form.Group className="mb-3">
                            <Form.Label>Image Upload</Form.Label>
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={(e) => setImageFile(e.target.files[0])}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>File Upload</Form.Label>
                            <Form.Control
                                type="file"
                                accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                onChange={(e) => setFileFile(e.target.files[0])}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleModalClose}>Cancel</Button>
                    <Button variant="primary" onClick={handleSubmit}>{editMode ? 'Update' : 'Create'}</Button>
                </Modal.Footer>
            </Modal>

            {/* Delete Modal */}
            {selectedFileDelete && (
                <DeleteModal
                    show={showDeleteModal}
                    handleClose={() => setShowDeleteModal(false)}
                    item={selectedFileDelete}
                    itemType="filecenter"
                    fetchData={fetchData}
                />
            )}
        </div>
    );
};

export default FileCenterLayer;