import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminRoute = () => {
  const { role, token } = useSelector((state) => state.auth);

  const isAdmin = role === "ADMIN" || localStorage.getItem("role") === "ADMIN";
  const isAuthenticated = token || localStorage.getItem("token");

  if (!isAuthenticated) return <Navigate to="/login" />;
  if (!isAdmin) return <Navigate to="/" />;

  return <Outlet />;
};

export default AdminRoute;
