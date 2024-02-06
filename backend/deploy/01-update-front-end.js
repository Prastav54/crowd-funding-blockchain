const { ethers, network } = require("hardhat");
const fs = require("fs");
const {
  FRONT_END_ADDRESS_FILE_LOCATION,
  FRONT_END_ABI_FILE_LOCATION,
} = require("../helper-hardhat-config");

module.exports = async function () {
  if (process.env.UPDATE_FRONT_END === "true") {
    console.log("Updating Front End........");
    await updateContractAddresses();
    await updateApi();
  }
};

async function updateApi() {
  const campaignFunding = await ethers.getContract("CampaignFunding");
  fs.writeFileSync(
    FRONT_END_ABI_FILE_LOCATION,
    campaignFunding.interface.format(ethers.utils.FormatTypes.json)
  );
}

async function updateContractAddresses() {
  const campaignFunding = await ethers.getContract("CampaignFunding");
  const chainId = network.config.chainId.toString();
  const contractAddress = JSON.parse(
    fs.readFileSync(FRONT_END_ADDRESS_FILE_LOCATION, "utf-8")
  );
  if (chainId in contractAddress) {
    if (!contractAddress[chainId].includes(campaignFunding.address)) {
      contractAddress[chainId].push(campaignFunding.address);
    }
  } else {
    contractAddress[chainId] = [campaignFunding.address];
  }
  fs.writeFileSync(
    FRONT_END_ADDRESS_FILE_LOCATION,
    JSON.stringify(contractAddress)
  );
}

module.exports.tags = ["all", "frontend"];
