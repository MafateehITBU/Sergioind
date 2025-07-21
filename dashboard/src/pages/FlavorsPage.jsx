import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import FlavorsLayer from "../components/FlavorsLayer.jsx";

const FlavorsPage = () => {
    return (
        <MasterLayout>
            <Breadcrumb title="Flavors"/>
           
           <FlavorsLayer />
        </MasterLayout>
    );
}

export default FlavorsPage;