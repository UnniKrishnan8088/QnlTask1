import { useAuth } from "../context/auth";
import { ChildrenProps } from "../types/types";
import { Navigate } from "react-router-dom";

export default function RequireAuth({ children }: ChildrenProps) {
  const auth = useAuth();

  if (!auth?.token) {
    return <Navigate to="/login" />;
  }
  return children;
}
