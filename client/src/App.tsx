import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { AuthProvider } from './contexts/AuthContext';
import GlobalStyle from './styles/GlobalStyle';
import theme from './styles/theme';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import InsurancePlansPage from './pages/InsurancePlansPage';
import QuotePage from './pages/QuotePage';
import PurchasePage from './pages/PurchasePage';
import DashboardPage from './pages/DashboardPage';
import PoliciesPage from './pages/PoliciesPage';
import ClaimsPage from './pages/ClaimsPage';
import PaymentHistoryPage from './pages/PaymentHistoryPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <AuthProvider>
        <Router>
          <div className="App">
            <Navbar />
            <main>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/insurance-plans" element={<InsurancePlansPage />} />
                <Route path="/quote" element={<QuotePage />} />

                {/* Protected Routes */}
                <Route path="/purchase" element={
                  <ProtectedRoute>
                    <PurchasePage />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                } />
                <Route path="/policies" element={
                  <ProtectedRoute>
                    <PoliciesPage />
                  </ProtectedRoute>
                } />
                <Route path="/claims" element={
                  <ProtectedRoute>
                    <ClaimsPage />
                  </ProtectedRoute>
                } />
                <Route path="/payments" element={
                  <ProtectedRoute>
                    <PaymentHistoryPage />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
