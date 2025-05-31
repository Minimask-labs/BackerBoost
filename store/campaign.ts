import { create } from "zustand";
import {
  myCampaigns,
  createCampaign,
  viewCampaignDetails,
} from '@/service/campaign';

interface DataResponse {
  data: any;
  meta: any;
  message: string;
  success: boolean;
  timestamp: string;
}

   
export type UserState = {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  loading: boolean;
  campaigns: DataResponse | null;
   campaign_details: any | null;
 };

export type UserActions = {
  fetchCampaigns: (params?: any) => Promise<void>;
  fetchCampaignsDetails: (params?: any) => Promise<void>;
  handleCreateCampaign: (body: any) => Promise<void>;
};

export type UserStore = UserState & UserActions;

export const useCampaignStore = create<UserStore>((set) => ({

  campaigns: null,
  campaign_details: null,
  status: 'idle',
  error: null,
  loading: false,

  // Action to set the singlecampaignId

  fetchCampaigns: async (params?: any) => {
    set({ loading: true, status: 'loading', error: null });
    try {
      const response = await myCampaigns(params);
      console.log("response", response.data)
      set({
        loading: false,
        campaigns: response.data,
        status: 'succeeded'
      });
      return response.data
      // set({
      //   loading: false,
      //   campaigns: response.data,
      //   status: 'succeeded'
      // });
    } catch (error: any) {
      set({ loading: false, status: 'failed', error: error.message });
      throw error;
    }
  },

  fetchCampaignsDetails: async (params?: any) => {
    set({ loading: true, status: 'loading', error: null });
    try {
      const response = await viewCampaignDetails(params);
      set({
        loading: false,
        campaign_details: response.data,
        status: 'succeeded'
      });
    } catch (error: any) {
      set({ loading: false, status: 'failed', error: error.message });
      throw error;
    }
  },
  handleCreateCampaign: async (body: any) => {
    set({ loading: true, status: 'loading', error: null });
    try {
      const response = await createCampaign(body);
      set({ loading: false, status: 'succeeded' });
      return response;
    } catch (error: any) {
      set({ loading: false, status: 'failed', error: error.message });
      throw error;
    }
  },
  
}));

 