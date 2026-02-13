import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Layout from "./layouts/Layout";
import AuthLayout from "./layouts/AuthLayout";
import ScrollToTop from "./components/ScrollToTop";
import { Toaster } from "./components/ui/toaster";
import { SignIn, SignUp, useUser, useAuth } from "@clerk/clerk-react";
import AddHotel from "./pages/AddHotel";
import MyHotels from "./pages/MyHotels";
import EditHotel from "./pages/EditHotel";
import Search from "./pages/Search";
import Detail from "./pages/Detail";
import Booking from "./pages/Booking";
import MyBookings from "./pages/MyBookings";
import Home from "./pages/Home";
import ApiDocs from "./pages/ApiDocs";
import ApiStatus from "./pages/ApiStatus";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import ProtectedRoute from "./components/ProtectedRoute";
import Onboarding from "./pages/Onboarding";

const RoleGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoaded: userLoaded } = useUser();
  const { isSignedIn, isLoaded: authLoaded } = useAuth();

  if (!userLoaded || !authLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-amber-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-amber-900 font-medium font-serif italic text-lg animate-pulse">
            Verifying your luxury session...
          </p>
        </div>
      </div>
    );
  }

  const role = user?.publicMetadata?.role;
  const isOnboarding = window.location.pathname === "/onboarding";

  if (isSignedIn && !role && !isOnboarding) {
    return <Navigate to="/onboarding" />;
  }

  return <>{children}</>;
};

const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <RoleGuard>
        <Routes>
          <Route
            path="/"
            element={
              <Layout>
                <Home />
              </Layout>
            }
          />
          <Route
            path="/onboarding"
            element={<Onboarding />}
          />
          <Route
            path="/search"
            element={
              <Layout>
                <Search />
              </Layout>
            }
          />
          <Route
            path="/detail/:hotelId"
            element={
              <Layout>
                <Detail />
              </Layout>
            }
          />
          <Route
            path="/api-docs"
            element={
              <Layout>
                <ApiDocs />
              </Layout>
            }
          />
          <Route
            path="/api-status"
            element={
              <Layout>
                <ApiStatus />
              </Layout>
            }
          />
          <Route
            path="/analytics"
            element={
              <Layout>
                <AnalyticsDashboard />
              </Layout>
            }
          />
          <Route
            path="/register"
            element={
              <AuthLayout>
                <div className="flex items-center justify-center py-10">
                  <SignUp signInUrl="/sign-in" />
                </div>
              </AuthLayout>
            }
          />
          <Route
            path="/sign-in"
            element={
              <AuthLayout>
                <div className="flex items-center justify-center py-10">
                  <SignIn signUpUrl="/register" />
                </div>
              </AuthLayout>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/hotel/:hotelId/booking"
            element={
              <ProtectedRoute>
                <Layout>
                  <Booking />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-hotel"
            element={
              <ProtectedRoute allowedRoles={["hotel_owner", "admin"]}>
                <Layout>
                  <AddHotel />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-hotel/:hotelId"
            element={
              <ProtectedRoute allowedRoles={["hotel_owner", "admin"]}>
                <Layout>
                  <EditHotel />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-hotels"
            element={
              <ProtectedRoute allowedRoles={["hotel_owner", "admin"]}>
                <Layout>
                  <MyHotels />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute allowedRoles={["user", "admin"]}>
                <Layout>
                  <MyBookings />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Layout>
                  <Profile />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Layout>
                  <Admin />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </RoleGuard>
      <Toaster />
    </Router>
  );
};

export default App;
