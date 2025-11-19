import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Accounts from './pages/Accounts';
import Transactions from './pages/Transactions';
import ManageUsers from './pages/ManageUsers';
import ManageBanks from './pages/ManageBanks';
import AboutUs from './pages/AboutUs';
import Plans from './pages/Plans';
import FAQ from './pages/FAQ';
import ContactUs from './pages/ContactUs';
import useAuthStore from './Store/useAuthStore';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="container-fluid">
          <div className="row">
            {isAuthenticated && (
              <div className="col-md-3 col-lg-2 d-md-block bg-light sidebar">
                <Sidebar />
              </div>
            )}
            <main className={isAuthenticated ? "col-md-9 col-lg-10 main-content" : "col-12 main-content"}>
              <Routes>
                <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
                <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} />
                <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
                
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/accounts" element={<ProtectedRoute><Accounts /></ProtectedRoute>} />
                <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
                <Route path="/manage-users" element={<ProtectedRoute adminOnly><ManageUsers /></ProtectedRoute>} />
                <Route path="/manage-banks" element={<ProtectedRoute adminOnly><ManageBanks /></ProtectedRoute>} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/plans" element={<Plans />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/contact" element={<ContactUs />} />
              </Routes>
            </main>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;