import React, { useEffect, useState } from "react";
import { Card, Button } from "react-bootstrap";
import { FaEdit } from "react-icons/fa";
import PostApplicants from "./PostApplicants";
import axiosInstance from "../axiosConfig";
import { toast, ToastContainer } from "react-toastify";
import CreatePostModal from "./modals/Post/CreatePostModal";
import UpdatePostModal from "./modals/Post/UpdatePostModal";
import DeleteModal from "./modals/DeleteModal";

const PostsLayer = () => {
  const [posts, setPosts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(3);
  const [showAddPostModal, setShowAddPostModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedUpdatePost, setSelectedUpdatePost] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axiosInstance.get("/post");
      setPosts(res.data.data);
    } catch (error) {
      console.error("Error fetching job posts:", error);
      toast.error("Failed to fetch job posts");
    }
  };

  const handleAddPost = () => setShowAddPostModal(true);

  const handleUpdatePost = async (post) => {
    setSelectedUpdatePost(post);
    setShowUpdateModal(true);
  };

  const handleDeletePost = async (post) => {
    setPostToDelete(post);
    setShowDeleteModal(true);
  };

  return (
    <div className="container py-4">
      <ToastContainer />
      {!selectedPost && (
        <div className="mb-3 d-flex justify-content-end">
          <button className="btn btn-success" onClick={handleAddPost}>
            Add New Post
          </button>
        </div>
      )}

      {selectedPost ? (
        <PostApplicants
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
        />
      ) : (
        <>
          {posts.slice(0, visibleCount).map((post) => (
            <Card key={post._id} className="mb-11 shadow-sm border-0 rounded-3">
              <Card.Body className="position-relative">
                {/* Title + Update */}
                <h5 className="fw-bold mb-3 d-flex justify-content-between align-items-center">
                  {post.title}
                  <FaEdit
                    className="text-secondary cursor-pointer"
                    onClick={() => handleUpdatePost(post)}
                  />
                </h5>

                {/* Employment Type & Location */}
                <div className="d-flex gap-2 mb-3">
                  <span className="px-3 py-1 border rounded-pill hover:border-dark transition">
                    {post.employmentType}
                  </span>
                  <span className="px-3 py-1 border rounded-pill hover:border-dark transition">
                    {post.location}
                  </span>
                </div>

                {/* Experience, Speciality, End Date */}
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

                {/* Buttons */}
                <div className="d-flex justify-content-end gap-2">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => setSelectedPost(post)}
                  >
                    Applicants
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeletePost(post)}
                  >
                    Delete
                  </Button>
                </div>
              </Card.Body>
            </Card>
          ))}

          {visibleCount < posts.length && (
            <div className="text-center mt-3">
              <Button
                variant="secondary"
                onClick={() => setVisibleCount((prev) => prev + 3)}
              >
                Show More Posts
              </Button>
            </div>
          )}
        </>
      )}

      <CreatePostModal
        show={showAddPostModal}
        handleClose={() => setShowAddPostModal(false)}
        fetchPosts={fetchPosts}
      />

      <UpdatePostModal
        show={showUpdateModal}
        handleClose={() => setShowUpdateModal(false)}
        post={selectedUpdatePost}
        fetchPosts={fetchPosts}
      />

      <DeleteModal
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        item={postToDelete}
        itemType="post"
        fetchData={fetchPosts}
      />
    </div>
  );
};

export default PostsLayer;
