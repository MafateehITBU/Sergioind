import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import ProductsLayer from "../components/ProductsLayer";

const ProductsPage = () => {
    return (
        <MasterLayout>
            <Breadcrumb title="Products"/>
           
           <ProductsLayer />
        </MasterLayout>
    );
}

export default ProductsPage;