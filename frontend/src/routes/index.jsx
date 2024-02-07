import { useRoutes, useNavigate } from "react-router-dom";

import { ProtectedRoutes } from "./Protected";
import { PublicRoutes } from "./Public";
import { useMoralis } from "react-moralis";
import Addresses from "../constants/addresses.json";
import { useEffect } from "react";

export const AppRoutes = () => {
  const { account, chainId: chainIdHex } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const navigate = useNavigate();
  const routingCondition =
    account && Object.keys(Addresses).includes(`${chainId}`);

  useEffect(() => {
    if (!routingCondition) {
      navigate("/notice");
    } else {
      navigate("/dashboard");
    }
  }, [chainId, account]);

  const routes = routingCondition ? ProtectedRoutes : PublicRoutes;

  const element = useRoutes([...routes]);

  return <>{element}</>;
};
