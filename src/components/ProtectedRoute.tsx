import { JSX } from "solid-js";
import { Navigate } from "@solidjs/router";

interface ProtectedRouteProps {
  allowed: boolean;
  redirect: string;
  children: JSX.Element;
}

const ProtectedRoute = (props: ProtectedRouteProps) => {
  return props.allowed ? props.children : <Navigate href={props.redirect} />;
};

export default ProtectedRoute;
