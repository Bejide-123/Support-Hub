
import HeroSection from './components/Hero';
import KnowledgeBaseSection from './components/KnowledgeBase';
import FAQSection from './components/FAQsection';
import ContactSection from './components/Contact';
import Footer from './components/Footer';
import { Route, Routes } from 'react-router-dom';
import UserDashboard from './pages/UserDashboard';
import TicketsPage from './pages/TicketsPage';
import TicketDetailPage from './pages/TicketDetailsPage';
import HelpCenterPage from './pages/HelpCenterPage';
import AgentDashboard from './pages/AgentDashboard';
import AgentTicketQueue from './pages/AgentTicketsPage';
// import AgentTicketDetailPage from './pages/AgentTicketDetails';
// import CustomerProfilePage from './pages/CustomerPage';
import Analytics from './pages/Analytics';
import AgentSettings from './pages/Settings';
import UserProfilePage from './pages/UserProfile';
import UserSettingsPage from './pages/UserSettings';
import AgentProfilePage from './pages/AgentProfile';
import LoginPage from './pages/Login';
import SignupPage from './pages/SignUp';
import ForgotPasswordPage from './pages/Forgot';
import CustomerListPage from './pages/CustomerList';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={
        <>
          <HeroSection />
          <KnowledgeBaseSection />
          <FAQSection />
          <ContactSection />
          <Footer />
        </>
      } />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot" element={<ForgotPasswordPage />} />
      <Route path="/dashboard" element={<UserDashboard />} />
      <Route path="/tickets" element={<TicketsPage />} />
      <Route path="/ticket-details" element={<TicketDetailPage />} />
      <Route path='/faq' element={<HelpCenterPage />} />
      <Route path='/profile' element={<UserProfilePage />} />
      <Route path='/settings' element={<UserSettingsPage/>} />
      <Route path='/agent/dashboard' element={<AgentDashboard />} />
      <Route path='/agent/tickets' element={<AgentTicketQueue />} />
      {/* <Route path='/agent/tickets-details' element={<AgentTicketDetailPage />} /> */}
      <Route path='/agent/customers' element={<CustomerListPage />} />
      {/* <Route path='/agent/customers/:id' element={<CustomerProfilePage />} /> */}

      <Route path='/agent/analytics' element={<Analytics />} />
      <Route path='/agent/profile' element={<AgentProfilePage />} />
      <Route path='/agent/settings' element={<AgentSettings />} />
    </Routes>
  )
}

export default App
