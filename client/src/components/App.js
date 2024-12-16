import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from './Login';
import SignUp from './SignUp';
import CreateBoard from './CreateBoard';
import ViewBoard from './ViewBoard';
import EditBoard from './EditBoard';
import NavBar from './NavBar';

function App() {
  return (
    <Router>
      <div className="App">
        <Toaster />
        {/* NavBar is placed outside the Routes */}
        <NavBar />
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/create-board/:boardType" element={<CreateBoard />} />
          <Route path="/boards/:id" element={<ViewBoard />} />
          <Route path="/edit-board" element={<EditBoard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
