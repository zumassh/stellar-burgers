import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { getOrdersApi } from '@api';

interface ProfileState {
  orders: TOrder[];
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  orders: [],
  loading: false,
  error: null
};

export const fetchProfileOrders = createAsyncThunk(
  'profile/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getOrdersApi();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Ошибка при получении заказов');
    }
  }
);

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {},
  selectors: {
    selectProfileOrders: (state) => state.orders,
    selectProfileLoading: (state) => state.loading,
    selectProfileError: (state) => state.error,
    selectProfileState: (state) => state
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfileOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfileOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchProfileOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const {
  selectProfileOrders,
  selectProfileLoading,
  selectProfileError,
  selectProfileState
} = profileSlice.selectors;

export default profileSlice;
