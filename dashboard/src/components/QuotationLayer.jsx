import React, { useEffect, useState } from 'react';
import { useTable, useGlobalFilter, useSortBy } from 'react-table';
import { Icon } from '@iconify/react';
import axiosInstance from "../axiosConfig.js";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaSortUp, FaSortDown, FaSort } from 'react-icons/fa';
import QuotationItemsModal from './modals/Quotation/QuotationItemsModal.jsx';
import StatusHistoryModal from './modals/Quotation/StatusHistoryModal.jsx';
import UpdateQuotationStatusModal from './modals/Quotation/UpdateQuotationStatusModal.jsx';
import DeleteModal from './modals/DeleteModal.jsx';

const GlobalFilter = ({ globalFilter, setGlobalFilter }) => (
    <input
        className="form-control w-100"
        value={globalFilter || ''}
        onChange={e => setGlobalFilter(e.target.value)}
        placeholder="Search Quotations..."
    />
);

const QuotationsLayer = () => {
    const [quots, setQuots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showItemsModal, setShowItemsModal] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [statusHistory, setStatusHistory] = useState(null);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedQuot, setSelectedQuot] = useState(null);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');

    const pageSize = 10;

    useEffect(() => {
        fetchQuots();
    }, [page, search]);

    const fetchQuots = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get('/quotation-requests', {
                params: { page, limit: pageSize, search }
            });
            setQuots(res.data.data.quotationRequests || []);
            setTotalPages(res.data.data.pagination?.totalPages || 1);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to fetch data');
            setLoading(false);
        }
    };

    const handleUpdateQuotStatus = (quot) => {
        setSelectedQuot(quot);
        setShowUpdateModal(true);
    };

    const handleViewHistory = (quotation) => {
        setStatusHistory(quotation || []);
        setShowHistoryModal(true);
    };

    const handleDeleteQuot = (quot) => {
        setSelectedQuot(quot);
        setShowDeleteModal(true);
    };

    const columns = React.useMemo(() => [
        {
            Header: '#',
            Cell: ({ row }) => (page - 1) * pageSize + row.index + 1,
        },
        { Header: 'Name', accessor: 'name' },
        { Header: 'Email', accessor: 'email' },
        { Header: 'Phone', accessor: 'phoneNumber' },
        {
            Header: 'Items',
            Cell: ({ row }) => (
                <button
                    className="btn btn-sm btn-info"
                    onClick={() => {
                        setSelectedItems(row.original.items || []);
                        setShowItemsModal(true);
                    }}
                >
                    View
                </button>
            ),
        },
        {
            Header: 'Status History',
            Cell: ({ row }) => (
                <button
                    className="btn btn-sm btn-info"
                    onClick={() => handleViewHistory(row.original)}
                >
                    View History
                </button>
            )
        },
        {
            Header: 'Status',
            accessor: row => row?.status,
            Cell: ({ row }) => {
                const status = row.original.status;

                let badgeClass = '';
                switch (status) {
                    case 'closed':
                        badgeClass = 'bg-success'; // green
                        break;
                    case 'ongoing':
                        badgeClass = 'bg-warning text-light'; // yellow with white text
                        break;
                    case 'sent':
                        badgeClass = 'bg-primary'; // blue
                        break;
                    default:
                        badgeClass = 'bg-secondary'; // gray for unknown status
                        break;
                }

                return (
                    <span className={`badge ${badgeClass}`}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                );
            },
        },
        {
            Header: 'Actions',
            Cell: ({ row }) => (
                <div className="d-flex gap-2">
                    <button className="btn btn-sm btn-primary" onClick={() => handleUpdateQuotStatus(row.original)}>
                        <Icon icon="mdi:pencil" />
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDeleteQuot(row.original)}>
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
        { columns, data: quots },
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
                <h5 className='card-title mb-0 flex-shrink-0 w-35 w-md-100 w-sm-100'>Quotations</h5>
                <div className="w-35 w-md-100 w-sm-100">
                    <GlobalFilter globalFilter={search} setGlobalFilter={setSearch} />
                </div>
            </div>

            <div className="card-body p-0 d-flex flex-column">
                {loading ? (
                    <div className="text-center p-4">Loading...</div>
                ) : quots.length === 0 ? (
                    <div className="text-center p-4">No quotations found</div>
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
            
            <QuotationItemsModal
                show={showItemsModal}
                handleClose={() => setShowItemsModal(false)}
                items={selectedItems}
            />

            <StatusHistoryModal
                show={showHistoryModal}
                handleClose={() => setShowHistoryModal(false)}
                quot={statusHistory}
            />

            <UpdateQuotationStatusModal
                show={showUpdateModal}
                handleClose={() => setShowUpdateModal(false)}
                quotation={selectedQuot}
                fetchQuotations={fetchQuots}
            />

            <DeleteModal
                show={showDeleteModal}
                handleClose={() => setShowDeleteModal(false)}
                item={selectedQuot}
                itemType="quotation-requests"
                fetchData={fetchQuots}
            />
        </div>
    );
};

export default QuotationsLayer;