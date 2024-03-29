import { useWeb3Contract } from "react-moralis";
import { useOutletContext } from "react-router-dom";
import { ethers } from "ethers";

export const useCreateCampaign = (data) => {
  const { address, abi, account } = useOutletContext();
  let parameters = {
    _owner: account,
    _title: data["Title"],
    _description: data["Description"],
    _target: data["Target Amount (in Eth)"]
      ? ethers.utils.parseEther(`${data["Target Amount (in Eth)"]}`)
      : "",
    _deadline: new Date(data["Deadline"]?.[0]).getTime() / 1000,
    _image: data["Image Url"],
  };
  const { runContractFunction: createCampaigns } = useWeb3Contract({
    abi: abi,
    contractAddress: address,
    functionName: "createCampaign",
    params: parameters,
  });
  return { createCampaigns };
};
