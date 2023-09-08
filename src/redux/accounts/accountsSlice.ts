import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { message } from 'antd';

import {
  accountsManagerConfirmation,
  apksPagination,
  generatedPassword,
  IAccount,
  IApk,
  IErrors,
  IMyData,
  ITechniqueVehicleInfoPut,
  IUpdateManagerDataMutation,
  IVehicle,
  pagination,
  Requestor,
  RequestType,
  updateManagerDataMutation,
  userVehicleInfo,
  userVehicles,
  ValidationUpdateManagerProfile,
} from 'interfaces';
import { IConfig } from 'interfaces/IConfig';
import { RootState } from 'redux/hooks';
import axiosApi from 'utils/axios-api';
import { getErrorMessage } from 'utils/helper';
import toQueryParams from 'utils/toQueryParams';

const nameSpace = 'accounts';

interface AccountsState {
  apk: IApk[] | null;
  apksPagination: apksPagination | null;
  apkLoading: boolean;
  apkError: IErrors | null;
  uploadLastApkLoading: boolean;
  uploadLastApkError: IErrors | null;
  configs: IConfig | null;
  configsLoading: boolean;
  configsError: IErrors | null;
  account: IAccount | null;
  fetchLoadingAccount: boolean;
  fetchErrorAccount: IErrors | null;
  updateManagerData: updateManagerDataMutation;
  updateManagerDataLoading: boolean;
  updateManagerDataError: IErrors | null;
  userVehicles: userVehicles[] | undefined;
  userVehiclesPagination: pagination | null;
  fetchUserVehiclesLoading: boolean;
  fetchUserVehiclesError: IErrors | null;
  inquiriesLoading: boolean;
  inquiriesError: IErrors | null;
  inquiriesSuccess: boolean | null;
  requests: Requestor[] | undefined;
  requestsPagination: pagination | null;
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
  approveRegisterRequestLoading: boolean;
  approveRegisterRequestError: IErrors | null;
  approveRegisterRequestSuccess: boolean;
  changeProfileLoading: boolean;
  changeProfileError: IErrors | null;
  requestApproveChangeProfileLoading: boolean;
  requestApproveChangeProfileError: IErrors | null;
  postNotificationRequestLoading: boolean;
  postNotificationRequestError: IErrors | null;
  techniqueVehicleUpdate: {
    results: IVehicle | null;
    loading: boolean;
    errors: unknown;
  };
}

const INITIAL_STATE = {
  apk: null,
  apksPagination: null,
  apkLoading: false,
  apkError: null,
  uploadLastApkLoading: false,
  uploadLastApkError: null,
  configs: null,
  configsLoading: false,
  configsError: null,
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

  approveRegisterRequestLoading: false,
  approveRegisterRequestError: null,
  approveRegisterRequestSuccess: false,

  changeProfileLoading: false,
  changeProfileError: null,

  requestApproveChangeProfileLoading: false,
  requestApproveChangeProfileError: null,

  postNotificationRequestLoading: false,
  postNotificationRequestError: null,

  techniqueVehicleUpdate: {
    results: null,
    loading: false,
    errors: null,
  },
} as AccountsState;

interface fetchApksParams {
  data?: {
    query?: {
      page?: number | undefined;
    };
  };
}

export const fetchApks = createAsyncThunk<apksPagination, fetchApksParams>(
  'accounts/fetchApks',
  async ({ data }, { rejectWithValue }) => {
    try {
      let query = '';
      if (data?.query) {
        query = toQueryParams(data.query);
      }

      const resp = await axiosApi.get<apksPagination>(`/common/apks/${query}`);
      return resp.data;
    } catch (e) {
      return rejectWithValue({
        detail: e?.response?.data?.detail,
        status: e?.response?.status,
      });
    }
  },
);

export const fetchConfigs = createAsyncThunk<IConfig, void>(
  'accounts/fetchConfigs',
  async (_, { rejectWithValue }) => {
    try {
      const resp = await axiosApi.get<IConfig>(`/common/config/`);
      return resp.data;
    } catch (e) {
      return rejectWithValue({
        detail: e?.response?.data?.detail,
        status: e?.response?.status,
      });
    }
  },
);

export const fetchAccount = createAsyncThunk(
  'accounts/fetchManager',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const resp = await axiosApi.get<IAccount | null>('/accounts/');
      const account = resp.data;
      if (account === null) {
        throw new Error('Not Found!');
      }
      if (account?.company?.weather_service) {
        await dispatch(fetchConfigs());
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
      const resp = await axiosApi.patch(`/accounts/managers/`, data);
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

export const fetchUserVehicles = createAsyncThunk(
  'accounts/fetchUserVehicles',
  async (
    {
      id,
      page,
    }: {
      id: number | undefined | null;
      page: number | null | undefined;
    },
    { rejectWithValue },
  ) => {
    try {
      const resp = await axiosApi.get<userVehicles | null>(
        `/enterprises/${id}/vehicles/?page=${page}`,
      );
      return resp.data;
    } catch (e) {
      return rejectWithValue({
        detail: e?.response?.data?.detail,
        status: e?.response?.status,
      });
    }
  },
);

export const requestChangeProfile = createAsyncThunk<void, IMyData | FormData>(
  `${nameSpace}/requestChangeProfile`,
  async (data, { rejectWithValue }) => {
    try {
      const resp = await axiosApi.post(`/common/inquiries/`, data);
      message.success('Запрос успешно отправлен!');
      return resp.data;
    } catch (e) {
      return rejectWithValue(e);
    }
  },
);

interface approveChangeProfileParams {
  id: number | undefined;
  data: FormData | null;
}

export const requestApproveChangeProfile = createAsyncThunk<void, approveChangeProfileParams>(
  `${nameSpace}/requestApproveChangeProfile`,
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const resp = await axiosApi.post(`/common/inquiries/${id}/`, data);
      message.success('Запрос успешно принят!');
      return resp.data.id;
    } catch (e) {
      return rejectWithValue(e);
    }
  },
);

export const approveFieldClimateRequest = createAsyncThunk<void, IMyData>(
  `${nameSpace}/approveFieldClimateRequest`,
  async (data, { rejectWithValue }) => {
    try {
      const resp = await axiosApi.post(`/common/inquiries/`, data);
      message.success('Запрос успешно отправлен!');

      return resp.data;
    } catch (e) {
      if (data.category === 1) {
        return rejectWithValue({
          detail: e?.response?.data,
          status: e?.response?.status,
        });
      }
      return rejectWithValue({
        detail: e?.response?.data?.non_field_errors,
        status: e?.response?.status,
      });
    }
  },
);

export const approveRegisterRequest = createAsyncThunk<void, IMyData>(
  `${nameSpace}/approveRegisterRequest`,
  async (data, { rejectWithValue }) => {
    try {
      const resp = await axiosApi.post(`/common/inquiries/`, data);
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
      const res = await axiosApi.post(`/common/inquiries/${data?.id}/`, data?.data);
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
      await axiosApi.delete(`/common/inquiries/${id}/`);
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

export const fetchRequests = createAsyncThunk<accountsManagerConfirmation, fetchRequestsParams>(
  'accounts/fetchRequests',
  async ({ data }, { rejectWithValue }) => {
    try {
      let query = '';
      if (data?.query) {
        query = toQueryParams(data.query);
      }
      const resp = await axiosApi.get(`/common/inquiries/${query}`);
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
      const resp = await axiosApi.post(`/common/inquiries/`, data);
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
    const resp = await axiosApi.post<accountsManagerConfirmation | null>(
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

export const fetchVehicleInfo = createAsyncThunk(
  'accounts/fetchVehicleInfo',
  async (
    { vehicleId, pageUrl }: { vehicleId: string | null; pageUrl: string | null },
    { rejectWithValue },
  ) => {
    try {
      const resp = await axiosApi.get(`/vehicles/${vehicleId}/jobs/?page=${pageUrl}`);
      return resp.data;
    } catch (e) {
      return rejectWithValue({
        detail: e?.response?.data?.detail,
        status: e?.response?.status,
      });
    }
  },
);

interface generateNewPasswordParams {
  user_id: number | undefined;
}

export const generateNewPassword = createAsyncThunk<generatedPassword, generateNewPasswordParams>(
  `${nameSpace}/generateNewPassword`,
  async (data, { rejectWithValue }) => {
    try {
      const resp = await axiosApi.patch(`/accounts/new-password/`, data);
      return resp.data;
    } catch (e) {
      return rejectWithValue({
        detail: e?.response?.data,
        status: e?.response?.status,
      });
    }
  },
);

export const postNotificationRequest = createAsyncThunk(
  `${nameSpace}/postNotificationRequest`,
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosApi.post(`/accounts/latest-version/`);
      return res?.data;
    } catch (e) {
      return rejectWithValue({
        detail: e?.response?.data,
        status: e?.response?.status,
      });
    }
  },
);

export const techniqueVehicleInfoPut = createAsyncThunk(
  `${nameSpace}/techniqueVehicleInfoPut`,
  async ({ id, formData }: ITechniqueVehicleInfoPut, { rejectWithValue }) => {
    try {
      const response = await axiosApi.post(`/common/inquiries/${id}/`, formData);
      return response.data.id;
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
    clearRequestsPagination: (state) => {
      state.requestsPagination = null;
      state.userVehiclesPagination = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchApks.pending, (state) => {
        state.apkLoading = true;
        state.apkError = null;
      })
      .addCase(fetchApks.fulfilled, (state, { payload }) => {
        state.apkLoading = false;
        state.apk = payload.results;
        state.apksPagination = {
          ...state.apksPagination,
          count: payload.count,
          next: payload?.next || null,
          previous: payload?.previous || null,
        } as apksPagination;
      })
      .addCase(fetchApks.rejected, (state, { payload }) => {
        state.apkLoading = false;
        if (payload && typeof payload === 'object' && 'detail' in payload && 'status' in payload) {
          state.apkError = {
            ...state.apkError,
            detail: payload.detail as string | null,
            status: payload.status as number | null,
          };
        }
      });

    builder
      .addCase(fetchConfigs.pending, (state) => {
        state.configsLoading = true;
        state.configsError = null;
      })
      .addCase(fetchConfigs.fulfilled, (state, action) => {
        state.configsLoading = false;
        state.configs = action.payload;
      })
      .addCase(fetchConfigs.rejected, (state, { payload }) => {
        state.configsLoading = false;
        if (payload && typeof payload === 'object' && 'detail' in payload && 'status' in payload) {
          state.configsError = {
            ...state.configsError,
            detail: payload.detail as string | null,
            status: payload.status as number | null,
          };
        }
      });

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
        next: payload.next,
        previous: payload.previous,
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

    builder.addCase(requestChangeProfile.pending, (state) => {
      state.changeProfileLoading = true;
      state.changeProfileError = null;
    });
    builder.addCase(requestChangeProfile.fulfilled, (state) => {
      state.changeProfileLoading = false;
      state.changeProfileError = null;
    });
    builder.addCase(requestChangeProfile.rejected, (state, { payload }) => {
      state.changeProfileLoading = false;
      if (payload && typeof payload === 'object' && 'detail' in payload && 'status' in payload) {
        state.changeProfileError = {
          ...state.changeProfileError,
          detail: payload.detail as string | null,
          status: payload.status as number | null,
        };
      }
    });

    builder.addCase(approveRegisterRequest.pending, (state) => {
      state.approveRegisterRequestLoading = true;
      state.approveRegisterRequestError = null;
      state.approveRequestSuccess = false;
    });
    builder.addCase(approveRegisterRequest.fulfilled, (state) => {
      state.approveRegisterRequestLoading = false;
      state.approveRegisterRequestError = null;
      state.approveRequestSuccess = true;
    });
    builder.addCase(approveRegisterRequest.rejected, (state, { payload }) => {
      state.approveRegisterRequestLoading = false;
      if (payload && typeof payload === 'object' && 'detail' in payload && 'status' in payload) {
        state.approveRegisterRequestError = {
          ...state.approveRegisterRequestError,
          detail: payload.detail as string | null,
          status: payload.status as number | null,
        };
      }
      state.approveRequestSuccess = false;
    });

    builder.addCase(approveRequest.pending, (state) => {
      state.approveRequestLoading = true;
      state.approveRequestError = null;
      state.approveRequestSuccess = false;
    });
    builder.addCase(approveRequest.fulfilled, (state) => {
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
    builder.addCase(fetchVehicleInfo.fulfilled, (state, { payload }) => {
      state.userVehicleInfoLoading = false;
      state.userVehicleInfo = payload;
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

    builder.addCase(requestApproveChangeProfile.pending, (state) => {
      state.requestApproveChangeProfileLoading = true;
      state.requestApproveChangeProfileError = null;
    });
    builder.addCase(requestApproveChangeProfile.fulfilled, (state, action) => {
      if (state.requests?.length) {
        state.requests = state.requests.filter((item) => {
          return item.id !== Number(action.payload);
        });
      }
      state.requestApproveChangeProfileLoading = false;
      state.requestApproveChangeProfileError = null;
    });
    builder.addCase(requestApproveChangeProfile.rejected, (state, { payload }) => {
      state.requestApproveChangeProfileLoading = false;
      if (payload && typeof payload === 'object' && 'detail' in payload && 'status' in payload) {
        state.requestApproveChangeProfileError = {
          ...state.requestApproveChangeProfileError,
          detail: payload.detail as string | null,
          status: payload.status as number | null,
        };
      }
    });

    builder
      .addCase(postNotificationRequest.pending, (state) => {
        state.postNotificationRequestLoading = true;
        state.postNotificationRequestError = null;
      })
      .addCase(postNotificationRequest.fulfilled, (state) => {
        state.postNotificationRequestLoading = false;
        state.postNotificationRequestError = null;
      })
      .addCase(postNotificationRequest.rejected, (state, { payload }) => {
        state.postNotificationRequestLoading = false;
        if (payload && typeof payload === 'object' && 'detail' in payload && 'status' in payload) {
          state.postNotificationRequestError = {
            ...state.postNotificationRequestError,
            detail: payload.detail as string | null,
            status: payload.status as number | null,
          };
        }
      });

    builder.addCase(techniqueVehicleInfoPut.pending, (state) => {
      state.techniqueVehicleUpdate.loading = true;
      state.techniqueVehicleUpdate.errors = null;
    });
    builder.addCase(techniqueVehicleInfoPut.fulfilled, (state, action) => {
      if (state.requests?.length) {
        state.requests = state.requests.filter((item) => {
          return item.id !== Number(action.payload);
        });
      }
      state.techniqueVehicleUpdate.results = action.payload;
      state.techniqueVehicleUpdate.loading = false;
      state.techniqueVehicleUpdate.errors = null;
    });
    builder.addCase(techniqueVehicleInfoPut.rejected, (state, { payload }) => {
      state.techniqueVehicleUpdate.loading = false;
      state.techniqueVehicleUpdate.errors = payload;
    });
  },
});

export const {
  managerChangeProfileHandler,
  setManagerProfile,
  inquiriesSuccessNull,
  clearRequestsPagination,
} = accountsSlice.actions;
export const accountsSelector = (state: RootState) => state.accounts;

export default accountsSlice.reducer;
export const techniqueVehicleUpdateSelector = (state: RootState) =>
  state.accounts.techniqueVehicleUpdate;
