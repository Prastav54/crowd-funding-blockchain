import { useEffect, useState } from "react";
import { useListCampaign } from "../../hooks/useListCampaigns";
import { Button } from "web3uikit";
import { Plus } from "@web3uikit/icons";
import { CreateCampaignModal } from "../../components/create-campaign-modal";
import { CampaignCard } from "../../components/campaign-card";
import { FundCampaignModal } from "../../components/fund-campaign";
import { CampaignDetailsModal } from "../../components/campaign-details";
import { Withdraw } from "@web3uikit/icons";
import { useGetCollectedAmount } from "../../hooks/useGetCollectedAmount";
import { WithdrawAmountModal } from "../../components/withdraw-amount";
import { useOutletContext } from "react-router-dom";

export const Dashboard = () => {
  const { listCampaigns } = useListCampaign();
  const { getCollectedAmount } = useGetCollectedAmount();
  const { account } = useOutletContext();
  const [campaignList, setCampaignList] = useState();
  const [collectedAmount, setCollectedAmount] = useState();
  const [openCreateCampaignModal, setOpenCreateCampaignModal] = useState(false);
  const [openFundCampaignModal, setOpenFundCampaignModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState();
  const [openCampaignDetailModal, setOpenCampaignDetailModal] = useState(false);
  const [openWithdrawAmountModal, setOpenWithdrawAmountModal] = useState(false);

  async function listAllCampaigns() {
    const response = await listCampaigns();
    setCampaignList(response);
  }

  async function getTotalAmountCollected() {
    const response = await getCollectedAmount();
    setCollectedAmount(response);
  }

  useEffect(() => {
    listAllCampaigns();
    getTotalAmountCollected();
  }, [account]);

  const showCampaign = (data) => {
    return (
      Date.now() < data.deadline * 1000 &&
      +data.amountCollected.toString() < +data.target.toString()
    );
  };

  const handleCreateButtonClicked = () => {
    setOpenCreateCampaignModal(true);
  };

  const handleCreateCampaignModalClose = () => {
    setOpenCreateCampaignModal(false);
  };

  const handleSuccessAction = () => {
    listAllCampaigns();
    getTotalAmountCollected();
  };

  const handleFundCampaign = (id) => {
    setSelectedCampaign(id);
    setOpenFundCampaignModal(true);
  };

  const handleFundCampaignModalClose = () => {
    setSelectedCampaign();
    setOpenFundCampaignModal(false);
  };

  const handleViewCampaignDetails = (data) => {
    setSelectedCampaign(data);
    setOpenCampaignDetailModal(true);
  };

  const handleCloseCampaignDetailModal = () => {
    setSelectedCampaign();
    setOpenCampaignDetailModal(false);
  };

  const handleWithdrawButtonClicked = () => {
    setOpenWithdrawAmountModal(true);
  };

  const handleCloseWithdrawAmountModal = () => {
    setOpenWithdrawAmountModal(false);
  };

  return (
    <>
      <div className="flex justify-end items-center p-3 space-x-1">
        <Button
          icon={<Withdraw />}
          theme="outline"
          text="Withdraw"
          disabled={!Boolean(+collectedAmount?.toString())}
          onClick={handleWithdrawButtonClicked}
        />
        <Button
          icon={<Plus />}
          theme="primary"
          text="Create Campaign"
          onClick={handleCreateButtonClicked}
        />
      </div>
      <CreateCampaignModal
        openModal={openCreateCampaignModal}
        handleCloseModal={handleCreateCampaignModalClose}
        handleCreateSuccess={handleSuccessAction}
      />
      <FundCampaignModal
        handleClose={handleFundCampaignModalClose}
        openModal={openFundCampaignModal}
        itemId={selectedCampaign}
        handleFundingSuccess={handleSuccessAction}
      />
      <CampaignDetailsModal
        openModal={openCampaignDetailModal}
        handleClose={handleCloseCampaignDetailModal}
        data={selectedCampaign || {}}
      />
      <WithdrawAmountModal
        collectedAmount={collectedAmount}
        openModal={openWithdrawAmountModal}
        handleClose={handleCloseWithdrawAmountModal}
        handleWithdrawSuccess={handleSuccessAction}
      />
      {Boolean(campaignList?.length) ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 rounded">
          {campaignList.map(
            (item) =>
              showCampaign(item) && (
                <div key={item.id}>
                  <CampaignCard
                    cardDetails={item}
                    handleFundCampaign={() => handleFundCampaign(item.id)}
                    handleViewCampaignDetails={() =>
                      handleViewCampaignDetails(item)
                    }
                  />
                </div>
              )
          )}
        </div>
      ) : (
        <div className="grid h-screen place-items-center text-[#1E1E1E] text-base font-albert">
          <b>
            <u>No Campaign to show</u>
          </b>
        </div>
      )}
    </>
  );
};
