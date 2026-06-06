import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import "./index.css";

import App from "./App.jsx";
import Admin from "./Admin.jsx";

import Login from "./Login.jsx";
import Register from "./Register.jsx";

import ProtectedRoute from "./ProtectedRoute.jsx";

import {
  AuthProvider
} from "./AuthContext.jsx";

createRoot(
  document.getElementById("root")
).render(

  <StrictMode>

    <AuthProvider>

      <BrowserRouter>

        <Routes>

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <App />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />

        </Routes>

      </BrowserRouter>

    </AuthProvider>

  </StrictMode>
);