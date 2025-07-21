import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import FileCenterLayer from "../components/FileCenterLayer.jsx";

const FileCenterPage = () => {
    return (
        <MasterLayout>
            <Breadcrumb title="Files Center"/>
           
           <FileCenterLayer />
        </MasterLayout>
    );
}

export default FileCenterPage;