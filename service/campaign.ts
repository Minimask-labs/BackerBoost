 import AxiosService from './axios';


//  ****************** campaigns *******************
  export const myCampaigns = async (params:any) => {
  try {
    const response = await AxiosService.get('campaign/ ', {
      params: params
    });
    return response?.data; // Assuming you want to return the updated user data
  } catch (error) {
    throw error;
  }
};

export const createCampaign = async (payload: any ) => {
  try {
    const response = await AxiosService.post(`campaign`, payload);
    console.log(response)
    return response.data; // Assuming you want to return the updated user data
  } catch (error) {
    throw error;
  }
};
// employer campaign invite
 export const viewcampaignInvitations = async (params: { campaignId: string }) => {
  try {
    const response = await AxiosService.get('invitation/employer/campaign', {
      params: params
    });
    return response?.data; // Assuming you want to return the updated user data
  } catch (error) {
    throw error;
  }
};

export const sendcampaignInvite = async (payload: {
  campaignId: string;
   Id: string;
  message:string;
}) => {
  try {
    const response = await AxiosService.post(`invitation/campaign`, payload);
    return response.data; // Assuming you want to return the updated user data
  } catch (error) {
    throw error;
  }
};


//   campaign invite
 export const viewcampaignInvitationsList = async (params?: any) => {
  try {
    const response = await AxiosService.get('invitation/ /campaign', {
      params: params
    });
    return response?.data; // Assuming you want to return the updated user data
  } catch (error) {
    throw error;
  }
};
   export const campaignInviteResponse = async (payload: {
    invitationId: string;
    response: string; // accept | reject
  }) => {
    try {
      const response = await AxiosService.post(
        `invitation/campaign/respond`,
        payload
      );
      return response.data; // Assuming you want to return the updated user data
    } catch (error) {
      throw error;
    }
  };

  // milestone
   export const completeMilestone = async (payload: {
    campaignId: string;
    milestoneId: string;
  }) => {
    try {
      const response = await AxiosService.post(
        `campaign/milestones/complete`,
        payload
      );
      return response.data; // Assuming you want to return the updated user data
    } catch (error) {
      throw error;
    } 
  };
   export const approveMilestone = async (payload: {
    campaignId: string;
    milestoneId: string;
  }) => {
    try {
      const response = await AxiosService.post(
        `campaign/milestones/approve`,
        payload
      );
      return response.data; // Assuming you want to return the updated user data
    } catch (error) {
      throw error;
    } 
  };
  // http://localhost:4005/api/v1/campaign/complete
  export const completecampaign = async (payload: {
    campaignId: string;
  }) => {
    try {
      const response = await AxiosService.post(
        `campaign/complete`,
        payload
      );
      return response.data; // Assuming you want to return the updated user data
    } catch (error) {
      throw error;
    } 
  };
  // http://localhost:4005/api/v1/campaign/approve
  export const approvecampaign = async (payload: {
    campaignId: string;
  }) => {
    try {
      const response = await AxiosService.post(
        `campaign/approve`,
        payload
      );
      return response.data; // Assuming you want to return the updated user data
    } catch (error) {
      throw error;
    } 
  };
  // http://localhost:4005/api/v1/campaign/detail?campaignId=6812816d336faaed3397f30a
  export const campaignDetail = async (params: { campaignId: string }) => {
    try {
      const response = await AxiosService.get('campaign/detail', {
        params: params
      });
      return response?.data; // Assuming you want to return the updated user data
    } catch (error) {
      throw error;
    }
  };