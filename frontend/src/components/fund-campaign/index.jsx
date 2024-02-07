import { useState } from "react";
import { Input, Modal, useNotification } from "web3uikit";
import { handleError } from "../../utils/Apputils";
import { useFundCampaign } from "../../hooks/useFundCampaign";
import { SUCCESS, SUCCESS_MESSAGE } from "../../constants/appConstants";

export const FundCampaignModal = ({
  itemId,
  openModal,
  handleClose,
  handleFundingSuccess,
}) => {
  const [fundAmount, setFundAmount] = useState();
  const { donateCampaign } = useFundCampaign(itemId, fundAmount);
  const dispatch = useNotification();

  const onClose = () => {
    setFundAmount();
    handleClose();
  };

  const handleSuccess = async (tx) => {
    await tx.wait(1);
    dispatch({
      type: SUCCESS,
      message: "Donated to Campaign Successfully",
      title: SUCCESS_MESSAGE,
      position: "topR",
    });
    handleFundingSuccess();
    onClose();
  };

  const submitDonation = () => {
    if (fundAmount <= 0) {
      handleError("", dispatch, "Price Should be Greater than 0");
      return;
    }
    donateCampaign({
      onError: (error) => handleError(error, dispatch),
      onSuccess: (tx) => handleSuccess(tx),
    });
  };

  return (
    <Modal
      isVisible={openModal}
      onCancel={onClose}
      title="Donate to Campaign"
      onCloseButtonPressed={onClose}
      onOk={submitDonation}
      okText="Donate"
    >
      <div className="mb-3">
        <Input
          label="Amount (in ETH)"
          name="Amount"
          type="number"
          width="100%"
          onChange={(event) => {
            setFundAmount(event.target.value);
          }}
        />
      </div>
    </Modal>
  );
};
