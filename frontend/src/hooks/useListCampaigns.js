import { useWeb3Contract } from "react-moralis";
import { useOutletContext } from "react-router-dom";

export const useListCampaign = () => {
  const { address, abi } = useOutletContext();
  const { runContractFunction: listCampaigns } = useWeb3Contract({
    abi: abi,
    contractAddress: address,
    functionName: "getCampaigns",
    params: {},
  });
  return { listCampaigns };
};
