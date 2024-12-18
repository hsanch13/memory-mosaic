import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import Login from './Login';
import Logout from './Logout';
import SignUp from './SignUp';
import Dashboard from './Dashboard';
import NavBar from './NavBar';
import CreateBoard from './CreateBoard';
import EditBoard from './EditBoard';
import TestLayouts from './testLayouts';
import BoardForm from './BoardForm';
import BoardBuilder from './BoardBuilder';

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in on page load
    const checkSession = async () => {
      try {
        const response = await fetch("/current-user", {
          credentials: "include",
        });
        if (response.ok) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (err) {
        console.error("Session error:", err);
        setIsLoggedIn(false);
      }
    };

    checkSession();
  }, []);

  const ProtectedRoute = ({ children }) => {
    if (!isLoggedIn) {
      toast.error("Please log in to access this page.");
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <div className="App">
      {/* use below to see layouts */}
      {/* <BoardBuilder boardType="birthday" />
      <BoardBuilder boardType="yearly" />
      <BoardBuilder boardType="other" />
      <BoardBuilder boardType="celebration" /> */}
      <Toaster />
      <NavBar />
      <Routes>
        {/* Auth Routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/dashboard" />} />
        <Route path="/create-board" element={<CreateBoard />} />
        <Route path="/create-board/:boardType" element={<BoardForm />} />

        {/* Main Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-board" element={<CreateBoard />} />
        <Route path="/edit-board/:id" element={<EditBoard />} />

        {/* Dynamic Route for Board Viewing */}
        {/* <Route
            path="/boards/:boardType/:id"
            element={<BoardBuilderWrapper />}
          /> */}
        <Route path="/test-layouts" element={<TestLayouts />} />

        {/* Catch-All Route */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </div>
  );
}

export default App;