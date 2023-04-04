import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { message } from 'antd';

import { RootState } from 'redux/hooks';
import {
  accountsManagerConfirmation,
  generatedPassword,
  IManager,
  IUserAccount,
  IUserRegister,
  updateManagerDataMutation,
  userRequest,
  userRequestPagination,
  userVehicleInfo,
  userVehicles,
  userVehiclesPagination,
  ValidationUpdateManagerProfile,
} from 'types/types';
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
  registerUserLoading: boolean;
  registerUserError: Object | null;
  registerUserSuccess: boolean | null;
  requests: userRequest[] | undefined;
  requestsPagination: userRequestPagination | null;
  fetchRequestsLoading: boolean;
  fetchRequestsError: Object | null;
  userVehicleInfo: userVehicleInfo | null;
  userVehicleInfoLoading: boolean;
  userVehicleInfoError: Object | null;
  generatePasswordLoading: boolean;
  generatePasswordError: Object | null;
  generatedPassword: string | null;
  accountManagerConfirmation: accountsManagerConfirmation | null;
  accountManagerConfirmationLoading: boolean;
  accountManagerConfirmationError: Object | null;
  vehicleCreateRequestLoading: boolean;
  vehicleCreateRequestError: Object | null;
  vehicleCreateRequestSuccess: boolean;
  vehicleDeleteLoading: boolean;
  vehicleErrorsDelete: Object | null;
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

  registerUserLoading: false,
  registerUserError: null,
  registerUserSuccess: false,

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
  data: FormData;
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

interface registerUserParams {
  data: IUserRegister;
}

export const registerUser = createAsyncThunk<void, registerUserParams>(
  `${nameSpace}/registerUser`,
  async (data, { rejectWithValue }) => {
    try {
      const resp = await axiosApi.post(`/accounts/user/confirmation/create/`, data?.data);
      message.success('Запрос успешно отправлен!');

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

export const deleteUserTechnique = createAsyncThunk(
  `${nameSpace}/deleteUserTechnique`,
  async (
    {
      id,
    }: {
      id: string;
    },
    { rejectWithValue },
  ) => {
    try {
      await axiosApi.delete(`/accounts/manager/confirmation/${id}/`);
      message.success('Успешно удалено');
      return {
        id,
      };
    } catch (e) {
      let error = e?.response?.data;
      if (!e.response) {
        error = defaultError;
      }
      return rejectWithValue(error);
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
      const resp = await axiosApi.get<userRequest | null>(
        `/accounts/manager/confirmation/${query}`,
      );
      const requests = resp.data;

      if (requests === null) {
        throw new Error('Not Found!');
      }

      return requests;
    } catch (e) {
      let error = e?.response?.data;
      if (!e.response) {
        error = defaultError;
      }
      return rejectWithValue(error);
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
      const resp = await axiosApi.post(`/accounts/user/confirmation/vehicle/`, data);
      message.success('Запрос успешно отправлен!');

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

interface accountManagerConfirmationParams {
  id: string | null | undefined;
}

export const accountManagerConfirmationRequest = createAsyncThunk<
  accountsManagerConfirmation,
  accountManagerConfirmationParams
>('accounts/accountManagerConfirmationRequest', async (data, { rejectWithValue }) => {
  try {
    const resp = await axiosApi.patch<accountsManagerConfirmation | null>(
      `/accounts/manager/confirmation/${data?.id}/`,
    );
    const accountManagerConfirmation = resp.data;

    if (accountManagerConfirmation === null) {
      throw new Error('Not Found!');
    }

    return accountManagerConfirmation;
  } catch (e) {
    let error = e?.response?.data;
    if (!e.response) {
      error = defaultError;
    }
    return rejectWithValue(error);
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
      let error = e?.response?.data;
      if (!e.response) {
        error = defaultError;
      }
      return rejectWithValue(error);
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
    registerSuccessNull: (state) => {
      state.registerUserSuccess = false;
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

    builder.addCase(registerUser.pending, (state) => {
      state.registerUserLoading = true;
      state.registerUserError = null;
      state.registerUserSuccess = false;
    });
    builder.addCase(registerUser.fulfilled, (state) => {
      state.registerUserLoading = false;
      state.registerUserError = null;
      state.registerUserSuccess = true;
    });
    builder.addCase(registerUser.rejected, (state, { payload }: any) => {
      state.registerUserLoading = false;
      state.registerUserError = payload;
      state.registerUserSuccess = false;
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
        next: payload.links.next,
        previous: payload.links.previous,
      };
    });
    builder.addCase(fetchRequests.rejected, (state, { payload }: any) => {
      state.fetchRequestsLoading = false;
      state.fetchRequestsError = payload?.detail;
    });

    builder.addCase(fetchVehicleInfo.pending, (state) => {
      state.userVehicleInfoLoading = true;
      state.userVehicleInfoError = null;
    });
    builder.addCase(fetchVehicleInfo.fulfilled, (state, { payload: vehicleInfo }: any) => {
      state.userVehicleInfoLoading = false;
      state.userVehicleInfo = vehicleInfo;
    });
    builder.addCase(fetchVehicleInfo.rejected, (state, { payload }: any) => {
      state.userVehicleInfoLoading = false;
      state.userVehicleInfoError = payload?.detail;
    });
    builder.addCase(generateNewPassword.pending, (state) => {
      state.generatePasswordLoading = true;
      state.generatePasswordError = null;
    });
    builder.addCase(generateNewPassword.fulfilled, (state, { payload }: any) => {
      state.generatePasswordLoading = false;
      state.generatedPassword = payload.generated_password;
    });
    builder.addCase(generateNewPassword.rejected, (state, { payload }: any) => {
      state.generatePasswordLoading = false;
      state.generatePasswordError = payload?.detail;
    });
    builder.addCase(accountManagerConfirmationRequest.pending, (state) => {
      state.accountManagerConfirmationLoading = true;
      state.accountManagerConfirmationError = null;
    });
    builder.addCase(
      accountManagerConfirmationRequest.fulfilled,
      (state, { payload: accountManagerConfirmation }: any) => {
        state.accountManagerConfirmationLoading = false;
        state.accountManagerConfirmation = accountManagerConfirmation;
      },
    );
    builder.addCase(accountManagerConfirmationRequest.rejected, (state, { payload }: any) => {
      state.accountManagerConfirmationLoading = false;
      state.accountManagerConfirmationError = payload?.detail;
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
    builder.addCase(vehicleCreateRequest.rejected, (state, { payload }: any) => {
      state.vehicleCreateRequestLoading = false;
      state.vehicleCreateRequestSuccess = false;
      state.vehicleCreateRequestError = payload?.detail;
    });

    builder.addCase(deleteUserTechnique.pending, (state) => {
      state.vehicleDeleteLoading = true;
      state.vehicleErrorsDelete = null;
    });
    builder.addCase(
      deleteUserTechnique.fulfilled,
      (state, action: PayloadAction<{ id: string }>) => {
        if (state.requests?.length) {
          state.requests = state.requests.filter((item) => item.id !== Number(action.payload.id));
        }
        state.vehicleDeleteLoading = false;
        state.vehicleErrorsDelete = null;
      },
    );
    builder.addCase(deleteUserTechnique.rejected, (state, { payload }: any) => {
      state.vehicleDeleteLoading = false;
      state.vehicleErrorsDelete = payload?.detail;
    });
  },
});

export const { managerChangeProfileHandler, setManagerProfile, registerSuccessNull } =
  accountsSlice.actions;
export const accountsSelector = (state: RootState) => state.accounts;
export default accountsSlice.reducer;
