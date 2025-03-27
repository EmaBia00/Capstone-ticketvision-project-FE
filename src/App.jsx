import React from "react";
import { Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import FilmDetail from "./pages/FilmDetail";
import Prenotazione from "./pages/Prenotazione";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminPanel from "./pages/AdminPanel";
import AdminRoute from "./components/AdminRoute";
import NavbarComponent from "./components/NavbarComponent";
import FooterComponent from "./components/FooterComponent";
import PrivateRoute from "./components/PrivateRoute";
import AuthLoader from "./components/AuthLoader";
import SearchPage from "./pages/SearchPage";
import Profile from "./pages/Profile";

function App() {
  return (
    <div>
      {/* Navbar */}
      <NavbarComponent />

      {/* Main */}
      <AuthLoader>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/film/:id" element={<FilmDetail />} />
          <Route path="/prenotazione/:spettacoloId" element={<Prenotazione />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminPanel />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </AuthLoader>

      {/* Footer */}
      <FooterComponent />
    </div>
  );
}

export default App;
