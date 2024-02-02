const { expect, assert } = require("chai");
const { network, deployments, ethers } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Campaign Funding Unit Test", function () {
      let campaignFunding,
        campaignFundingContract,
        deployer,
        user,
        owner,
        title,
        description,
        target,
        deadline,
        image;
      beforeEach(async () => {
        accounts = await ethers.getSigners();
        deployer = accounts[0];
        user = accounts[1];
        await deployments.fixture(["campaignFunding"]);
        campaignFundingContract = await ethers.getContract("CampaignFunding");
        campaignFunding = campaignFundingContract.connect(deployer);
        owner = "0x51D22A969C2Ed4f4CD20FBAA938654D3EAc732D2";
        title = "Test";
        description = "Test Description";
        target = ethers.utils.parseEther("0.1");
        deadline = Math.floor((Date.now() + 86400000) / 1000);
        image = "Test Image Link";
      });

      describe("Create Campaign", () => {
        it("Throws error if deadline is exceeded", () => {
          deadline = Math.floor((Date.now() - 86400000) / 1000);
          expect(
            campaignFunding.createCampaign(
              owner,
              title,
              description,
              target,
              deadline,
              image
            )
          ).to.be.revertedWith("CampaignFunding__DeadlineExceeded()");
        });
        it("Emit Event after campaign is created", async () => {
          await expect(
            campaignFunding.createCampaign(
              owner,
              title,
              description,
              target,
              deadline,
              image
            )
          ).to.emit(campaignFunding, "CampaignCreated");
        });
        it("Returns 0 after campaign is created", async () => {
          await campaignFunding.createCampaign(
            owner,
            title,
            description,
            target,
            deadline,
            image
          );
          const campaignId = await campaignFunding.getCampaignCount();
          assert.equal(0, campaignId);
        });
      });
      describe("Donate Functionality", () => {
        it("Should update donators and donations", async () => {
          await campaignFunding.createCampaign(
            owner,
            title,
            description,
            target,
            deadline,
            image
          );
          await campaignFunding.donate(0, {
            value: ethers.utils.parseEther("0.05"),
          });
          const campaign = await campaignFunding.getCampaignDetails(0);
          assert.equal(campaign.donators[0].toString(), deployer.address);
          assert.equal(
            campaign.donations[0].toString(),
            ethers.utils.parseEther("0.05")
          );
        });
        it("Should update amount received variable for owner", async () => {
          await campaignFunding.createCampaign(
            owner,
            title,
            description,
            target,
            deadline,
            image
          );
          await campaignFunding.donate(0, {
            value: ethers.utils.parseEther("0.05"),
          });
          let amountReceived = await campaignFunding.getAmountReceived(owner);
          assert.equal(
            amountReceived.toString(),
            ethers.utils.parseEther("0.05")
          );
        });
      });
      describe("Withdraws Amount Received", () => {
        it("Reverts with error if there is no amount to withdraw", async () => {
          await expect(
            campaignFunding.withdrawAmountReceived()
          ).to.be.revertedWith("CampaignFunding__NoBalanceToWithDraw()");
        });
        it("Withdraws amount", async () => {
          campaignFunding = campaignFundingContract.connect(user);
          owner = deployer.address;
          await campaignFunding.createCampaign(
            owner,
            title,
            description,
            target,
            deadline,
            image
          );
          await campaignFunding.donate(0, {
            value: ethers.utils.parseEther("0.05"),
          });
          let amountReceived = await campaignFunding.getAmountReceived(owner);
          campaignFunding = campaignFundingContract.connect(deployer);
          const deployerBalanceBefore = await deployer.getBalance();
          const txResponse = await campaignFunding.withdrawAmountReceived();
          const transactionReceipt = await txResponse.wait(1);
          const { gasUsed, effectiveGasPrice } = transactionReceipt;
          const gasCost = gasUsed.mul(effectiveGasPrice);
          const deployerBalanceAfter = await deployer.getBalance();

          assert(
            deployerBalanceAfter.add(gasCost).toString() ==
              deployerBalanceBefore.add(amountReceived).toString()
          );
        });
        it("Sets the amount received for owner to 0 after withdraw", async () => {
          campaignFunding = campaignFundingContract.connect(user);
          owner = deployer.address;
          await campaignFunding.createCampaign(
            owner,
            title,
            description,
            target,
            deadline,
            image
          );
          await campaignFunding.donate(0, {
            value: ethers.utils.parseEther("0.05"),
          });
          let amountReceived = await campaignFunding.getAmountReceived(owner);
          assert.equal(
            amountReceived.toString(),
            ethers.utils.parseEther("0.05")
          );
          campaignFunding = campaignFundingContract.connect(deployer);
          await campaignFunding.withdrawAmountReceived();
          amountReceived = await campaignFunding.getAmountReceived(owner);
          assert.equal(amountReceived.toString(), "0");
        });
      });
    });
