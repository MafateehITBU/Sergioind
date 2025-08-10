import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import GalleryLayer from "../components/GalleryLayer.jsx";

const GalleryPage = () => {
    return (
        <MasterLayout>
            <Breadcrumb title="Gallery"/>
           
           <GalleryLayer />
        </MasterLayout>
    );
}

export default GalleryPage;