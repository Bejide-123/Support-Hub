import { Toaster } from 'react-hot-toast'; // Added Toaster import
import HeroSection from "./components/Hero";
import KnowledgeBaseSection from "./components/KnowledgeBase";
import FAQSection from "./components/FAQsection";
import ContactSection from "./components/Contact";
import Footer from "./components/Footer";
import { Route, Routes } from "react-router-dom";
import UserDashboard from "./pages/UserDashboard";
import TicketsPage from "./pages/TicketsPage";
import TicketDetailPage from "./pages/TicketDetailsPage";
import HelpCenterPage from "./pages/HelpCenterPage";
import AgentDashboard from "./pages/AgentDashboard";
import AgentTicketQueue from "./pages/AgentTicketsPage";
// import AgentTicketDetailPage from './pages/AgentTicketDetails';
// import CustomerProfilePage from './pages/CustomerPage';
import Analytics from "./pages/Analytics";
import AgentSettings from "./pages/Settings";
import UserProfilePage from "./pages/UserProfile";
import UserSettingsPage from "./pages/UserSettings";
import AgentProfilePage from "./pages/AgentProfile";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/SignUp";
import ForgotPasswordPage from "./pages/Forgot";
import CustomerListPage from "./pages/CustomerList";
import { Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import type { RootState } from "./store";
import { useAppSelector, useAppDispatch } from "./store/hooks";
import { useEffect } from "react";
import { getCurrentUser } from "./features/Auth/authSlice";

const App = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, initialized } = useAppSelector((state: RootState) => state.auth);
  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);
  

  if (!initialized) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <>
      <Toaster /> {/* Added Toaster component */}
      <Routes>
        {/* Public Routes - No Auth Required */}
        <Route
          path="/"
          element={
            <>
              <HeroSection />
              <KnowledgeBaseSection />
              <FAQSection />
              <ContactSection />
              <Footer />
            </>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot" element={<ForgotPasswordPage />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          {/* User Routes */}
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/tickets" element={<TicketsPage />} />
          <Route path="/ticket-details" element={<TicketDetailPage />} />
          <Route path="/faq" element={<HelpCenterPage />} />
          <Route path="/profile" element={<UserProfilePage />} />
          <Route path="/settings" element={<UserSettingsPage />} />

          {/* Agent Routes */}
          <Route path="/agent/dashboard" element={<AgentDashboard />} />
          <Route path="/agent/tickets" element={<AgentTicketQueue />} />
          {/* <Route
            path="/agent/tickets-details"
            element={
                <AgentTicketDetailPage />
            }
          /> */}
          <Route path="/agent/customers" element={<CustomerListPage />} />
          {/* <Route
            path="/agent/customers/:id"
            element={
                <CustomerProfilePage />
            }
          /> */}
          <Route path="/agent/analytics" element={<Analytics />} />
          <Route path="/agent/profile" element={<AgentProfilePage />} />
          <Route path="/agent/settings" element={<AgentSettings />} />
        </Route>

        {/* Catch-all redirect for any unmatched routes */}
        <Route path="*" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />
      </Routes>
    </>
  );
};

export default App;