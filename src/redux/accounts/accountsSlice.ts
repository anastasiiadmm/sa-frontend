import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { message } from 'antd';

import { RootState } from 'redux/hooks';
import {
  IManager,
  IManagerMutation,
  IUserAccount,
  updateManagerDataMutation,
  userVehicles,
  userVehiclesPagination,
  ValidationUpdateManagerProfile,
} from 'types';
import axiosApi from 'utils/axios-api';
import { defaultError } from 'utils/config';
import toQueryParams from 'utils/toQueryParams';

const nameSpace = 'accounts';

interface AccountsState {
  manager: IManager | null;
  fetchLoadingManager: boolean;
  fetchErrorManager: Object | null;
  updateManagerData: updateManagerDataMutation;
  updateManagerDataLoading: boolean;
  updateManagerDataError: null;

  user: IUserAccount | null;
  fetchLoadingUser: boolean;
  fetchLoadingUserError: Object | null;
  userVehicles: userVehicles[] | undefined;
  userVehiclesPagination: userVehiclesPagination | null;
  fetchUserVehiclesLoading: boolean;
  fetchUserVehiclesError: Object | null;
}

const INITIAL_STATE = {
  manager: null,
  fetchLoadingManager: false,
  fetchErrorManager: null,
  updateManagerData: {
    username: '',
    password: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    email: '',
    phone: '',
  },
  updateManagerDataLoading: false,
  updateManagerDataError: null,

  user: null,
  fetchLoadingUser: false,
  fetchLoadingUserError: null,
  userVehicles: undefined,
  params: {
    page: 1,
  },
  userVehiclesPagination: null,
  fetchUserVehiclesLoading: false,
  fetchUserVehiclesError: null,
} as AccountsState;

export const fetchManager = createAsyncThunk(
  'accounts/fetchManager',
  async (_, { rejectWithValue }) => {
    try {
      const resp = await axiosApi.get<IManager | null>('/accounts/manager/');
      const manager = resp.data;
      if (manager === null) {
        throw new Error('Not Found!');
      }
      return manager;
    } catch (e) {
      let error = e?.response?.data;
      if (!e.response) {
        error = defaultError;
      }
      return rejectWithValue(error);
    }
  },
);

interface updateManagerParams {
  data: IManagerMutation;
}

export const managerProfileUpdate = createAsyncThunk<void, updateManagerParams>(
  `${nameSpace}/managerProfileUpdate`,
  async ({ data }, { rejectWithValue, dispatch }) => {
    try {
      const resp = await axiosApi.patch(`/accounts/manager/`, data);
      message.success('Данные успешно изменены!');
      await dispatch(fetchManager());
      return resp.data;
    } catch (e) {
      let error = e?.response?.data;
      if (!e.response) {
        error = defaultError;
      }
      return rejectWithValue(error);
    }
  },
);

export const fetchUser = createAsyncThunk('accounts/fetchUser', async (_, { rejectWithValue }) => {
  try {
    const resp = await axiosApi.get<IUserAccount | null>('/accounts/user/');
    const user = resp.data;
    if (user === null) {
      throw new Error('Not Found!');
    }
    return user;
  } catch (e) {
    let error = e?.response?.data;
    if (!e.response) {
      error = defaultError;
    }
    return rejectWithValue(error);
  }
});

interface fetchUserVehiclesParams {
  data: {
    query: {
      page: number;
    };
  };
}

export const fetchUserVehicles = createAsyncThunk<userVehicles, fetchUserVehiclesParams>(
  'accounts/fetchUserVehicles',
  async ({ data }, { rejectWithValue }) => {
    try {
      let query = '';
      if (data?.query) {
        query = toQueryParams(data.query);
      }
      const resp = await axiosApi.get<userVehicles | null>(`/accounts/user/vehicles/${query}`);
      const userVehicles = resp.data;

      if (userVehicles === null) {
        throw new Error('Not Found!');
      }

      return userVehicles;
    } catch (e) {
      let error = e?.response?.data;
      if (!e.response) {
        error = defaultError;
      }
      return rejectWithValue(error);
    }
  },
);

const accountsSlice = createSlice({
  name: nameSpace,
  initialState: INITIAL_STATE,
  reducers: {
    managerChangeProfileHandler: (
      state: any,
      action: PayloadAction<ValidationUpdateManagerProfile>,
    ) => {
      const keys = Object.keys(action.payload);
      if (keys[0] === 'confirm_password' || keys[0] === 'old_password') {
        delete keys[0];
      } else {
        state.updateManagerData[keys[0]] = action.payload[keys[0]];
      }
    },
    setManagerProfile: (state, action) => {
      state.updateManagerData.username = action.payload.username;
      state.updateManagerData.password = action.payload.password;
      state.updateManagerData.first_name = action.payload.first_name;
      state.updateManagerData.middle_name = action.payload.middle_name;
      state.updateManagerData.last_name = action.payload.last_name;
      state.updateManagerData.email = action.payload.email;
      state.updateManagerData.phone = action.payload.phone;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchManager.pending, (state) => {
      state.fetchErrorManager = null;
      state.fetchLoadingManager = true;
    });
    builder.addCase(fetchManager.fulfilled, (state, { payload: manager }) => {
      state.fetchErrorManager = null;
      state.fetchLoadingManager = false;
      state.manager = manager;
    });
    builder.addCase(fetchManager.rejected, (state, { payload }: any) => {
      state.fetchErrorManager = payload?.detail;
      state.fetchLoadingManager = false;
    });

    builder.addCase(managerProfileUpdate.pending, (state) => {
      state.updateManagerDataLoading = true;
      state.updateManagerDataError = null;
    });
    builder.addCase(managerProfileUpdate.fulfilled, (state) => {
      state.updateManagerDataLoading = false;
      state.updateManagerDataError = null;
    });
    builder.addCase(managerProfileUpdate.rejected, (state, { payload }: any) => {
      state.updateManagerDataLoading = false;
      state.updateManagerDataError = payload?.detail;
    });

    builder.addCase(fetchUser.pending, (state) => {
      state.fetchLoadingUser = true;
      state.fetchLoadingUserError = null;
    });
    builder.addCase(fetchUser.fulfilled, (state, { payload: user }) => {
      state.fetchLoadingUser = false;
      state.fetchLoadingUserError = null;
      state.user = user;
    });
    builder.addCase(fetchUser.rejected, (state, { payload }: any) => {
      state.fetchLoadingUserError = payload?.detail;
      state.fetchLoadingUser = false;
    });

    builder.addCase(fetchUserVehicles.pending, (state) => {
      state.fetchUserVehiclesLoading = true;
      state.fetchUserVehiclesError = null;
    });
    builder.addCase(fetchUserVehicles.fulfilled, (state, { payload }: any) => {
      state.fetchUserVehiclesLoading = false;
      state.fetchUserVehiclesError = null;
      state.userVehicles = payload.results;
      state.userVehiclesPagination = {
        ...state.userVehiclesPagination,
        count: payload.count,
        next: payload.links.next,
        previous: payload.links.previous,
      };
    });
    builder.addCase(fetchUserVehicles.rejected, (state, { payload }: any) => {
      state.fetchUserVehiclesLoading = false;
      state.fetchUserVehiclesError = payload?.detail;
    });
  },
});

export const { managerChangeProfileHandler, setManagerProfile } = accountsSlice.actions;
export const accountsSelector = (state: RootState) => state.accounts;
export default accountsSlice.reducer;
