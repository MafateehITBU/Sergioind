import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import ContactUsLayer from "../components/ContactUsLayer.jsx";

const ContactUsPage = () => {
    return (
        <MasterLayout>
            <Breadcrumb title="Contact Us"/>
           
           <ContactUsLayer />
        </MasterLayout>
    );
}

export default ContactUsPage;