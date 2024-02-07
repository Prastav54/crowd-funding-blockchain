import { Suspense } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { lazyImport } from "../utils/Apputils";
import { useMoralis } from "react-moralis";
import Abi from "../constants/abi.json";
import Addresses from "../constants/addresses.json";

const { Dashboard } = lazyImport(
  () => import("../pages/dashboard"),
  "Dashboard"
);

const User = () => {
  const { chainId: chainIdHex, account } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const address = Addresses[chainId]?.[0] || "";
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          <p>Loading... Please wait</p>
        </div>
      }
    >
      <Outlet context={{ address, chainId, account, abi: Abi }} />
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
