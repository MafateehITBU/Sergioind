import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import QuotationLayer from "../components/QuotationLayer.jsx";

const QuotationPage = () => {
    return (
        <MasterLayout>
            <Breadcrumb title="Quotations"/>
           
           <QuotationLayer />
        </MasterLayout>
    );
}

export default QuotationPage;