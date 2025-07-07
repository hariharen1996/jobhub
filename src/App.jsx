import { useState } from "react";
import Navbar from "./components/Navbar";
import "./App.css";
import { Route, Router, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthorizedRoute from "./components/AuthorizedRoute";

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/register"
          element={
            <AuthorizedRoute>
              <Register />
            </AuthorizedRoute>
          }
        />
        <Route
          path="/login"
          element={
            <AuthorizedRoute>
              <Login />
            </AuthorizedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
