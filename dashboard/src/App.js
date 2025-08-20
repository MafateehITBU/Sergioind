import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RouteScrollToTop from "./helper/RouteScrollToTop";
import SignInPage from "./pages/SignInPage";
import HomePageTen from "./pages/HomePageTen";
import ProfilePage from "./pages/ProfilePage";
import AdminPage from "./pages/AdminsPage";
import UsersPage from "./pages/UsersPage";
import CategoriesPage from "./pages/CategoriesPage";
import FlavorsPage from "./pages/FlavorsPage";
import ProductsPage from "./pages/ProductsPage";
import QuotationPage from "./pages/QuotationPage";
import FileCenterPage from "./pages/FileCenterPage";
import ContactUsPage from "./pages/ContactUsPage";
import GalleryPage from "./pages/GalleryPage";
import VideoGalleryPage from "./pages/VideoGalleryPage";
import PostsPage from "./pages/PostsPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import ForgotPasswordLayer from "./components/ForgotPasswordLayer";
import { useAuth } from './context/AuthContext';
import ProtectedRoute from "./components/ProtectedRoutes";

function App() {
  const { user } = useAuth(); // use your context to get user

  return (
    <BrowserRouter>
      <RouteScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordLayer />} />

        {/* Protected Route for Admins and SuperAdmins */}
        <Route
          path="/"
          element={
            <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
              <HomePageTen />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={<ProfilePage />}
        />

        <Route
          path="/admins"
          element={
            <ProtectedRoute allowedRoles={['superadmin']}>
              <AdminPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/users"
          element={
            <ProtectedRoute allowedRoles={['admin', 'superadmin']} >
              <UsersPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/categories"
          element={
            <ProtectedRoute allowedRoles={['admin', 'superadmin']} >
              <CategoriesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/flavors"
          element={
            <ProtectedRoute allowedRoles={['admin', 'superadmin']} >
              <FlavorsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/products"
          element={
            <ProtectedRoute allowedRoles={['admin', 'superadmin']} >
              <ProductsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/quotations"
          element={
            <ProtectedRoute allowedRoles={['admin', 'superadmin']} >
              <QuotationPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/files"
          element={
            <ProtectedRoute allowedRoles={['admin', 'superadmin']} >
              <FileCenterPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/contact-us"
          element={
            <ProtectedRoute allowedRoles={['admin', 'superadmin']} >
              <ContactUsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/gallery"
          element={
            <ProtectedRoute allowedRoles={['admin', 'superadmin']} >
              <GalleryPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/videoGallery"
          element={
            <ProtectedRoute allowedRoles={['admin', 'superadmin']} >
              <VideoGalleryPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/posts"
          element={
            <ProtectedRoute allowedRoles={['admin', 'superadmin']} >
              <PostsPage />
            </ProtectedRoute>
          }
        />

        {/* Unauthorized access */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* Catch all route */}
        <Route
          path="*"
          element={
            user ? (
              <Navigate to="/" replace />
            ) : (
              <Navigate to="/sign-in" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;