import { Suspense } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { lazyImport } from "../utils/Apputils";

const { Dashboard } = lazyImport(
  () => import("../pages/dashboard"),
  "Dashboard"
);

const User = () => {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          <p>Loading... Please wait</p>
        </div>
      }
    >
      <Outlet />
    </Suspense>
  );
};

export const ProtectedRoutes = [
  {
    path: "",
    element: <User />,
    children: [
      { path: "", element: <Navigate to="/dashboard" /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "/*", element: <Navigate to="." /> },
    ],
  },
];
