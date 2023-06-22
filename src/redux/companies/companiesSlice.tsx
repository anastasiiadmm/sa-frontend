import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { message } from 'antd';

import {
  companiesList,
  IAccount,
  ICompany,
  IErrors,
  ITechniqueVehicleInfoPut,
  IVehicle,
  pagination,
  RequestType,
  userMutation,
  VehicleList,
  vehicleListPagination,
  VehicleType,
} from 'interfaces';
import { RootState } from 'redux/hooks';
import axiosApi from 'utils/axios-api';
import toQueryParams from 'utils/toQueryParams';

const nameSpace = 'companies';

interface CompaniesState {
  companies: IAccount[] | null;
  fetchCompaniesLoading: boolean;
  fetchCompaniesError: IErrors | null;
  companiesListPagination: pagination | null;
  userCreate: userMutation | null;
  userCreateLoading: boolean;
  userCreateError: IErrors | null;
  userInfo: RequestType | null;
  userInfoLoading: boolean;
  userInfoError: IErrors | null;
  updateUserInfoLoading: boolean;
  updateUserInfoError: IErrors | null;
  updateUserData: IAccount | null;
  updateUserDataLoading: boolean;
  updateUserDataError: Object | null;
  deleteUserInfoLoading: boolean;
  deleteUserInfoError: IErrors | null;
  vehicleList: VehicleList[];
  fetchVehicleListLoading: boolean;
  fetchVehicleListError: IErrors | null;
  vehicleListPagination: vehicleListPagination | null;
  userVehicleInfo: VehicleType | null;
  userVehicleInfoLoading: boolean;
  userVehicleInfoError: IErrors | null;
  vehicleCreateLoading: boolean;
  vehicleCreateSuccess: boolean;
  vehicleCreateError: IErrors | Object | null;
  patchUserVehicleInfoLoading: boolean;
  patchUserVehicleInfoError: IErrors | Object | null;
  deleteUserVehicleLoading: boolean;
  deleteUserVehicleError: IErrors | null;
  techniqueVehicleInfo: {
    results: IVehicle | null;
    loading: boolean;
    errors: IErrors | null;
  };
  techniqueVehicleUpdate: {
    results: IVehicle | null;
    loading: boolean;
    errors: unknown;
  };
  userInfoByManager: IAccount | null;
  userInfoByManagerLoading: boolean;
  userInfoByManagerError: IErrors | null;
}

const INITIAL_STATE = {
  companies: null,
  fetchCompaniesLoading: false,
  fetchCompaniesError: null,
  companiesListPagination: null,

  userCreate: null,
  userCreateLoading: false,
  userCreateError: null,

  userInfo: null,
  userInfoLoading: false,
  userInfoError: null,

  updateUserInfoLoading: false,
  updateUserInfoError: null,

  updateUserData: {
    coords_timeout: 0,
    email: '',
    first_name: '',
    image: '',
    is_manager: false,
    last_name: '',
    middle_name: '',
    phone: '',
    username: '',
    company: {
      autopilots_amount: 0,
      location: '',
      meteo_requested: false,
      name: '',
      vehicles_number: 0,
      weather_service: false,
    },
  },
  updateUserDataLoading: false,
  updateUserDataError: null,

  deleteUserInfoLoading: false,
  deleteUserInfoError: null,

  vehicleList: [],
  fetchVehicleListLoading: false,
  fetchVehicleListError: null,
  vehicleListPagination: null,

  userVehicleInfo: null,
  userVehicleInfoLoading: false,
  userVehicleInfoError: null,

  vehicleCreateLoading: false,
  vehicleCreateSuccess: false,
  vehicleCreateError: null,

  patchUserVehicleInfoLoading: false,
  patchUserVehicleInfoError: null,

  deleteUserVehicleLoading: false,
  deleteUserVehicleError: null,
  techniqueVehicleInfo: {
    results: null,
    loading: false,
    errors: null,
  },
  techniqueVehicleUpdate: {
    results: null,
    loading: false,
    errors: null,
  },
  saveTechniqueVehicle: {
    results: null,
    loading: false,
    errors: null,
  },

  userInfoByManager: null,
  userInfoByManagerLoading: false,
  userInfoByManagerError: null,
} as CompaniesState;

interface fetchCompaniesParams {
  data?: {
    query?: {
      page?: number | undefined;
    };
  };
}

export const fetchUsersList = createAsyncThunk<IAccount, fetchCompaniesParams>(
  'accounts/fetchUsersList',
  async ({ data }, { rejectWithValue }) => {
    try {
      let query = '';
      if (data?.query) {
        query = toQueryParams(data.query);
      }
      const resp = await axiosApi.get<IAccount | null>(`/accounts/users/${query}`);
      const companies = resp.data;

      if (companies === null) {
        throw new Error('Not Found!');
      }

      return companies;
    } catch (e) {
      return rejectWithValue({
        detail: e?.response?.data?.detail,
        status: e?.response?.status,
      });
    }
  },
);

interface userCreateParams {
  data: ICompany;
}

export const userCreate = createAsyncThunk<void, userCreateParams>(
  `${nameSpace}/userCreate`,
  async ({ data }, { rejectWithValue }) => {
    try {
      const resp = await axiosApi.post(`/accounts/users/`, data);

      return resp.data;
    } catch (e) {
      return rejectWithValue({
        detail: e?.response?.data,
        status: e?.response?.status,
      });
    }
  },
);

interface fetchCompanyParams {
  id: number | string | null | undefined;
}

export const fetchUserInfo = createAsyncThunk<RequestType, fetchCompanyParams>(
  'accounts/fetchUserInfo',
  async ({ id }, { rejectWithValue }) => {
    try {
      const resp = await axiosApi.get<RequestType | null>(`/common/inquiries/${id}/`);
      const companyInfo = resp.data;

      if (companyInfo === null) {
        throw new Error('Not Found!');
      }

      return companyInfo;
    } catch (e) {
      return rejectWithValue({
        detail: e?.response?.data?.detail,
        status: e?.response?.status,
      });
    }
  },
);

interface fetchUserInfoByManagerParams {
  id: string | undefined;
}

export const fetchUserInfoByManager = createAsyncThunk<IAccount, fetchUserInfoByManagerParams>(
  'accounts/fetchUserInfoByManager',
  async ({ id }, { rejectWithValue }) => {
    try {
      const resp = await axiosApi.get<IAccount | null>(`/accounts/users/${id}/`);
      const userInfoByManager = resp.data;

      if (userInfoByManager === null) {
        throw new Error('Not Found!');
      }

      return userInfoByManager;
    } catch (e) {
      return rejectWithValue({
        detail: e?.response?.data?.detail,
        status: e?.response?.status,
      });
    }
  },
);

interface updateUserInfoParams {
  id: string | undefined;
  data: IAccount;
}

export const updateUserInfo = createAsyncThunk<void, updateUserInfoParams>(
  `${nameSpace}/updateUserInfo`,
  async ({ id, data }, { rejectWithValue, dispatch }) => {
    try {
      const resp = await axiosApi.patch(`/accounts/users/${id}/`, data);
      dispatch(fetchUserInfoByManager({ id }));
      message.success('Успешно изминились данные');
      return resp.data;
    } catch (e) {
      return rejectWithValue({
        detail: e?.response?.data,
        status: e?.response?.status,
      });
    }
  },
);

export const deleteUserInfo = createAsyncThunk<void, string>(
  `${nameSpace}/deleteUserInfo`,
  async (id, { rejectWithValue }) => {
    try {
      const resp = await axiosApi.delete(`/accounts/users/${id}/`);
      message.success('Данные успешно удалены!');

      return resp.data;
    } catch (e) {
      return rejectWithValue({
        detail: e?.response?.data,
        status: e?.response?.status,
      });
    }
  },
);

interface fetchVehicleParams {
  data?: {
    idVehicle?: string | null | undefined;
    query?: {
      page?: number | undefined;
    };
  };
}

export const fetchUserVehicleList = createAsyncThunk<companiesList, fetchVehicleParams>(
  'accounts/fetchUserVehicleList',
  async ({ data }, { rejectWithValue }) => {
    try {
      let query = '';
      if (data?.query) {
        query = toQueryParams(data.query);
      }
      const resp = await axiosApi.get<companiesList | null>(
        `/enterprises/${data?.idVehicle}/vehicles/${query}`,
      );
      const companies = resp.data;

      if (companies === null) {
        throw new Error('Not Found!');
      }

      return companies;
    } catch (e) {
      return rejectWithValue({
        detail: e?.response?.data?.detail,
        status: e?.response?.status,
      });
    }
  },
);

export const fetchUserVehicleInfo = createAsyncThunk(
  `${nameSpace}/fetchUserVehicleInfo`,
  async (id: string, { rejectWithValue }) => {
    try {
      const resp = await axiosApi.get(`/vehicles/${id}/`);
      return resp.data;
    } catch (e) {
      return rejectWithValue({
        detail: e?.response?.data?.detail,
        status: e?.response?.status,
      });
    }
  },
);

export const patchUserVehicleInfo = createAsyncThunk(
  `${nameSpace}/patchUserVehicleInfo`,
  async (
    {
      data,
    }: {
      data: VehicleType;
    },
    { rejectWithValue },
  ) => {
    try {
      const resp = await axiosApi.patch(`/vehicles/${data.id}/`, data);
      message.success('Данные успешно изменены!');
      return {
        ...resp.data,
        id: data.id,
      };
    } catch (e) {
      return rejectWithValue({
        detail: e?.response?.data,
        status: e?.response?.status,
      });
    }
  },
);

export const deleteUserVehicle = createAsyncThunk(
  `${nameSpace}/deleteUserVehicle`,
  async (id: string | null | undefined, { rejectWithValue }) => {
    try {
      await axiosApi.delete(`/vehicles/${id}/`);
      message.success('Данные успешно удалены!');
      return id;
    } catch (e) {
      return rejectWithValue({
        detail: e?.response?.data?.detail,
        status: e?.response?.status,
      });
    }
  },
);

interface vehicleCreateParams {
  data: VehicleType;
}

export const vehicleCreate = createAsyncThunk<void, vehicleCreateParams>(
  `${nameSpace}/vehicleCreate`,
  async (data, { rejectWithValue }) => {
    try {
      const resp = await axiosApi.post(`/vehicles/`, data?.data);
      return resp.data;
    } catch (e) {
      return rejectWithValue({
        detail: e?.response?.data,
        status: e?.response?.status,
      });
    }
  },
);

export const techniqueVehicleInfo = createAsyncThunk(
  `${nameSpace}/techniqueVehicleInfo`,
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await axiosApi.get(`/common/inquiries/${id}/`);
      return response.data;
    } catch (e) {
      return rejectWithValue({
        detail: e?.response?.data?.detail,
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
      return response.data;
    } catch (e) {
      return rejectWithValue({
        detail: e?.response?.data,
        status: e?.response?.status,
      });
    }
  },
);

const companiesSlice = createSlice({
  name: nameSpace,
  initialState: INITIAL_STATE,
  reducers: {
    setChangeUserProfile: (state: any, action: PayloadAction<IAccount>) => {
      state.updateUserData.coords_timeout = action.payload.coords_timeout;
      state.updateUserData.email = action.payload.email;
      state.updateUserData.first_name = action.payload.first_name;
      state.updateUserData.image = action.payload.image;
      state.updateUserData.is_manager = action.payload.is_manager;
      state.updateUserData.last_name = action.payload.last_name;
      state.updateUserData.middle_name = action.payload.middle_name;
      state.updateUserData.phone = action.payload.phone;
      state.updateUserData.username = action.payload.username;
      state.updateUserData.company = {
        autopilots_amount: action?.payload?.company?.autopilots_amount,
        location: action?.payload?.company?.location,
        meteo_requested: action?.payload?.company?.meteo_requested,
        name: action?.payload?.company?.name,
        vehicles_number: action?.payload?.company?.vehicles_number,
        weather_service: action?.payload?.company?.weather_service,
      };
    },
    setNullReducerVehicleCreate: (state) => {
      state.vehicleCreateSuccess = false;
    },
    clearUserInfo: (state) => {
      state.userInfo = null;
    },
    clearCompaniesPagination: (state) => {
      state.companiesListPagination = null;
      state.vehicleListPagination = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUsersList.pending, (state) => {
      state.fetchCompaniesLoading = true;
      state.fetchCompaniesError = null;
    });
    builder.addCase(fetchUsersList.fulfilled, (state, { payload }: any) => {
      state.fetchCompaniesLoading = false;
      state.fetchCompaniesError = null;
      state.companies = payload.results;
      state.companiesListPagination = {
        ...state.companiesListPagination,
        count: payload.count,
        next: payload.next,
        previous: payload.previous,
        vehicles_count: payload.vehicles_count,
      };
    });
    builder.addCase(fetchUsersList.rejected, (state, { payload }) => {
      state.fetchCompaniesLoading = false;
      if (payload && typeof payload === 'object' && 'detail' in payload && 'status' in payload) {
        state.fetchCompaniesError = {
          ...state.fetchCompaniesError,
          detail: payload.detail as string | null,
          status: payload.status as number | null,
        };
      }
    });

    builder.addCase(userCreate.pending, (state) => {
      state.userCreateLoading = true;
      state.userCreateError = null;
    });
    builder.addCase(userCreate.fulfilled, (state, { payload }) => {
      state.userCreateLoading = false;
      state.userCreateError = null;
      if (typeof payload !== 'undefined') {
        state.userCreate = payload;
      }
    });
    builder.addCase(userCreate.rejected, (state, { payload }) => {
      state.userCreateLoading = false;
      if (payload && typeof payload === 'object' && 'detail' in payload && 'status' in payload) {
        state.userCreateError = {
          ...state.userCreateError,
          detail: payload.detail as string | null,
          status: payload.status as number | null,
        };
      }
    });

    builder.addCase(fetchUserInfo.pending, (state) => {
      state.userInfoLoading = true;
      state.userInfoError = null;
    });
    builder.addCase(fetchUserInfo.fulfilled, (state, { payload: companyInfo }) => {
      state.userInfoLoading = false;
      state.userInfo = companyInfo;
    });
    builder.addCase(fetchUserInfo.rejected, (state, { payload }) => {
      state.userInfoLoading = false;
      if (payload && typeof payload === 'object' && 'detail' in payload && 'status' in payload) {
        state.userInfoError = {
          ...state.userInfoError,
          detail: payload.detail as string | null,
          status: payload.status as number | null,
        };
      }
    });

    builder.addCase(fetchUserInfoByManager.pending, (state) => {
      state.userInfoByManagerLoading = true;
      state.userInfoByManagerError = null;
    });
    builder.addCase(fetchUserInfoByManager.fulfilled, (state, { payload: userInfoByManager }) => {
      state.userInfoByManagerLoading = false;
      state.userInfoByManager = userInfoByManager;
    });
    builder.addCase(fetchUserInfoByManager.rejected, (state, { payload }) => {
      state.userInfoByManagerLoading = false;
      if (payload && typeof payload === 'object' && 'detail' in payload && 'status' in payload) {
        state.userInfoByManagerError = {
          ...state.userInfoByManagerError,
          detail: payload.detail as string | null,
          status: payload.status as number | null,
        };
      }
    });

    builder.addCase(updateUserInfo.pending, (state) => {
      state.updateUserInfoLoading = true;
      state.updateUserInfoError = null;
    });
    builder.addCase(updateUserInfo.fulfilled, (state) => {
      state.updateUserInfoLoading = false;
      state.updateUserInfoError = null;
    });
    builder.addCase(updateUserInfo.rejected, (state, { payload }) => {
      state.updateUserInfoLoading = false;
      if (payload && typeof payload === 'object' && 'detail' in payload && 'status' in payload) {
        state.updateUserInfoError = {
          ...state.updateUserInfoError,
          detail: payload.detail as string | null,
          status: payload.status as number | null,
        };
      }
    });

    builder.addCase(deleteUserInfo.pending, (state) => {
      state.deleteUserInfoLoading = true;
      state.deleteUserInfoError = null;
    });
    builder.addCase(deleteUserInfo.fulfilled, (state) => {
      state.deleteUserInfoLoading = false;
    });
    builder.addCase(deleteUserInfo.rejected, (state, { payload }) => {
      state.deleteUserInfoLoading = false;
      if (payload && typeof payload === 'object' && 'detail' in payload && 'status' in payload) {
        state.deleteUserInfoError = {
          ...state.deleteUserInfoError,
          detail: payload.detail as string | null,
          status: payload.status as number | null,
        };
      }
    });

    builder.addCase(fetchUserVehicleList.pending, (state) => {
      state.fetchVehicleListLoading = true;
      state.fetchVehicleListError = null;
    });
    builder.addCase(fetchUserVehicleList.fulfilled, (state, { payload }: any) => {
      state.fetchVehicleListLoading = false;
      state.fetchVehicleListError = null;
      state.vehicleList = payload.results;
      state.vehicleListPagination = {
        ...state.vehicleListPagination,
        count: payload.count,
        next: payload.next,
        previous: payload.previous,
      };
    });
    builder.addCase(fetchUserVehicleList.rejected, (state, { payload }) => {
      state.fetchVehicleListLoading = false;
      if (payload && typeof payload === 'object' && 'detail' in payload && 'status' in payload) {
        state.fetchVehicleListError = {
          ...state.fetchVehicleListError,
          detail: payload.detail as string | null,
          status: payload.status as number | null,
        };
      }
    });

    builder.addCase(fetchUserVehicleInfo.pending, (state) => {
      state.userVehicleInfoLoading = true;
      state.userVehicleInfoError = null;
    });
    builder.addCase(fetchUserVehicleInfo.fulfilled, (state, { payload }) => {
      state.userVehicleInfoLoading = false;
      state.userVehicleInfo = payload;
    });
    builder.addCase(fetchUserVehicleInfo.rejected, (state, { payload }) => {
      state.userVehicleInfoLoading = false;
      if (payload && typeof payload === 'object' && 'detail' in payload && 'status' in payload) {
        state.userVehicleInfoError = {
          ...state.userVehicleInfoError,
          detail: payload.detail as string | null,
          status: payload.status as number | null,
        };
      }
    });

    builder.addCase(vehicleCreate.pending, (state) => {
      state.vehicleCreateLoading = true;
      state.vehicleCreateSuccess = false;
      state.vehicleCreateError = null;
    });
    builder.addCase(vehicleCreate.fulfilled, (state) => {
      state.vehicleCreateLoading = false;
      state.vehicleCreateSuccess = true;
      state.vehicleCreateError = null;
    });
    builder.addCase(vehicleCreate.rejected, (state, { payload }) => {
      state.vehicleCreateLoading = false;
      state.vehicleCreateSuccess = false;
      if (payload && typeof payload === 'object' && 'detail' in payload && 'status' in payload) {
        state.vehicleCreateError = {
          ...state.vehicleCreateError,
          detail: payload.detail as string | null,
          status: payload.status as number | null,
        };
      }
    });

    builder.addCase(patchUserVehicleInfo.pending, (state) => {
      state.patchUserVehicleInfoLoading = true;
      state.patchUserVehicleInfoError = null;
    });
    builder.addCase(
      patchUserVehicleInfo.fulfilled,
      (state, { payload }: PayloadAction<VehicleType>) => {
        state.patchUserVehicleInfoLoading = false;
        state.patchUserVehicleInfoError = null;
        state.vehicleList = state.vehicleList.map((item) => {
          if (item.id === Number(payload.id)) {
            return {
              ...item,
              description: payload.description,
            };
          }
          return item;
        });
      },
    );
    builder.addCase(patchUserVehicleInfo.rejected, (state, { payload }) => {
      state.patchUserVehicleInfoLoading = false;
      if (payload && typeof payload === 'object' && 'detail' in payload && 'status' in payload) {
        state.patchUserVehicleInfoError = {
          ...state.patchUserVehicleInfoError,
          detail: payload.detail as string | null,
          status: payload.status as number | null,
        };
      }
    });

    builder.addCase(deleteUserVehicle.pending, (state) => {
      state.deleteUserVehicleLoading = true;
      state.deleteUserVehicleError = null;
    });
    builder.addCase(deleteUserVehicle.fulfilled, (state, { payload }) => {
      state.deleteUserVehicleLoading = false;
      state.deleteUserVehicleError = null;
      state.vehicleList = state.vehicleList.filter((item) => item.id !== Number(payload));
    });
    builder.addCase(deleteUserVehicle.rejected, (state, { payload }) => {
      state.deleteUserVehicleLoading = false;
      if (payload && typeof payload === 'object' && 'detail' in payload && 'status' in payload) {
        state.deleteUserVehicleError = {
          ...state.deleteUserVehicleError,
          detail: payload.detail as string | null,
          status: payload.status as number | null,
        };
      }
    });
    builder.addCase(techniqueVehicleInfo.pending, (state) => {
      state.techniqueVehicleInfo.loading = true;
      state.techniqueVehicleInfo.errors = null;
    });
    builder.addCase(techniqueVehicleInfo.fulfilled, (state, action: PayloadAction<IVehicle>) => {
      state.techniqueVehicleInfo.results = action.payload;
      state.techniqueVehicleInfo.loading = false;
      state.techniqueVehicleInfo.errors = null;
    });
    builder.addCase(techniqueVehicleInfo.rejected, (state, { payload }) => {
      state.techniqueVehicleInfo.loading = false;
      if (payload && typeof payload === 'object' && 'detail' in payload && 'status' in payload) {
        state.techniqueVehicleInfo.errors = {
          ...state.techniqueVehicleInfo.errors,
          detail: payload.detail as string | null,
          status: payload.status as number | null,
        };
      }
    });

    builder.addCase(techniqueVehicleInfoPut.pending, (state) => {
      state.techniqueVehicleUpdate.loading = true;
      state.techniqueVehicleUpdate.errors = null;
    });
    builder.addCase(techniqueVehicleInfoPut.fulfilled, (state, action: PayloadAction<IVehicle>) => {
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
  setChangeUserProfile,
  setNullReducerVehicleCreate,
  clearUserInfo,
  clearCompaniesPagination,
} = companiesSlice.actions;
export const companiesSelector = (state: RootState) => state.companies;
export const techniqueVehicleInfoSelector = (state: RootState) =>
  state.companies.techniqueVehicleInfo;
export const techniqueVehicleUpdateSelector = (state: RootState) =>
  state.companies.techniqueVehicleUpdate;
export default companiesSlice.reducer;
