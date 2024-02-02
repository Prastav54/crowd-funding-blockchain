// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

error CampaignFunding__DeadlineExceeded();
error CampaignFunding__TransactionFailed();
error CampaignFunding__NoBalanceToWithDraw();

contract CampaignFunding{

  struct Campaign{
    address owner;
    string title;
    string description;
    uint256 target;
    uint256 deadline;
    uint256 amountCollected;
    string image;
    address[] donators;
    uint256[] donations;
    uint256 id;
  }

  mapping(uint256 => Campaign) public s_campaignIdMapping;
  mapping(address => uint256) private s_amountReceived;

  uint256 campaignId = 0;

  function createCampaign(
    address _owner,
    string memory _title,
    string memory _description,
    uint256 _target, 
    uint256 _deadline,
    string memory _image
  ) public returns (uint256){
    Campaign storage campaign = s_campaignIdMapping[campaignId];
    if (block.timestamp > _deadline){
      revert CampaignFunding__DeadlineExceeded();
    }
    campaign.owner = _owner;
    campaign.title = _title;
    campaign.description = _description;
    campaign.target = _target;
    campaign.deadline = _deadline;
    campaign.image = _image;
    campaign.id = campaignId;
    campaignId++;
    return campaignId - 1;
  }

  function donate(uint _id) public payable{
    uint256 amountDonated = msg.value;
    address donator = msg.sender;

    Campaign storage campaign = s_campaignIdMapping[_id];

    s_amountReceived[campaign.owner] = s_amountReceived[campaign.owner] + amountDonated;
    campaign.donators.push(donator);
    campaign.donations.push(amountDonated);
    campaign.amountCollected = campaign.amountCollected + amountDonated;
  }

  function withdrawAmountReceived() external {
    uint256 amountReceived = s_amountReceived[msg.sender];
    if (amountReceived <= 0){
      revert CampaignFunding__NoBalanceToWithDraw();
    }
    s_amountReceived[msg.sender] = 0;
    (bool success,) = payable(msg.sender).call{value: amountReceived}("");
    if (!success){
      s_amountReceived[msg.sender] = amountReceived;
      revert CampaignFunding__TransactionFailed();
    }
  }

  function getDonators(uint256 _id) view public returns (address[] memory, uint256[] memory) {
    return (s_campaignIdMapping[_id].donators, s_campaignIdMapping[_id].donations);
  }

  function getCampaigns() public view returns (Campaign[] memory) {
    Campaign[] memory allCampaigns = new Campaign[](campaignId);

    for(uint i = 0; i < campaignId; i++) {
        Campaign storage item = s_campaignIdMapping[i];
        allCampaigns[i] = item;
    }

    return allCampaigns;
  }

  function getAmountReceived() public view returns(uint256){
    return s_amountReceived[msg.sender];
  }
}