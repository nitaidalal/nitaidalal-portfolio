import { Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import useAuth from "./hooks/useAuth";
import useScrollTop from "./hooks/useScrollTop";

// public
import Home from "./pages/public/Home";
import AllProjects from "./pages/public/AllProjects";

// admin
import AdminLogin from "./pages/admin/AdminLogin";
import Dashboard from "./pages/admin/Dashboard";
import ManageProjects from "./pages/admin/ManageProjects";
import ManageSkills from "./pages/admin/ManageSkills";
import ManageEducation from "./pages/admin/ManageEducation";
import ManageCertifications from "./pages/admin/ManageCertifications";
import ManageAchievements from "./pages/admin/ManageAchievements";
import ManageProfile from "./pages/admin/ManageProfile";
import ManageMessages from "./pages/admin/ManageMessages";
import ChatWidget from "./components/chat/ChatWidget";
import ProjectDetail from "./pages/public/ProjectDetail";


import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import AdminLayout from "./components/admin/layout/AdminLayout";

import { Toaster } from "sonner"; 
import CursorSpotlight from "./components/shared/CursorSpotlight";

const ProtectedRoute = ({ children }) => {
  const { admin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div
          className="w-8 h-8 border-2 border-primary border-t-transparent
                        rounded-full animate-spin"
        />
      </div>
    );
  }

  return admin ? children : <Navigate to="/admin/login" replace />;
};

const PublicLayout = ({ children }) => (
  <>
    <Navbar />
    <main>{children}</main>
    <Footer />
  </>
);

const App = () => {
  useScrollTop();

  return (
    <>
      <Toaster
        position="top-right"
        richColors
        toastOptions={{
          style: {
            background: "var(--card)",
            color: "var(--card-foreground)",
            border: "1px solid var(--border)",
            borderRadius: "12px",
          }
        }}
      />
      <CursorSpotlight />
      <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* ── Public routes ───────────────────────── */}
        <Route
          path="/"
          element={
            <PublicLayout>
              <Home />
            </PublicLayout>
          }
        />
        <Route
          path="/projects"
          element={
            <PublicLayout>
              <AllProjects />
            </PublicLayout>
          }
        />
        <Route
          path="/projects/:id"
          element={
            <PublicLayout>
              <ProjectDetail />
            </PublicLayout>
          }
        />

        {/* ── Admin login ─────────────────────────── */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* ── Protected admin routes ──────────────── */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile" element={<ManageProfile />} />
          <Route path="projects" element={<ManageProjects />} />
          <Route path="skills" element={<ManageSkills />} />
          <Route path="education" element={<ManageEducation />} />
          <Route path="certifications" element={<ManageCertifications />} />
          <Route path="achievements" element={<ManageAchievements />} />
          <Route path="messages" element={<ManageMessages />} />
        </Route>

        {/* ── 404 ─────────────────────────────────── */}
        <Route
          path="*"
          element={
            <div
              className="min-h-screen bg-background flex items-center
                        justify-center text-foreground"
            >
              <div className="text-center">
                <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
                <p className="text-muted-foreground">Page not found</p>
                <a
                  href="/"
                  className="mt-6 inline-block bg-primary text-primary-foreground
                          px-6 py-2.5 rounded-lg text-sm font-medium
                          hover:opacity-90 transition-opacity"
                >
                  Go Home
                </a>
              </div>
            </div>
          }
        />
      </Routes>
      </AnimatePresence>
      <ChatWidget />
    </>
  );
};

export default App;
