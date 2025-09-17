// components/ProtectedRoute.js
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token"); // check if user is logged in
  if (!token) return <Navigate to="/login" />; // redirect if not
  return children; // render the child component if logged in
}
