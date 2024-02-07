import { Button, Card } from "web3uikit";

export const CampaignCard = ({
  cardDetails,
  handleFundCampaign,
  handleViewCampaignDetails,
}) => {
  return (
    <Card style={{ height: "350px" }}>
      <div className="flex flex-col justify-between items-center">
        <div>
          <img src={cardDetails.image} alt="Campaign Image" />
        </div>
        <b>
          <u>{cardDetails.title}</u>
        </b>
        <p className="line-clamp-2 text-[#787878]">{cardDetails.description}</p>
        <div className="p-2">
          <Button
            text="View Details"
            theme="primary"
            onClick={handleViewCampaignDetails}
          />
        </div>
        <div className="mb-2">
          <Button
            text="Fund Campaign"
            theme="outline"
            onClick={handleFundCampaign}
          />
        </div>
      </div>
    </Card>
  );
};
