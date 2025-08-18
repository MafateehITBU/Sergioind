import { useEffect, useState, useMemo } from "react";
import { useTable, useGlobalFilter, useSortBy } from "react-table";
import { Icon } from "@iconify/react";
import axiosInstance from "../axiosConfig";
import { ToastContainer, toast } from "react-toastify";
import { Card } from "react-bootstrap";
import "react-toastify/dist/ReactToastify.css";
import DeleteModal from "./modals/DeleteModal";

const GlobalFilter = ({ globalFilter, onChange }) => (
  <input
    className="form-control w-100"
    value={globalFilter || ""}
    onChange={(e) => onChange(e.target.value)}
    placeholder="Search applicants..."
  />
);

const PostApplicants = ({ post }) => {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedApp, setSelectedApp] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  const pageSize = 10;

  // Fetch applicants
  useEffect(() => {
    fetchApplicants();
  }, [post, page, search]);

  const fetchApplicants = async () => {
    if (!post?._id) return;
    setLoading(true);
    try {
      const res = await axiosInstance.get("/applicant", {
        params: {
          postId: post._id, // always filter by this post
          search: search, // optional search term
          page,
          limit: pageSize,
        },
      });

      setApplicants(res.data.data || []);
      setTotalPages(res.data.pagination?.totalPages || 1);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch applicants");
    } finally {
      setLoading(false);
    }
  };

  const data = useMemo(() => applicants, [applicants]);

  const handleDeleteApplicant = (applicant) => {
    setSelectedApp(applicant);
    setShowDeleteModal(true);
  };
  const columns = useMemo(
    () => [
      { Header: "#", Cell: ({ row }) => (page - 1) * pageSize + row.index + 1 },
      { Header: "Name", accessor: "name" },
      { Header: "Email", accessor: "email" },
      { Header: "Speciality", accessor: "speciality" },
      { Header: "Experience", accessor: "experienceYears" },
      { Header: "Gender", accessor: "gender" },
      {
        Header: "Address",
        accessor: (row) =>
          row.address?.city && row.address?.street
            ? `${row.address.city}, ${row.address.street}`
            : "-",
      },
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
          <div className="d-flex gap-2">
            <button
              className="btn btn-sm btn-danger"
              onClick={() => handleDeleteApplicant(row.original)}
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

  const handleSearchChange = (value) => {
    setSearch(value);
    setPage(1);
    setGlobalFilter(value);
  };

  return (
    <div>
      {post && (
        <Card key={post._id} className="mb-3 shadow-sm border-0 rounded-3">
          <Card.Body className="position-relative">
            <h5 className="fw-bold mb-3 d-flex justify-content-between align-items-center">
              {post.title}
            </h5>

            <div className="d-flex gap-2 mb-3">
              <span className="px-3 py-1 border rounded-pill hover:border-dark transition">
                {post.employmentType}
              </span>
              <span className="px-3 py-1 border rounded-pill hover:border-dark transition">
                {post.location}
              </span>
            </div>

            <div className="mb-3 text-gray-700">
              <p className="mb-1">
                <strong>Experience Required:</strong> {post.experienceYears}{" "}
                years
              </p>
              <p className="mb-1">
                <strong>Speciality:</strong> {post.speciality}
              </p>
              <p className="mb-1">
                <strong>End Date:</strong>{" "}
                {new Date(post.endDate).toLocaleDateString()}
              </p>
            </div>
          </Card.Body>
        </Card>
      )}

      <div
        className="card basic-data-table"
        style={{ minHeight: "65vh", display: "flex", flexDirection: "column" }}
      >
        <ToastContainer />

        {/* Header */}
        <div className="card-header d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
          <a href="/posts" className="text-blue-600">
            &larr; Back to Posts
          </a>
          <div className="w-35 w-md-100 w-sm-100">
            <GlobalFilter globalFilter={search} onChange={handleSearchChange} />
          </div>
        </div>

        {/* Table + Pagination */}
        <div className="card-body p-0 d-flex flex-column flex-grow-1">
          {loading ? (
            <div className="text-center p-4">Loading...</div>
          ) : rows.length === 0 ? (
            <div className="text-center p-4">No applicants found</div>
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
                            className="text-center px-3 py-2"
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
                              className="text-center px-3 py-2 align-middle"
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
          item={selectedApp}
          itemType="applicant"
          fetchData={fetchApplicants}
        />
      </div>
    </div>
  );
};

export default PostApplicants;
