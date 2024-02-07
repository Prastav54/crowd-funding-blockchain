import { ethers } from "ethers";
import { Modal, useNotification } from "web3uikit";
import { useWithdrawAmount } from "../../hooks/useWithdrawAmount";
import { handleError } from "../../utils/Apputils";
import { SUCCESS, SUCCESS_MESSAGE } from "../../constants/appConstants";

export const WithdrawAmountModal = ({
  collectedAmount,
  openModal,
  handleClose,
  handleWithdrawSuccess,
}) => {
  const { withdrawAmount } = useWithdrawAmount();
  const dispatch = useNotification();

  const handleSuccess = async (tx) => {
    await tx.wait(1);
    dispatch({
      type: SUCCESS,
      message: "Withdrawn Amount Successfully",
      title: SUCCESS_MESSAGE,
      position: "topR",
    });
    handleWithdrawSuccess();
    handleClose();
  };

  const withdraw = () => {
    withdrawAmount({
      onError: (error) => handleError(error, dispatch),
      onSuccess: (tx) => handleSuccess(tx),
    });
  };

  return (
    <Modal
      isVisible={openModal}
      onCancel={handleClose}
      title="Withdraw Amount"
      okText="Withdraw"
      onCloseButtonPressed={handleClose}
      onOk={withdraw}
    >
      <p className="mb-3">
        <b>{`You haveCollected ${ethers.utils.formatUnits(
          collectedAmount || 0,
          "ether"
        )} eth for your campaigns`}</b>
      </p>
    </Modal>
  );
};
