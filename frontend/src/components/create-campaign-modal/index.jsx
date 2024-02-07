import { useEffect, useState } from "react";
import { Form, Modal, useNotification } from "web3uikit";
import { useCreateCampaign } from "../../hooks/useCreateCampaign";
import { handleError } from "../../utils/Apputils";
import { SUCCESS, SUCCESS_MESSAGE } from "../../constants/appConstants";

export const CreateCampaignModal = ({
  openModal,
  handleCloseModal,
  handleCreateSuccess,
}) => {
  const [formData, setFormData] = useState();
  const dispatch = useNotification();
  const { createCampaigns } = useCreateCampaign({ ...(formData || {}) });

  const handleSubmit = (e) => {
    let result = e.data;
    let data = {};
    for (let i of result) {
      data[i.inputName] = i.inputResult;
    }
    setFormData({ ...data });
  };

  const handleSuccess = async (tx) => {
    await tx.wait(1);
    dispatch({
      type: SUCCESS,
      message: "Campaign created successfully",
      title: SUCCESS_MESSAGE,
      position: "topR",
    });
    handleCreateSuccess();
    onCloseModal();
  };

  const onCloseModal = () => {
    setFormData();
    handleCloseModal();
  };

  const submitCampaignDetails = () => {
    createCampaigns({
      onError: (error) => handleError(error, dispatch),
      onSuccess: (tx) => handleSuccess(tx),
    });
  };

  useEffect(() => {
    if (formData) {
      submitCampaignDetails();
    }
  }, [formData]);

  return (
    <Modal
      onCloseButtonPressed={onCloseModal}
      title="Create Campaign"
      isVisible={openModal}
      hasFooter={false}
    >
      <Form
        buttonConfig={{
          theme: "primary",
          type: "submit",
        }}
        onSubmit={handleSubmit}
        data={[
          {
            inputWidth: "100%",
            name: "Title",
            type: "text",
            value: formData?.["Title"],
            validation: {
              required: true,
            },
          },
          {
            inputWidth: "100%",
            name: "Description",
            type: "textarea",
            value: formData?.["Description"],
            validation: {
              required: true,
            },
          },
          {
            inputWidth: "100%",
            name: "Target Amount (in Eth)",
            type: "number",
            value: formData?.["Target Amount (in Eth)"],
            validation: {
              required: true,
            },
          },
          {
            name: "Deadline",
            type: "date",
            value: formData?.["Deadline"] || [`${new Date()}`],
            validation: {
              required: true,
            },
          },
          {
            inputWidth: "100%",
            name: "Image Url",
            type: "text",
            value: formData?.["Image Url"],
            validation: {
              required: true,
            },
          },
        ]}
      />
    </Modal>
  );
};
