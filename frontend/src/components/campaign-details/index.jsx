import { ethers } from "ethers";
import { Modal } from "web3uikit";

export const CampaignDetailsModal = ({ openModal, data, handleClose }) => {
  return (
    <Modal
      onCloseButtonPressed={handleClose}
      title="Campaign Detail"
      isVisible={openModal}
      hasFooter={false}
      headerHasBottomBorder
    >
      <div className="flex flex-col justify-between items-center p-3">
        <div className="mb-3">
          <img
            src={data.image}
            alt="Campaign Image"
            style={{
              borderRadius: "5px",
              minHeight: "200px",
              minWidth: "200px",
            }}
          />
        </div>
        <b className="text-2xl">
          <u>{data.title}</u>
        </b>
        <p className="text-[#787878]">{data.description}</p>
      </div>
      <div className="mb-3">
        <b>
          <u>Collected Amount:</u>
        </b>
        {` ${ethers.utils.formatUnits(data.amountCollected || 0, "ether")} eth`}
      </div>
      <div className="mb-3">
        <b>
          <u>Targetted Amount:</u>
        </b>
        {` ${ethers.utils.formatUnits(data.target || 0, "ether")} eth`}
      </div>
      <div className="mb-3">
        <b>
          <u>Deadline:</u>
        </b>
        {` ${new Date(data.deadline * 1000)}`}
      </div>
    </Modal>
  );
};
