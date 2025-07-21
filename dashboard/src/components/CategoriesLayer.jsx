import React, { useEffect, useState } from 'react';
import { useTable, useGlobalFilter, useSortBy } from 'react-table';
import { Icon } from '@iconify/react';
import axiosInstance from "../axiosConfig";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaSortUp, FaSortDown, FaSort } from 'react-icons/fa';
import CreateCategoryModal from './modals/Category/CreateCategoryModal.jsx';
import EditCategoryModal from './modals/Category/EditCategoryModal.jsx';
import DeleteModal from './modals/DeleteModal.jsx';

const GlobalFilter = ({ globalFilter, setGlobalFilter }) => (
    <input
        className="form-control w-100"
        value={globalFilter || ''}
        onChange={e => setGlobalFilter(e.target.value)}
        placeholder="Search Categories..."
    />
);

const CategoriesLayer = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [editModalShow, setEditModalShow] = useState(false);
    const [selectedCategoryEdit, setSelectedCategoryEdit] = useState(null);
    const [selectedCategoryDelete, setSelectedCategoryDelete] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');
    const pageSize = 5;

    useEffect(() => {
        fetchData();
    }, [page, search]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get('/categories', {
                params: { page, limit: pageSize, search }
            });
            setCategories(response.data.data || []);
            setTotalPages(response.data.pagination?.totalPages || 1);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to fetch categories');
            setLoading(false);
        }
    };

    const handleActivation = async (categoryId) => {
        try {
            const res = await axiosInstance.patch(`/categories/${categoryId}/toggle-status`);
            toast.success(res.data.message, { position: "top-right" });
            fetchData();
        } catch (error) {
            toast.error('Failed to Toggle Activation', { position: "top-right" });
        }
    };

    const handleDelete = (category) => {
        setSelectedCategoryDelete(category);
        setShowDeleteModal(true);
    };

    const columns = React.useMemo(() => [
        {
            Header: '#',
            Cell: ({ row }) => (page - 1) * pageSize + row.index + 1,
        },
        {
            Header: 'Photo',
            accessor: 'image',
            Cell: ({ value }) => (
                <img
                    src={value?.url}
                    alt="Category"
                    style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                />
            ),
        },
        { Header: 'Name', accessor: 'name' },
        {
            Header: 'Description',
            accessor: 'description',
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
                    {value || '-'}
                </span>
            )
        },
        {
            Header: 'is Active',
            accessor: 'isActive',
            Cell: ({ row, value }) => {
                const categoryId = row.original._id;
                const badgeColor = value ? 'success' : 'danger';
                const badgeText = value ? 'Active' : 'De-Activated';

                return (
                    <div className="dropdown">
                        <span className={`badge bg-${badgeColor} dropdown-toggle`} data-bs-toggle="dropdown" role="button" style={{ cursor: 'pointer' }}>
                            {badgeText}
                        </span>
                        <ul className="dropdown-menu">
                            {!value && <li><button className="dropdown-item" onClick={() => handleActivation(categoryId)}>Activate</button></li>}
                            {value && <li><button className="dropdown-item" onClick={() => handleActivation(categoryId)}>De-Activate</button></li>}
                        </ul>
                    </div>
                );
            }
        },
        {
            Header: 'Actions',
            Cell: ({ row }) => (
                <div className="d-flex justify-content-center gap-2">
                    <button
                        className="btn btn-sm btn-primary"
                        onClick={() => { setSelectedCategoryEdit(row.original); setEditModalShow(true); }}
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
        setGlobalFilter
    } = useTable(
        { columns, data: categories },
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
                <h5 className='card-title mb-0 flex-shrink-0 w-35 w-md-100 w-sm-100'>Categories</h5>
                <div className="w-35 w-md-100 w-sm-100">
                    <GlobalFilter globalFilter={search} setGlobalFilter={setSearch} />
                </div>
                <div className="w-35 w-md-100 w-sm-100">
                    <button
                        className="btn btn-success w-100 w-md-auto"
                        onClick={() => setShowModal(true)}
                    >
                        <span className="ms-1">Create New Category</span>
                    </button>
                </div>
            </div>

            <div className="card-body p-0 d-flex flex-column">
                {loading ? (
                    <div className="text-center p-4">Loading...</div>
                ) : categories.length === 0 ? (
                    <div className="text-center p-4">No categories found</div>
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
                                                    style={{ textAlign: 'center', whiteSpace: 'nowrap' }}
                                                    key={column.id}
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
                                                        style={{ textAlign: 'center', verticalAlign: 'middle', whiteSpace: 'nowrap' }}
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

                        {/* Backend Pagination */}
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

            <CreateCategoryModal
                show={showModal}
                handleClose={() => setShowModal(false)}
                fetchData={fetchData}
            />

            {selectedCategoryEdit && (
                <EditCategoryModal
                    show={editModalShow}
                    handleClose={() => setEditModalShow(false)}
                    fetchData={fetchData}
                    selectedCategory={selectedCategoryEdit}
                />
            )}

            {selectedCategoryDelete && (
                <DeleteModal
                    show={showDeleteModal}
                    handleClose={() => setShowDeleteModal(false)}
                    item={selectedCategoryDelete}
                    itemType="categories"
                    fetchData={fetchData}
                />
            )}
        </div>
    );
};

export default CategoriesLayer;