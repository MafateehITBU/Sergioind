import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import SignUp from "./pages/Auth/SignUp";
import SignIn from "./pages/Auth/SignIn";
import FrogotPassword from "./pages/Auth/ForgotPassword";

const App = () => {
  const location = useLocation();
  const isAuthPages = ["/login", "/register", "/forgot-password"].includes(
    location.pathname
  );
  return (
    <>
      {!isAuthPages && <Navbar isArabic={false} />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/forgot-password" element={<FrogotPassword />} />
      </Routes>
    </>
  );
};

export default App;
