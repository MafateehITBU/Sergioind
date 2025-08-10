import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import SignIn from "./pages/Auth/SignIn";

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
        <Route path="/login" element={<SignIn />} />
      </Routes>
    </>
  );
};

export default App;
