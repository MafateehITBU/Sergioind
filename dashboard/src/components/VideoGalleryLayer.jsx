import React, { useEffect, useState } from "react";
import { useTable, useGlobalFilter, useSortBy } from "react-table";
import { Icon } from "@iconify/react";
import axiosInstance from "../axiosConfig.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaSortUp, FaSortDown, FaSort } from "react-icons/fa";
import CreateVideoGallery from "./modals/VideoGallery/CreateVideoGallery.jsx";
import UpdateVideoGallery from "./modals/VideoGallery/UpdateVideoGallery.jsx";
import DeleteModal from "./modals/DeleteModal.jsx";

const GlobalFilter = ({ globalFilter, setGlobalFilter }) => (
  <input
    className="form-control w-100"
    value={globalFilter || ""}
    onChange={(e) => setGlobalFilter(e.target.value)}
    placeholder="Search Video Gallery..."
  />
);

const VideoGalleryLayer = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showVideoModal, setShowVideoModal] = React.useState(false);
  const [currentVideoId, setCurrentVideoId] = React.useState(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  const pageSize = 10;

  useEffect(() => {
    fetchVideos();
  }, [page, search]);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/video-gallery", {
        params: { page, limit: pageSize, search },
      });
      setVideos(res.data.data || []);
      setTotalPages(res.data.pagination?.totalPages || 1);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch data");
      setLoading(false);
    }
  };

  function getYouTubeId(url) {
    try {
      const parsedUrl = new URL(url);

      if (parsedUrl.hostname.includes("youtu.be")) {
        // Strip out query params
        return parsedUrl.pathname.slice(1).split("?")[0];
      }

      if (parsedUrl.hostname.includes("youtube.com")) {
        if (parsedUrl.searchParams.has("v")) {
          return parsedUrl.searchParams.get("v");
        }
        if (parsedUrl.pathname.startsWith("/embed/")) {
          return parsedUrl.pathname.split("/embed/")[1].split("?")[0];
        }
      }
    } catch (e) {
      return null;
    }
    return null;
  }

  const openVideoModal = (videoUrl) => {
    const videoId =
      videoUrl.split("v=")[1]?.split("&")[0] || videoUrl.split("/").pop();
    setCurrentVideoId(videoId);
    setShowVideoModal(true);
  };

  const closeVideoModal = () => {
    setShowVideoModal(false);
    setCurrentVideoId(null);
  };

  const handleAddVideo = () => setShowAddModal(true);
  const handleUpdateVideo = (video) => {
    setSelectedVideo(video);
    setShowUpdateModal(true);
  };
  const handleDeleteVideo = (video) => {
    setSelectedVideo(video);
    setShowDeleteModal(true);
  };

  const handleActivation = async (videoId) => {
    try {
      const res = await axiosInstance.put(
        `/video-gallery/${videoId}/toggle-active`
      );
      toast.success(res.data.message, { position: "top-right" });
      fetchVideos();
    } catch (error) {
      toast.error("Failed to Toggle Activation.", { position: "top-right" });
    }
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "#",
        Cell: ({ row }) => (page - 1) * pageSize + row.index + 1,
      },
      { Header: "Title", accessor: "title" },
      {
        Header: "Video",
        accessor: "videoUrl",
        Cell: ({ value }) => {
          const videoId = getYouTubeId(value);
          if (!videoId) return null;

          const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

          return (
            <img
              src={thumbnailUrl}
              alt="Video Thumbnail"
              style={{
                width: "120px",
                height: "80px",
                objectFit: "cover",
                borderRadius: "6px",
                cursor: "pointer",
              }}
              onClick={() => openVideoModal(value)}
            />
          );
        },
      },
      {
        Header: "is Active",
        accessor: "isActive",
        Cell: ({ row, value }) => {
          const galleryId = row.original._id;
          const badgeColor = value ? "success" : "danger";
          const badgeText = value ? "Active" : "De-Activated";

          return (
            <div className="dropdown">
              <span
                className={`badge bg-${badgeColor} dropdown-toggle`}
                data-bs-toggle="dropdown"
                role="button"
                style={{ cursor: "pointer" }}
              >
                {badgeText}
              </span>
              <ul className="dropdown-menu">
                {value !== true && (
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => handleActivation(galleryId)}
                    >
                      Activate
                    </button>
                  </li>
                )}
                {value !== false && (
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => handleActivation(galleryId)}
                    >
                      De-Activate
                    </button>
                  </li>
                )}
              </ul>
            </div>
          );
        },
      },
      {
        Header: "Actions",
        Cell: ({ row }) => (
          <div className="d-flex gap-2">
            <button
              className="btn btn-sm btn-primary"
              onClick={() => handleUpdateVideo(row.original)}
            >
              <Icon icon="mdi:pencil" />
            </button>
            <button
              className="btn btn-sm btn-danger"
              onClick={() => handleDeleteVideo(row.original)}
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
  } = useTable({ columns, data: videos }, useGlobalFilter, useSortBy);

  useEffect(() => {
    setGlobalFilter(search);
  }, [search, setGlobalFilter]);

  return (
    <div className="card basic-data-table" style={{ minHeight: "65vh" }}>
      <ToastContainer />
      <div className="card-header d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
        <h5 className="card-title mb-0 flex-shrink-0 w-35 w-md-100 w-sm-100">
          Video Gallery
        </h5>
        <div className="w-35 w-md-100 w-sm-100">
          <GlobalFilter globalFilter={search} setGlobalFilter={setSearch} />
        </div>
        <div className="w-35 w-md-100 w-sm-100">
          <button
            className="btn btn-success w-100 w-md-auto"
            onClick={handleAddVideo}
          >
            <span className="ms-1">Add New Video</span>
          </button>
        </div>
      </div>

      <div className="card-body p-0 d-flex flex-column">
        {loading ? (
          <div className="text-center p-4">Loading...</div>
        ) : videos.length === 0 ? (
          <div className="text-center p-4">No videos found</div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="table bordered-table mb-0" {...getTableProps()}>
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
                          style={{ textAlign: "center", whiteSpace: "nowrap" }}
                        >
                          {column.render("Header")}{" "}
                          {column.isSorted ? (
                            column.isSortedDesc ? (
                              <FaSortDown />
                            ) : (
                              <FaSortUp />
                            )
                          ) : (
                            <FaSort style={{ opacity: 0.3 }} />
                          )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                  {rows.map((row) => {
                    prepareRow(row);
                    return (
                      <tr {...row.getRowProps()} key={row.id}>
                        {row.cells.map((cell) => (
                          <td
                            {...cell.getCellProps()}
                            key={cell.column.id}
                            style={{
                              textAlign: "center",
                              verticalAlign: "middle",
                              whiteSpace: "nowrap",
                            }}
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

            {/* Backend Pagination */}
            <div className="d-flex justify-content-end mt-auto px-3 pb-4">
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
          </>
        )}
      </div>
      {/* Show Youtube Video Modal */}
      {showVideoModal && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          tabIndex="-1"
          onClick={closeVideoModal}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Video Preview</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeVideoModal}
                ></button>
              </div>
              <div className="modal-body" style={{ padding: 0 }}>
                {currentVideoId && (
                  <iframe
                    width="100%"
                    height="315"
                    src={`https://www.youtube.com/embed/${currentVideoId}`}
                    title="YouTube video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <CreateVideoGallery
        show={showAddModal}
        handleClose={() => setShowAddModal(false)}
        fetchVideos={fetchVideos}
      />

      <UpdateVideoGallery
        show={showUpdateModal}
        handleClose={() => setShowUpdateModal(false)}
        video={selectedVideo}
        fetchVideos={fetchVideos}
      />

      <DeleteModal
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        item={selectedVideo}
        itemType="video-gallery"
        fetchData={fetchVideos}
      />
    </div>
  );
};

export default VideoGalleryLayer;
