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
import ApplicantProfile from "./components/ApplicantProfile";
import EmployerProfile from "./components/EmployerProfile";
import Dashboard from "./pages/Dashboard";
import EmployerDetails from "./pages/EmployerDetails";
import ApplicantDetails from "./pages/ApplicantDetails";
import { Provider } from "react-redux";
import { store } from "./app/store";
import JobForm from "./components/JobForm";

function App() {
  return (
    <Provider store={store}>
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
          <Route
            path="/applicant-profile"
            element={
              <ProtectedRoute>
                <ApplicantProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employer-profile"
            element={
              <ProtectedRoute>
                <EmployerProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employer-details"
            element={
              <ProtectedRoute>
                <EmployerDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/applicant-details"
            element={
              <ProtectedRoute>
                <ApplicantDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/job-form"
            element={
              <ProtectedRoute>
                <JobForm />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Provider>
  );
}

export default App;
