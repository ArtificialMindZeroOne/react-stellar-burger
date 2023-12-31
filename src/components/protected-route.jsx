import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { home } from "../utils/constants";

const Protected = ({ onlyUnAuth = false, component }) => {
  const isAuthChecked = useSelector((state) => state.rootReducer.userReducer.isAuthChecked);
  const user = useSelector((state) => state.rootReducer.userReducer.user);
  const location = useLocation();

  if (!isAuthChecked) {
    return null;
  }

  if (onlyUnAuth && user) {
    const { from } = location.state || { from: { pathname: home } };
    return <Navigate to={from} />
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return (component);
};

export const OnlyAuth = Protected;
export const OnlyUnAuth = ({ component }) => (
  <Protected onlyUnAuth={true} component={component} />
);