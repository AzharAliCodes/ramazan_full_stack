import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Boys from './pages/Boys';
import Girls from './pages/Girls';
import NotFound from './pages/NotFound';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';

// Simple auth check
const isAuthenticated = () => {
  return !!localStorage.getItem('ramadan_current_user');
};

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }
  return children;
};

// Get redirect path based on user gender
const getHomePath = () => {
  try {
    const user = JSON.parse(localStorage.getItem('ramadan_current_user'));
    return user?.gender === 'female' ? '/girls' : '/boys';
  } catch { return '/boys'; }
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated() ? <Navigate to={getHomePath()} replace /> : <SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/boys" element={<ProtectedRoute><Boys /></ProtectedRoute>} />
        <Route path="/girls" element={<ProtectedRoute><Girls /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
