import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { message } from 'antd';

import { getErrorMessage } from 'helper';
import { IErrors, IMyData, IUpdateManagerDataMutation } from 'interfaces';
import { RootState } from 'redux/hooks';
import {
  accountsManagerConfirmation,
  companiesList,
  generatedPassword,
  IAccount,
  IUserAccount,
  RequestType,
  updateManagerDataMutation,
  userRequest,
  userRequestPagination,
  userVehicleInfo,
  userVehicles,
  userVehiclesPagination,
  ValidationUpdateManagerProfile,
} from 'types/types';
import { axiosApi, axiosApi2 } from 'utils/axios-api';
import toQueryParams from 'utils/toQueryParams';

const nameSpace = 'accounts';

interface AccountsState {
  account: IAccount | null;
  fetchLoadingAccount: boolean;
  fetchErrorAccount: IErrors | null;
  updateManagerData: updateManagerDataMutation;
  updateManagerDataLoading: boolean;
  updateManagerDataError: IErrors | null;
  user: IUserAccount | null;
  fetchLoadingUser: boolean;
  fetchLoadingUserError: IErrors | null;
  userVehicles: userVehicles[] | undefined;
  userVehiclesPagination: userVehiclesPagination | null;
  fetchUserVehiclesLoading: boolean;
  fetchUserVehiclesError: IErrors | null;
  inquiriesLoading: boolean;
  inquiriesError: IErrors | null;
  inquiriesSuccess: boolean | null;
  requests: userRequest[] | undefined;
  requestsPagination: userRequestPagination | null;
  fetchRequestsLoading: boolean;
  fetchRequestsError: IErrors | null;
  userVehicleInfo: userVehicleInfo | null;
  userVehicleInfoLoading: boolean;
  userVehicleInfoError: IErrors | null;
  generatePasswordLoading: boolean;
  generatePasswordError: IErrors | null;
  generatedPassword: string | null;
  accountManagerConfirmation: accountsManagerConfirmation | null;
  accountManagerConfirmationLoading: boolean;
  accountManagerConfirmationError: IErrors | null;
  vehicleCreateRequestLoading: boolean;
  vehicleCreateRequestError: IErrors | null;
  vehicleCreateRequestSuccess: boolean;
  vehicleDeleteLoading: boolean;
  vehicleErrorsDelete: IErrors | null;
  approveRequestLoading: boolean;
  approveRequestError: IErrors | null;
  approveRequestSuccess: boolean;
}

const INITIAL_STATE = {
  account: null,
  fetchLoadingAccount: false,
  fetchErrorAccount: null,
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
  vehicleDeleteLoading: false,
  vehicleErrorsDelete: null,
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

  inquiriesLoading: false,
  inquiriesError: null,
  inquiriesSuccess: false,

  requests: undefined,
  requestsPagination: null,
  fetchRequestsLoading: false,
  fetchRequestsError: null,

  userVehicleInfo: null,
  userVehicleInfoLoading: false,
  userVehicleInfoError: null,

  generatePasswordLoading: false,
  generatePasswordError: null,
  generatedPassword: null,

  accountManagerConfirmation: null,
  accountManagerConfirmationLoading: false,
  accountManagerConfirmationError: null,

  vehicleCreateRequestLoading: false,
  vehicleCreateRequestError: null,
  vehicleCreateRequestSuccess: false,

  approveRequestLoading: false,
  approveRequestError: null,
  approveRequestSuccess: false,
} as AccountsState;

export const fetchAccount = createAsyncThunk(
  'accounts/fetchManager',
  async (_, { rejectWithValue }) => {
    try {
      const resp = await axiosApi2.get<IAccount | null>('/accounts/');
      const account = resp.data;
      if (account === null) {
        throw new Error('Not Found!');
      }
      return account;
    } catch (e) {
      return rejectWithValue({
        detail: e?.response?.data?.detail,
        status: e?.response?.status,
      });
    }
  },
);

interface updateManagerParams {
  data: FormData;
}

export const managerProfileUpdate = createAsyncThunk<void, updateManagerParams>(
  `${nameSpace}/managerProfileUpdate`,
  async ({ data }, { rejectWithValue, dispatch }) => {
    try {
      const resp = await axiosApi.patch(`/accounts/manager/`, data);
      message.success('Данные успешно изменены!');
      await dispatch(fetchAccount());
      return resp.data;
    } catch (e) {
      if (e?.response?.data) {
        const errorMessage = getErrorMessage({ username: e?.response?.data }, 'username');
        await message.error(`${errorMessage}`);
      }
      return rejectWithValue({
        detail: e?.response?.data,
        status: e?.response?.status,
      });
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
    return rejectWithValue({
      detail: e?.response?.data?.detail,
      status: e?.response?.status,
    });
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
      return rejectWithValue({
        detail: e?.response?.data?.detail,
        status: e?.response?.status,
      });
    }
  },
);

export const approveFieldClimateRequest = createAsyncThunk<void, IMyData>(
  `${nameSpace}/approveFieldClimateRequest`,
  async (data, { rejectWithValue }) => {
    try {
      const resp = await axiosApi2.post(`/common/inquiries/`, data);
      message.success('Запрос успешно отправлен!');

      return resp.data;
    } catch (e) {
      return rejectWithValue({
        detail: e?.response?.data?.non_field_errors,
        status: e?.response?.status,
      });
    }
  },
);

interface approveRequestParams {
  id: number | null;
  data?: {
    category: number;
    object_id?: number;
  };
}

export const approveRequest = createAsyncThunk<RequestType, approveRequestParams>(
  `${nameSpace}/approveRequest`,
  async (data, { rejectWithValue }) => {
    try {
      const res = await axiosApi2.post(`/common/inquiries/${data?.id}/`, data?.data);
      message.success('Запрос принят!');
      return res?.data?.id;
    } catch (e) {
      return rejectWithValue({
        detail: e?.response?.data,
        status: e?.response?.status,
      });
    }
  },
);

export const deleteRequest = createAsyncThunk(
  `${nameSpace}/deleteRequest`,
  async (
    {
      id,
    }: {
      id: string;
    },
    { rejectWithValue },
  ) => {
    try {
      await axiosApi2.delete(`/common/inquiries/${id}/`);
      message.success('Успешно удалено');
      return {
        id,
      };
    } catch (e) {
      return rejectWithValue({
        detail: e?.response?.data,
        status: e?.response?.status,
      });
    }
  },
);

interface fetchRequestsParams {
  data?: {
    query?: {
      page?: number | undefined;
    };
  };
}

export const fetchRequests = createAsyncThunk<userRequest, fetchRequestsParams>(
  'accounts/fetchRequests',
  async ({ data }, { rejectWithValue }) => {
    try {
      let query = '';
      if (data?.query) {
        query = toQueryParams(data.query);
      }
      const resp = await axiosApi2.get(`/common/inquiries/${query}`);
      const requests = resp.data;

      if (requests === null) {
        throw new Error('Not Found!');
      }

      return requests;
    } catch (e) {
      return rejectWithValue({
        detail: e?.response?.data?.detail,
        status: e?.response?.status,
      });
    }
  },
);

interface vehicleCreateRequestParams {
  data: FormData;
}

export const vehicleCreateRequest = createAsyncThunk<void, vehicleCreateRequestParams>(
  `${nameSpace}/vehicleCreateRequest`,
  async ({ data }, { rejectWithValue }) => {
    try {
      const resp = await axiosApi2.post(`/common/inquiries/`, data);
      message.success('Запрос успешно отправлен!');

      return resp.data;
    } catch (e) {
      return rejectWithValue({
        detail: e?.response?.data,
        status: e?.response?.status,
      });
    }
  },
);

interface accountManagerConfirmationParams {
  id: number | string | null | undefined;
  data?: any;
}

export const accountManagerConfirmationRequest = createAsyncThunk<
  accountsManagerConfirmation,
  accountManagerConfirmationParams
>('accounts/accountManagerConfirmationRequest', async ({ id, data }, { rejectWithValue }) => {
  try {
    console.log('data', data);
    const resp = await axiosApi2.post<accountsManagerConfirmation | null>(
      `/common/inquiries/${id}/`,
      data,
    );
    const accountManagerConfirmation = resp.data;

    if (accountManagerConfirmation === null) {
      throw new Error('Not Found!');
    }

    return accountManagerConfirmation;
  } catch (e) {
    return rejectWithValue({
      detail: e?.response?.data,
      status: e?.response?.status,
    });
  }
});

interface fetchVehicleInfoParams {
  vehicleId: string | undefined;
}

export const fetchVehicleInfo = createAsyncThunk<userVehicleInfo, fetchVehicleInfoParams>(
  'accounts/fetchVehicleInfo',
  async (data, { rejectWithValue }) => {
    try {
      const resp = await axiosApi.get<userVehicleInfo | null>(
        `/accounts/user/vehicle/${data.vehicleId}/`,
      );
      const vehicle = resp.data;

      if (vehicle === null) {
        throw new Error('Not Found!');
      }

      return vehicle;
    } catch (e) {
      return rejectWithValue({
        detail: e?.response?.data?.detail,
        status: e?.response?.status,
      });
    }
  },
);

interface generateNewPasswordParams {
  company_id: number | undefined;
}

export const generateNewPassword = createAsyncThunk<generatedPassword, generateNewPasswordParams>(
  `${nameSpace}/generateNewPassword`,
  async (data, { rejectWithValue }) => {
    try {
      const resp = await axiosApi.post(`/accounts/user/generate_new_password/`, data);
      return resp.data;
    } catch (e) {
      return rejectWithValue({
        detail: e?.response?.data,
        status: e?.response?.status,
      });
    }
  },
);

const accountsSlice = createSlice({
  name: nameSpace,
  initialState: INITIAL_STATE,
  reducers: {
    managerChangeProfileHandler: (state, action: PayloadAction<ValidationUpdateManagerProfile>) => {
      const keys = Object.keys(action.payload);
      if (keys[0] === 'confirm_password' || keys[0] === 'old_password') {
        delete keys[0];
      } else {
        const updateDataKey = keys[0] as keyof IUpdateManagerDataMutation;
        state.updateManagerData[updateDataKey] = action.payload[keys[0]];
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
    inquiriesSuccessNull: (state) => {
      state.inquiriesSuccess = false;
    },
    deleteRequests: (state, action) => {
      state.requests = state.requests?.filter((item) => item.id !== action.payload);
    },
    clearRequestsPagination: (state) => {
      state.requestsPagination = null;
      state.userVehiclesPagination = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAccount.pending, (state) => {
      state.fetchErrorAccount = null;
      state.fetchLoadingAccount = true;
    });
    builder.addCase(fetchAccount.fulfilled, (state, { payload: account }) => {
      state.fetchErrorAccount = null;
      state.fetchLoadingAccount = false;
      state.account = account;
    });
    builder.addCase(fetchAccount.rejected, (state, { payload }) => {
      if (payload && typeof payload === 'object' && 'detail' in payload && 'status' in payload) {
        state.fetchErrorAccount = {
          ...state.fetchErrorAccount,
          detail: payload.detail as string | null,
          status: payload.status as number | null,
        };
      }
      state.fetchLoadingAccount = false;
    });

    builder.addCase(managerProfileUpdate.pending, (state) => {
      state.updateManagerDataLoading = true;
      state.updateManagerDataError = null;
    });
    builder.addCase(managerProfileUpdate.fulfilled, (state) => {
      state.updateManagerDataLoading = false;
      state.updateManagerDataError = null;
    });
    builder.addCase(managerProfileUpdate.rejected, (state, { payload }) => {
      state.updateManagerDataLoading = false;
      if (payload && typeof payload === 'object' && 'detail' in payload && 'status' in payload) {
        state.updateManagerDataError = {
          ...state.updateManagerDataError,
          detail: payload.detail as string | null,
          status: payload.status as number | null,
        };
      }
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
    builder.addCase(fetchUser.rejected, (state, { payload }) => {
      state.fetchLoadingUser = false;
      if (payload && typeof payload === 'object' && 'detail' in payload && 'status' in payload) {
        state.fetchLoadingUserError = {
          ...state.fetchLoadingUserError,
          detail: payload.detail as string | null,
          status: payload.status as number | null,
        };
      }
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
    builder.addCase(fetchUserVehicles.rejected, (state, { payload }) => {
      state.fetchUserVehiclesLoading = false;
      if (payload && typeof payload === 'object' && 'detail' in payload && 'status' in payload) {
        state.fetchUserVehiclesError = {
          ...state.fetchUserVehiclesError,
          detail: payload.detail as string | null,
          status: payload.status as number | null,
        };
      }
    });

    builder.addCase(approveFieldClimateRequest.pending, (state) => {
      state.inquiriesLoading = true;
      state.inquiriesError = null;
      state.inquiriesSuccess = false;
    });
    builder.addCase(approveFieldClimateRequest.fulfilled, (state) => {
      state.inquiriesLoading = false;
      state.inquiriesError = null;
      state.inquiriesSuccess = true;
    });
    builder.addCase(approveFieldClimateRequest.rejected, (state, { payload }) => {
      state.inquiriesLoading = false;
      if (payload && typeof payload === 'object' && 'detail' in payload && 'status' in payload) {
        state.inquiriesError = {
          ...state.inquiriesError,
          detail: payload.detail as string | null,
          status: payload.status as number | null,
        };
      }
      state.inquiriesSuccess = false;
    });

    builder.addCase(approveRequest.pending, (state) => {
      state.approveRequestLoading = true;
      state.approveRequestError = null;
      state.approveRequestSuccess = false;
    });
    builder.addCase(approveRequest.fulfilled, (state, action: PayloadAction<{ id: number }>) => {
      state.approveRequestLoading = false;
      state.approveRequestError = null;
      state.approveRequestSuccess = true;
    });
    builder.addCase(approveRequest.rejected, (state, { payload }) => {
      state.approveRequestLoading = false;
      if (payload && typeof payload === 'object' && 'detail' in payload && 'status' in payload) {
        state.approveRequestError = {
          ...state.approveRequestError,
          detail: payload.detail as string | null,
          status: payload.status as number | null,
        };
      }
      state.approveRequestSuccess = false;
    });

    builder.addCase(fetchRequests.pending, (state) => {
      state.fetchRequestsLoading = true;
      state.fetchRequestsError = null;
    });
    builder.addCase(fetchRequests.fulfilled, (state, { payload }: any) => {
      state.requests = payload.results;
      state.fetchRequestsLoading = false;
      state.fetchRequestsError = null;
      state.requestsPagination = {
        ...state.requestsPagination,
        count: payload.count,
        next: payload.next,
        previous: payload.previous,
      };
    });
    builder.addCase(fetchRequests.rejected, (state, { payload }) => {
      state.fetchRequestsLoading = false;
      if (payload && typeof payload === 'object' && 'detail' in payload && 'status' in payload) {
        state.fetchRequestsError = {
          ...state.fetchRequestsError,
          detail: payload.detail as string | null,
          status: payload.status as number | null,
        };
      }
    });

    builder.addCase(fetchVehicleInfo.pending, (state) => {
      state.userVehicleInfoLoading = true;
      state.userVehicleInfoError = null;
    });
    builder.addCase(fetchVehicleInfo.fulfilled, (state, { payload: vehicleInfo }) => {
      state.userVehicleInfoLoading = false;
      state.userVehicleInfo = vehicleInfo;
    });
    builder.addCase(fetchVehicleInfo.rejected, (state, { payload }) => {
      state.userVehicleInfoLoading = false;
      if (payload && typeof payload === 'object' && 'detail' in payload && 'status' in payload) {
        state.userVehicleInfoError = {
          ...state.userVehicleInfoError,
          detail: payload.detail as string | null,
          status: payload.status as number | null,
        };
      }
    });

    builder.addCase(generateNewPassword.pending, (state) => {
      state.generatePasswordLoading = true;
      state.generatePasswordError = null;
    });
    builder.addCase(generateNewPassword.fulfilled, (state, { payload }) => {
      state.generatePasswordLoading = false;
      state.generatedPassword = payload.generated_password;
    });
    builder.addCase(generateNewPassword.rejected, (state, { payload }) => {
      state.generatePasswordLoading = false;
      if (payload && typeof payload === 'object' && 'detail' in payload && 'status' in payload) {
        state.generatePasswordError = {
          ...state.generatePasswordError,
          detail: payload.detail as string | null,
          status: payload.status as number | null,
        };
      }
    });

    builder.addCase(accountManagerConfirmationRequest.pending, (state) => {
      state.accountManagerConfirmationLoading = true;
      state.accountManagerConfirmationError = null;
    });
    builder.addCase(
      accountManagerConfirmationRequest.fulfilled,
      (state, { payload: accountManagerConfirmation }) => {
        state.accountManagerConfirmationLoading = false;
        state.accountManagerConfirmation = accountManagerConfirmation;
      },
    );
    builder.addCase(accountManagerConfirmationRequest.rejected, (state, { payload }) => {
      state.accountManagerConfirmationLoading = false;
      if (payload && typeof payload === 'object' && 'detail' in payload && 'status' in payload) {
        state.accountManagerConfirmationError = {
          ...state.accountManagerConfirmationError,
          detail: payload.detail as string | null,
          status: payload.status as number | null,
        };
      }
    });

    builder.addCase(vehicleCreateRequest.pending, (state) => {
      state.vehicleCreateRequestLoading = true;
      state.vehicleCreateRequestSuccess = false;
      state.vehicleCreateRequestError = null;
    });
    builder.addCase(vehicleCreateRequest.fulfilled, (state) => {
      state.vehicleCreateRequestLoading = false;
      state.vehicleCreateRequestSuccess = true;
      state.vehicleCreateRequestError = null;
    });
    builder.addCase(vehicleCreateRequest.rejected, (state, { payload }) => {
      state.vehicleCreateRequestLoading = false;
      state.vehicleCreateRequestSuccess = false;
      if (payload && typeof payload === 'object' && 'detail' in payload && 'status' in payload) {
        state.vehicleCreateRequestError = {
          ...state.vehicleCreateRequestError,
          detail: payload.detail as string | null,
          status: payload.status as number | null,
        };
      }
    });

    builder.addCase(deleteRequest.pending, (state) => {
      state.vehicleDeleteLoading = true;
      state.vehicleErrorsDelete = null;
    });
    builder.addCase(deleteRequest.fulfilled, (state, action: PayloadAction<{ id: string }>) => {
      if (state.requests?.length) {
        state.requests = state.requests.filter((item) => item.id !== Number(action.payload.id));
      }
      state.vehicleDeleteLoading = false;
      state.vehicleErrorsDelete = null;
    });
    builder.addCase(deleteRequest.rejected, (state, { payload }) => {
      state.vehicleDeleteLoading = false;
      if (payload && typeof payload === 'object' && 'detail' in payload && 'status' in payload) {
        state.userVehicleInfoError = {
          ...state.userVehicleInfoError,
          detail: payload.detail as string | null,
          status: payload.status as number | null,
        };
      }
    });
  },
});

export const {
  managerChangeProfileHandler,
  setManagerProfile,
  inquiriesSuccessNull,
  deleteRequests,
  clearRequestsPagination,
} = accountsSlice.actions;
export const accountsSelector = (state: RootState) => state.accounts;
export default accountsSlice.reducer;
