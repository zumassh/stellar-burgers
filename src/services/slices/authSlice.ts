import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  loginUserApi,
  registerUserApi,
  getUserApi,
  logoutApi,
  TRegisterData,
  TLoginData,
  updateUserApi
} from '@api';
import { TUser } from '@utils-types';
import { deleteCookie } from '../../utils/cookie';

interface AuthState {
  user: TUser | null;
  isAuthChecked: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthChecked: false,
  loading: false,
  error: null
};

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (data: TRegisterData, { rejectWithValue }) => {
    try {
      const res = await registerUserApi(data);
      return res.user;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Ошибка регистрации');
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (data: TLoginData, { rejectWithValue }) => {
    try {
      const res = await loginUserApi(data);
      return res.user;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Ошибка входа');
    }
  }
);

export const fetchUser = createAsyncThunk(
  'auth/fetchUser',
  async (_, { rejectWithValue }) => {
    try {
      const res = await getUserApi();
      return res.user;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Ошибка получения пользователя');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
    } catch (err: any) {
      return rejectWithValue(err.message || 'Ошибка выхода');
    }
  }
);

export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async (
    userData: { name: string; email: string; password?: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await updateUserApi(userData);
      return res.user;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Ошибка обновления данных');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthChecked(state, action) {
      state.isAuthChecked = action.payload;
    }
  },
  selectors: {
    selectUser: (state) => state.user,
    selectIsAuthChecked: (state) => state.isAuthChecked,
    selectAuthError: (state) => state.error,
    selectAuthLoading: (state) => state.loading,
    selectAuthState: (state) => state
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
      })

      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(fetchUser.rejected, (state) => {
        state.user = null;
        state.isAuthChecked = true;
      })

      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthChecked = true;
        localStorage.removeItem('refreshToken');
        deleteCookie('accessToken');
        localStorage.clear();
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { setAuthChecked } = authSlice.actions;
export const {
  selectUser,
  selectIsAuthChecked,
  selectAuthError,
  selectAuthLoading,
  selectAuthState
} = authSlice.selectors;

export default authSlice;
