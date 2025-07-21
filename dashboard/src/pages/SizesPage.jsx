import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import SizesLayer from "../components/SizesLayer.jsx";

const SizesPage = () => {
    return (
        <MasterLayout>
            <Breadcrumb title="Sizes"/>
           
           <SizesLayer />
        </MasterLayout>
    );
}

export default SizesPage;