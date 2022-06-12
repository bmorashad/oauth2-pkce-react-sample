import React from "react";
import { useLocation } from "react-router-dom";
import { Route } from "react-router-dom";
import { useLoginState } from "../../contexts/login.context";
import LoginPage from "../../pages/login-page";

const ProtectedRoute = ({ children, ...props }) => {
  const loginState = useLoginState();
  const location = useLocation();
  const next = location.pathname;
  return loginState.tokenData ? children : <LoginPage next={next} />;
};

export const protect = (component) => {
  return <ProtectedRoute>{component}</ProtectedRoute>;
};

export default ProtectedRoute;
