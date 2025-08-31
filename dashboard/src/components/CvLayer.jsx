import { useEffect, useState, useMemo } from "react";
import { useTable, useGlobalFilter, useSortBy } from "react-table";
import { Icon } from "@iconify/react";
import axiosInstance from "../axiosConfig";
import { ToastContainer, toast } from "react-toastify";
import { Card } from "react-bootstrap";
import "react-toastify/dist/ReactToastify.css";
import DeleteModal from "./modals/DeleteModal";

const CvLayer = ({ post }) => {
  const [cvs, setCvs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedCV, setSelectedCV] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  const pageSize = 10;

  // Fetch cvs
  useEffect(() => {
    fetchCvs();
  }, [post, page, search]);

  const fetchCvs = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/cv");

      setCvs(res.data.data || []);
      setTotalPages(res.data.pagination?.totalPages || 1);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch CVs");
    } finally {
      setLoading(false);
    }
  };

  const data = useMemo(() => cvs, [cvs]);

  const handleDeleteCV = (cv) => {
    setSelectedCV(cv);
    setShowDeleteModal(true);
  };
  const columns = useMemo(
    () => [
      { Header: "#", Cell: ({ row }) => (page - 1) * pageSize + row.index + 1 },
      {
        Header: "CV",
        Cell: ({ row }) =>
          row.original.cv?.url ? (
            <a
              href={row.original.cv.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm btn-info"
            >
              View CV
            </a>
          ) : (
            <span className="text-gray-500">No CV</span>
          ),
      },

      {
        Header: "Actions",
        Cell: ({ row }) => (
          <div className="d-flex justify-content-center">
            <button
              className="btn btn-sm btn-danger"
              onClick={() => handleDeleteCV(row.original)}
            >
              <Icon icon="mdi:delete" />
            </button>
          </div>
        ),
      },
    ],
    [page]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
    setGlobalFilter,
  } = useTable({ columns, data }, useGlobalFilter, useSortBy);

  return (
    <div>
      <div
        className="card basic-data-table"
        style={{ minHeight: "65vh", display: "flex", flexDirection: "column" }}
      >
        <ToastContainer />

        {/* Header */}
        <div className="card-header d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
          <h5 className="card-title mb-0 flex-shrink-0 w-35 w-md-100 w-sm-100">
            CVs
          </h5>
        </div>

        {/* Table + Pagination */}
        <div className="card-body p-0 d-flex flex-column flex-grow-1">
          {loading ? (
            <div className="text-center p-4">Loading...</div>
          ) : rows.length === 0 ? (
            <div className="text-center p-4">No cvs found</div>
          ) : (
            <div className="d-flex flex-column flex-grow-1">
              {/* Table */}
              <div className="table-responsive flex-grow-1">
                <table
                  className="table bordered-table mb-0"
                  {...getTableProps()}
                >
                  <thead>
                    {headerGroups.map((headerGroup) => (
                      <tr
                        {...headerGroup.getHeaderGroupProps()}
                        key={headerGroup.id}
                      >
                        {headerGroup.headers.map((column) => (
                          <th
                            {...column.getHeaderProps(
                              column.getSortByToggleProps()
                            )}
                            key={column.id}
                            className="text-center align-middle px-3 py-2"
                          >
                            {column.render("Header")}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>

                  <tbody {...getTableBodyProps()}>
                    {rows.map((row) => {
                      prepareRow(row);
                      return (
                        <tr
                          {...row.getRowProps()}
                          key={row.original._id || row.id}
                          className="hover:bg-gray-50 transition"
                        >
                          {row.cells.map((cell) => (
                            <td
                              {...cell.getCellProps()}
                              key={cell.column.id}
                              className="text-center align-middle px-3 py-2"
                            >
                              {cell.render("Cell")}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="d-flex justify-content-end mt-auto px-3 py-3">
                <ul className="pagination mb-0">
                  <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                    <button
                      className="page-link"
                      onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    >
                      Prev
                    </button>
                  </li>
                  {[...Array(totalPages).keys()].map((p) => (
                    <li
                      key={p}
                      className={`page-item ${p + 1 === page ? "active" : ""}`}
                    >
                      <button
                        className="page-link"
                        onClick={() => setPage(p + 1)}
                      >
                        {p + 1}
                      </button>
                    </li>
                  ))}
                  <li
                    className={`page-item ${
                      page === totalPages ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() =>
                        setPage((prev) => Math.min(prev + 1, totalPages))
                      }
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>

        <DeleteModal
          show={showDeleteModal}
          handleClose={() => setShowDeleteModal(false)}
          item={selectedCV}
          itemType="cv"
          fetchData={fetchCvs}
        />
      </div>
    </div>
  );
};

export default CvLayer;
