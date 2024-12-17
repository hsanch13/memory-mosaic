import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from './Login';
import SignUp from './SignUp';
import CreateBoard from './CreateBoard';
import Dashboard from './Dashboard';
import EditBoard from './EditBoard';
import NavBar from './NavBar';
import TestLayouts from './testLayouts';
import BoardBuilder from './BoardBuilder';

function App() {
  return (
    <Router>
      <div className="App">
      <BoardBuilder boardType="birthday" />
      <BoardBuilder boardType="yearly" />
      <BoardBuilder boardType="other" />
      <BoardBuilder boardType="celebration" />
        <Toaster />
        <NavBar />
        <Routes>
          {/* Authentication Routes */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

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
    </Router>
  );
}

export default App;