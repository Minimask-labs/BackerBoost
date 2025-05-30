 import AxiosService from './axios';


//  ****************** campaigns *******************
  export const myCampaigns = async (params?:any) => {
  try {
    const response = await AxiosService.get(
      `campaign 
`,
      {
        params: params
      }
    );
    return response?.data; // Assuming you want to return the updated user data
  } catch (error) {
    throw error;
  }
};

export const createCampaign = async (payload: any ) => {
  try {
    const response = await AxiosService.post(`campaign`, payload);
    return response.data; // Assuming you want to return the updated user data
  } catch (error) {
    throw error;
  }
};
  export const viewCampaignDetails = async (params: {
    _id: string;
   }) => {
    try {
      const response = await AxiosService.get(
        `campaign/retrieve`,
        {
          params: params
        }
      );
      return response?.data; // Assuming you want to return the updated user data
    } catch (error) {
      throw error;
    }
  };
