import React, { useEffect, useState } from 'react';
import { useTable, useGlobalFilter, useSortBy } from 'react-table';
import { Icon } from '@iconify/react';
import axiosInstance from "../axiosConfig.js";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaSortUp, FaSortDown, FaSort } from 'react-icons/fa';
import CreateProductModal from './modals/Product/CreateProductModal.jsx';
import UpdateProductModal from './modals/Product/UpdateProductModal.jsx';
import DeleteModal from './modals/DeleteModal.jsx';

const GlobalFilter = ({ globalFilter, setGlobalFilter }) => (
    <input
        className="form-control w-100"
        value={globalFilter || ''}
        onChange={e => setGlobalFilter(e.target.value)}
        placeholder="Search Products..."
    />
);

const ProductsLayer = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');

    const pageSize = 10;

    useEffect(() => {
        fetchProducts();
    }, [page, search]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get('/products', {
                params: { page, limit: pageSize, search }
            });
            setProducts(res.data.data || []);
            setTotalPages(res.data.pagination?.totalPages || 1);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to fetch data');
            setLoading(false);
        }
    };

    const handleAddProduct = () => setShowAddModal(true);
    const handleUpdateProduct = (product) => {
        setSelectedProduct(product);
        setShowUpdateModal(true);
    };
    const handleDeleteProduct = (product) => {
        setSelectedProduct(product);
        setShowDeleteModal(true);
    };

    const handleActivation = async (productId) => {
        try {
            const res = await axiosInstance.patch(`/products/${productId}/toggle-status`);
            toast.success(res.data.message, { position: "top-right" });
            fetchProducts();
        } catch (error) {
            toast.error('Failed to Toggle Activation.', { position: "top-right" });
        }
    };

    const columns = React.useMemo(() => [
        {
            Header: '#',
            Cell: ({ row }) => (page - 1) * pageSize + row.index + 1,
        },
        {
            Header: 'Photo',
            accessor: 'image',
            Cell: ({ row }) => {
                const images = row?.original?.image || [];
                const randomId = `carousel-${row.id}`;

                if (images.length === 0) {
                    return (
                        <img
                            src='/placeholder.jpg'
                            alt='No Image'
                            style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                        />
                    );
                }

                return (
                    <div id={randomId} className="carousel slide" data-bs-ride="carousel" style={{ width: '60px' }}>
                        <div className="carousel-inner">
                            {images.map((img, index) => (
                                <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={index}>
                                    <img
                                        src={img.url}
                                        alt={`Slide ${index}`}
                                        className="d-block w-100"
                                        style={{ height: '60px', objectFit: 'cover', borderRadius: '50%' }}
                                    />
                                </div>
                            ))}
                        </div>
                        {images.length > 1 && (
                            <>
                                <button
                                    className="carousel-control-prev"
                                    type="button"
                                    data-bs-target={`#${randomId}`}
                                    data-bs-slide="prev"
                                    style={{ width: '15%' }}
                                >
                                    <span className="carousel-control-prev-icon" style={{ filter: 'invert(1)' }}></span>
                                </button>
                                <button
                                    className="carousel-control-next"
                                    type="button"
                                    data-bs-target={`#${randomId}`}
                                    data-bs-slide="next"
                                    style={{ width: '15%' }}
                                >
                                    <span className="carousel-control-next-icon" style={{ filter: 'invert(1)' }}></span>
                                </button>
                            </>
                        )}
                    </div>
                );
            },
        },
        { Header: 'Name', accessor: 'name' },
        { Header: 'SKU', accessor: 'sku' },
        {
            Header: 'Description',
            accessor: row => row.description || '-',
            Cell: ({ value }) => (
                <span
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        maxWidth: '200px',
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
            Header: 'Details',
            accessor: 'details',
            Cell: ({ value }) => {
                if (!value || value.length === 0) return '-';
                return (
                    <div style={{
                        whiteSpace: 'normal',
                        wordWrap: 'break-word',
                        maxWidth: '200px',
                    }}>
                        {value.map((detail, index) => (
                            <div key={index} className="d-flex align-items-center gap-1">
                                <span>{detail}, {" "}</span>
                            </div>
                        ))}
                    </div>
                );
            }
        },
        {
            Header: 'Flavor',
            accessor: 'flavor',
            Cell: ({ value }) => {
                if (!value ) return '-';
                return (
                    <div style={{
                        whiteSpace: 'normal',
                        wordWrap: 'break-word',
                        maxWidth: '200px',
                    }}>
                        <div>{value}</div>
                    </div>
                );
            }
        },
        {
            Header: 'Sizes',
            accessor: 'sizes',
            Cell: ({ value }) => {
                if (!value || value.length === 0) return '-';
                return (
                    <div style={{
                        whiteSpace: 'normal',
                        wordWrap: 'break-word',
                        maxWidth: '200px',
                    }}>
                        {value.map((size) => (
                            <div key={size._id}>{size.name}</div>
                        ))}
                    </div>
                );
            }
        },
        { Header: 'Category', accessor: 'category', Cell: ({ value }) => value?.name || '-' },
        { Header: 'Stock', accessor: 'stock' },
        {
            Header: 'is Active',
            accessor: 'isActive',
            Cell: ({ row, value }) => {
                const productId = row.original._id;
                const badgeColor = value ? 'success' : 'danger';
                const badgeText = value ? 'Active' : 'De-Activated';

                return (
                    <div className="dropdown">
                        <span className={`badge bg-${badgeColor} dropdown-toggle`} data-bs-toggle="dropdown" role="button" style={{ cursor: 'pointer' }}>
                            {badgeText}
                        </span>
                        <ul className="dropdown-menu">
                            {value !== true && <li><button className="dropdown-item" onClick={() => handleActivation(productId)}>Activate</button></li>}
                            {value !== false && <li><button className="dropdown-item" onClick={() => handleActivation(productId)}>De-Activate</button></li>}
                        </ul>
                    </div>
                );
            }
        },
        {
            Header: 'Actions',
            Cell: ({ row }) => (
                <div className="d-flex gap-2">
                    <button className="btn btn-sm btn-primary" onClick={() => handleUpdateProduct(row.original)}>
                        <Icon icon="mdi:pencil" />
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDeleteProduct(row.original)}>
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
        { columns, data: products },
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
                <h5 className='card-title mb-0 flex-shrink-0 w-35 w-md-100 w-sm-100'>Products</h5>
                <div className="w-35 w-md-100 w-sm-100">
                    <GlobalFilter globalFilter={search} setGlobalFilter={setSearch} />
                </div>
                <div className="w-35 w-md-100 w-sm-100">
                    <button className="btn btn-success w-100 w-md-auto" onClick={handleAddProduct}>
                        <span className="ms-1">Add New Product</span>
                    </button>
                </div>
            </div>

            <div className="card-body p-0 d-flex flex-column">
                {loading ? (
                    <div className="text-center p-4">Loading...</div>
                ) : products.length === 0 ? (
                    <div className="text-center p-4">No products found</div>
                ) : (
                    <>
                        <div className="table-responsive">
                            <table className="table bordered-table mb-0" {...getTableProps()}>
                                <thead>
                                    {headerGroups.map(headerGroup => (
                                        <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                                            {headerGroup.headers.map(column => (
                                                <th {...column.getHeaderProps(column.getSortByToggleProps())} key={column.id} style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                                                    {column.render('Header')}
                                                    {' '}
                                                    {column.isSorted ? (column.isSortedDesc ? <FaSortDown /> : <FaSortUp />) : (<FaSort style={{ opacity: 0.3 }} />)}
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

            <CreateProductModal
                show={showAddModal}
                handleClose={() => setShowAddModal(false)}
                fetchProducts={fetchProducts}
            />

            <UpdateProductModal
                show={showUpdateModal}
                handleClose={() => setShowUpdateModal(false)}
                productId={selectedProduct ? selectedProduct._id : null}
                fetchProducts={fetchProducts}
            />

            <DeleteModal
                show={showDeleteModal}
                handleClose={() => setShowDeleteModal(false)}
                item={selectedProduct}
                itemType="products"
                fetchData={fetchProducts}
            />
        </div>
    );
};

export default ProductsLayer;