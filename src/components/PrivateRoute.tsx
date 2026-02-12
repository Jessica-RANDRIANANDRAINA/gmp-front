import { Navigate, useLocation } from "react-router-dom";
import { ReactNode } from "react";

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const location = useLocation();
  const isAuthenticated = localStorage.getItem("_au_pr"); // Utilisez le même token partout

  if (!isAuthenticated) {
    // Retournez directement le composant Navigate
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;
// import { Navigate } from "react-router-dom";
// import { isAuthenticated } from "../utils/auth";
// import { ReactNode } from "react";

// interface PrivateRouteProps {
//   children: ReactNode; // Typage explicite pour children
// }

// const PrivateRoute = ({ children }: PrivateRouteProps) => {
//   return isAuthenticated() ? children : <Navigate to="/" replace  />;
// };

// export default PrivateRoute;
