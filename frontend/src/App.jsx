import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import SignUp from "./pages/Auth/SignUp";
import SignIn from "./pages/Auth/SignIn";
import FrogotPassword from "./pages/Auth/ForgotPassword";
import About from "./pages/About";
import Contact from './pages/Contact'
import Certificate from "./pages/Certificate";

const App = () => {
  const location = useLocation();
  const isAuthPages = ["/login", "/register", "/forgot-password"].includes(
    location.pathname
  );
  return (
    <>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/forgot-password" element={<FrogotPassword />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/certificate" element={<Certificate />} />
      </Routes>
    </>
  );
};

export default App;
