import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import CvLayer from "../components/CvLayer";

const CvPage = () => {
  return (
    <MasterLayout>
      <Breadcrumb title="CV's" />

      <CvLayer />
    </MasterLayout>
  );
};

export default CvPage;
