import { ethers } from "ethers";
import { useWeb3Contract } from "react-moralis";
import { useOutletContext } from "react-router-dom";

export function useFundCampaign(id, amount) {
  const { address, abi } = useOutletContext();
  const { runContractFunction: donateCampaign } = useWeb3Contract({
    abi: abi,
    contractAddress: address,
    functionName: "donate",
    msgValue: amount ? ethers.utils.parseEther(`${amount}`) : "",
    params: { _id: id },
  });
  return { donateCampaign };
}
