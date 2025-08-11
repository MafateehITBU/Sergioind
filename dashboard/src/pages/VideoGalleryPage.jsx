import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import VideoGalleryLayer from "../components/VideoGalleryLayer.jsx";

const VideoGalleryPage = () => {
    return (
        <MasterLayout>
            <Breadcrumb title="Video Gallery"/>
           
           <VideoGalleryLayer />
        </MasterLayout>
    );
}

export default VideoGalleryPage;