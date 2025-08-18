import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import PostsLayer from "../components/PostsLayer";

const PostsPage = () => {
  return (
    <MasterLayout>
      <Breadcrumb title="Job Posts" />

      <PostsLayer />
    </MasterLayout>
  );
};

export default PostsPage;
