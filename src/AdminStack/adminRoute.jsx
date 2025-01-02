import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminRoute = ({ children, allowedRoles }) => {
  const { token, role } = useSelector((state) => state.auth);
  console.log(token, role);

  if (!token || !allowedRoles.includes(role)) {
    // If token is not available, redirect to login page
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
