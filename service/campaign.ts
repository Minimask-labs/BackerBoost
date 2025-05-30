import AxiosService from './axios';

//  ****************** campaigns *******************
export const myCampaigns = async (params?: any) => {
  try {
    const response = await AxiosService.get(`campaign`, {
      params: params
    });
    return response?.data;
  } catch (error) {
    throw error;
  }
};

export const userCampaigns = async (params?: any) => {
  try {
    const response = await AxiosService.get(`campaign/my-campaigns`, {
      params: params
    });
    return response?.data;
  } catch (error) {
    throw error;
  }
};

export const createCampaign = async (payload: {
  title: string;
  description: string;
  category: string;
  targetAmount: number;
  endDate: string;
  // paymentMethod: string;
  startDate: string;

  // txHash?: string;
  // blockchainStatus?: 'pending' | 'confirmed' | 'failed';
}) => {
  try {
    const response = await AxiosService.post(`campaign`, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const viewCampaignDetails = async (params: { _id: string }) => {
  try {
    const response = await AxiosService.get(`campaign/retrieve`, {
      params: params
    });
    return response?.data;
  } catch (error) {
    throw error;
  }
};
