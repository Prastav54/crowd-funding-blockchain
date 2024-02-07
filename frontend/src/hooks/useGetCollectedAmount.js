import { useWeb3Contract } from "react-moralis";
import { useOutletContext } from "react-router-dom";

export function useGetCollectedAmount() {
  const { address, abi, account } = useOutletContext();
  const { runContractFunction: getCollectedAmount } = useWeb3Contract({
    abi: abi,
    contractAddress: address,
    functionName: "getAmountReceived",
    params: {
      _owner: account,
    },
  });
  return { getCollectedAmount };
}
