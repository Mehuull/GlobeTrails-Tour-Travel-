import { Navigate } from "react-router-dom";
import { getData } from "../../context/userContext";

const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = getData();

  if (isLoading) {
    return <div>Loading...</div>; // Or a proper spinner
  }

  if (!user) {
    // Not authenticated → redirect to login
    return <Navigate to="/signin" replace />;
  }

  // Authenticated → allow access
  return children;
};

export default ProtectedRoute;
