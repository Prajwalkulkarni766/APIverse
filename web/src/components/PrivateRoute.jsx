import { Navigate, useLocation } from "react-router-dom";
import { store } from "../store/store";

const PrivateRoute = ({ children }) => {
  const location = useLocation();
  const token =
    store.getState().token.token || localStorage.getItem("access_token"); // Get the token from localStorage or redux state

  if (!token) {
    // If no token is found, redirect to sign-in page and preserve the location the user came from
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return children; // If token exists, render the children (i.e., the protected route)
};

export default PrivateRoute;
