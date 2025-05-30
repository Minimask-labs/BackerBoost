 import AxiosService from './axios';

 export const getCategories = async () => {
  try {
    const response = await AxiosService.get('category');
    return response?.data; // Assuming you want to return the updated user data
  } catch (error) {
    throw error;
  }
};
