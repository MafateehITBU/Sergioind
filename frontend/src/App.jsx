import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignUp from "./pages/Auth/SignUp";
import SignIn from "./pages/Auth/SignIn";
import FrogotPassword from "./pages/Auth/ForgotPassword";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Certificate from "./pages/Certificate";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Faq from "./pages/Faq";
import Career from "./pages/Career";
import Apply from "./pages/Apply";
import GalleryPhotos from "./pages/GalleryPhotos";
import GalleryVideos from "./pages/GalleryVideos";
import Profile from "./pages/Profile";


import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";

const App = () => {
  return (
    <>

      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/forgot-password" element={<FrogotPassword />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/certificate" element={<Certificate />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/careers" element={<Career />} />
        <Route path="/apply" element={<Apply />} />
        <Route path="/gallery/photos" element={<GalleryPhotos />} />
        <Route path="/gallery/videos" element={<GalleryVideos />} />

        {/* Protected Profile Route */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};

export default App;
