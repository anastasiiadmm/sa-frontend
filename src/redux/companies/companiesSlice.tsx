import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { message } from 'antd';

import { IConfirmation, IErrors, ITechniqueVehicleInfoPut, IVehicle } from 'interfaces';
import { RootState } from 'redux/hooks';
import {
  companiesList,
  ICompany,
  PostNewUser,
  UpdatedCompaniesList,
  usersListPagination,
  userVehicleInfo,
  vehicleCreateData,
  vehicleList,
  vehicleListPagination,
} from 'types/types';
import { axiosApi, axiosApiV2 } from 'utils/axios-api';
import toQueryParams from 'utils/toQueryParams';

const nameSpace = 'companies';

interface CompaniesState {
  companies: companiesList[] | null;
  fetchCompaniesLoading: boolean;
  fetchCompaniesError: IErrors | null;
  companiesListPagination: usersListPagination | null;
  userCreate: PostNewUser | null;
  userCreateLoading: boolean;
  userCreateError: IErrors | null;
  userInfo: companiesList | null;
  userInfoLoading: boolean;
  userInfoError: IErrors | null;
  updateUserInfoLoading: boolean;
  updateUserInfoError: IErrors | null;
  updateUserData: ICompany | null | Object;
  updateUserDataLoading: boolean;
  updateUserDataError: Object | null;
  deleteUserInfoLoading: boolean;
  deleteUserInfoError: IErrors | null;
  vehicleList: vehicleList | null;
  fetchVehicleListLoading: boolean;
  fetchVehicleListError: IErrors | null;
  vehicleListPagination: vehicleListPagination | null;
  userVehicleInfo: userVehicleInfo | null;
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
  saveTechniqueVehicle: {
    results: IConfirmation | null;
    loading: boolean;
    errors: IErrors | null;
  };
  postInquiriesLoading: boolean;
  postInquiriesError: IErrors | null;
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
    autopilots_amount: '',
    location: '',
    name: '',
    user: {
      username: '',
      first_name: '',
      last_name: '',
      middle_name: '',
      email: '',
      phone: '',
      password: '',
    },
  },
  updateUserDataLoading: false,
  updateUserDataError: null,

  deleteUserInfoLoading: false,
  deleteUserInfoError: null,

  vehicleList: null,
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

  postInquiriesLoading: false,
  postInquiriesError: null,
} as CompaniesState;

interface fetchCompaniesParams {
  data?: {
    query?: {
      page?: number | undefined;
    };
  };
}

export const fetchUsersList = createAsyncThunk<companiesList, fetchCompaniesParams>(
  'accounts/fetchUsersList',
  async ({ data }, { rejectWithValue }) => {
    try {
      let query = '';
      if (data?.query) {
        query = toQueryParams(data.query);
      }
      const resp = await axiosApi.get<companiesList | null>(`/companies/${query}`);
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
      const resp = await axiosApi.post(`/companies/`, data);

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
  data: {
    id: string | null | undefined;
  };
}

export const fetchUserInfo = createAsyncThunk<companiesList, fetchCompanyParams>(
  'accounts/fetchUserInfo',
  async ({ data }, { rejectWithValue }) => {
    try {
      const resp = await axiosApi.get<companiesList | null>(`/companies/${data?.id}/`);
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

interface updateUserInfoParams {
  id: string | undefined;
  data: ICompany | UpdatedCompaniesList;
}

export const updateUserInfo = createAsyncThunk<void, updateUserInfoParams>(
  `${nameSpace}/updateUserInfo`,
  async (data, { rejectWithValue, dispatch }) => {
    try {
      const resp = await axiosApi.patch(`/companies/${data?.id}/`, data?.data);
      await dispatch(fetchUserInfo({ data }));
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
      const resp = await axiosApi.delete(`/companies/${id}/`);
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
    userId?: string | null | undefined;
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
        `/companies/${data?.userId}/vehicles/${query}`,
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

interface fetchUserVehicleInfoParams {
  userId: string | null | undefined;
  vehicleId: string | null | undefined;
}

export const fetchUserVehicleInfo = createAsyncThunk<userVehicleInfo, fetchUserVehicleInfoParams>(
  `${nameSpace}/fetchUserVehicleInfo`,
  async (data, { rejectWithValue }) => {
    try {
      const resp = await axiosApi.get<userVehicleInfo | null>(
        `/companies/${data?.userId}/vehicle/${data?.vehicleId}/`,
      );

      const userVehicleInfo = resp.data;

      if (userVehicleInfo === null) {
        throw new Error('Not Found!');
      }

      return userVehicleInfo;
    } catch (e) {
      return rejectWithValue({
        detail: e?.response?.data?.detail,
        status: e?.response?.status,
      });
    }
  },
);

interface patchUserVehicleInfoParams {
  userId: string | null | undefined;
  vehicleId: string | null | undefined;
  data: userVehicleInfo;
}

export const patchUserVehicleInfo = createAsyncThunk<userVehicleInfo, patchUserVehicleInfoParams>(
  `${nameSpace}/patchUserVehicleInfo`,
  async (data, { rejectWithValue, dispatch }) => {
    try {
      const resp = await axiosApi.patch<userVehicleInfo | null>(
        `/companies/${data?.userId}/vehicle/${data?.vehicleId}/`,
        data?.data,
      );

      await dispatch(fetchUserVehicleList({ data: { userId: data?.userId, query: { page: 1 } } }));
      message.success('Данные успешно изменены!');

      const userVehicleInfo = resp.data;

      if (userVehicleInfo === null) {
        throw new Error('Not Found!');
      }

      return userVehicleInfo;
    } catch (e) {
      return rejectWithValue({
        detail: e?.response?.data,
        status: e?.response?.status,
      });
    }
  },
);

interface deleteUserVehicleParams {
  userId: string | null | undefined;
  vehicleId: string | null | undefined;
}

export const deleteUserVehicle = createAsyncThunk<void, deleteUserVehicleParams>(
  `${nameSpace}/deleteUserVehicle`,
  async (data, { rejectWithValue, dispatch }) => {
    try {
      const resp = await axiosApi.delete(`/companies/${data?.userId}/vehicle/${data?.vehicleId}/`);

      await dispatch(fetchUserVehicleList({ data: { userId: data?.userId, query: { page: 1 } } }));
      message.success('Данные успешно удалены!');

      return resp.data;
    } catch (e) {
      return rejectWithValue({
        detail: e?.response?.data?.detail,
        status: e?.response?.status,
      });
    }
  },
);

interface vehicleCreateParams {
  userId: string | null | undefined;
  data: vehicleCreateData;
}

export const vehicleCreate = createAsyncThunk<void, vehicleCreateParams>(
  `${nameSpace}/vehicleCreate`,
  async (data, { rejectWithValue }) => {
    try {
      const resp = await axiosApi.post(`/companies/${data?.userId}/vehicles/`, data?.data);

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
  async (data: IConfirmation, { rejectWithValue }) => {
    try {
      const response = await axiosApi.get(`companies/${data.id}/vehicle/${data.inquiry_id}/`);
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
  async ({ data, obj }: ITechniqueVehicleInfoPut, { rejectWithValue }) => {
    try {
      const response = await axiosApi.put(
        `companies/${data?.id}/vehicle/${data?.inquiry_id}/`,
        obj,
      );
      return response.data;
    } catch (e) {
      return rejectWithValue({
        detail: e?.response?.data,
        status: e?.response?.status,
      });
    }
  },
);

export const techniqueVehicleConfirmation = createAsyncThunk(
  `${nameSpace}/techniqueVehicleConfirmation`,
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await axiosApi.patch(`accounts/manager/confirmation/${id}/`);
      return response.data;
    } catch (e) {
      if (e?.response?.data?.detail) {
        await message.error(e?.response?.data?.detail);
      }
      return rejectWithValue({
        detail: e?.response?.data?.detail,
        status: e?.response?.status,
      });
    }
  },
);

interface InquiriesParams {
  object_id: number | undefined;
}

export const postInquiries = createAsyncThunk<void, InquiriesParams>(
  `${nameSpace}/postInquiries`,
  async ({ object_id }, { rejectWithValue }) => {
    try {
      const response = await axiosApiV2.post(`common/inquiries/`, {category: 4, object_id});
      return response.data;
    } catch (e) {
      if (e?.response?.data?.detail) {
        await message.error(e?.response?.data?.detail);
      }
      return rejectWithValue({
        detail: e?.response?.data?.detail,
        status: e?.response?.status,
      });
    }
  },
);

const companiesSlice = createSlice({
  name: nameSpace,
  initialState: INITIAL_STATE,
  reducers: {
    setChangeUserProfile: (state: any, action: PayloadAction<companiesList>) => {
      state.updateUserData.autopilots_amount = action.payload.autopilots_amount;
      state.updateUserData.location = action.payload.location;
      state.updateUserData.name = action.payload.name;
      state.updateUserData.user = {
        email: action.payload.user.email,
        first_name: action.payload.user.first_name,
        last_name: action.payload.user.last_name,
        middle_name: action.payload.user.middle_name,
        password: action.payload.user.password,
        phone: action.payload.user.phone,
        username: action.payload.user.username,
      };
    },
    setNullReducerVehicleCreate: (state) => {
      state.vehicleCreateSuccess = false;
    },
    clearUserInfo: (state) => {
      state.userInfo = null;
    },
    clearTechniqueVehicle: (state) => {
      state.saveTechniqueVehicle.results = null;
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
        next: payload.links.next,
        previous: payload.links.previous,
        vehicles_amount: payload.vehicles_amount,
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
        next: payload.links.next,
        previous: payload.links.previous,
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
    builder.addCase(fetchUserVehicleInfo.fulfilled, (state, { payload: userVehicleInfo }) => {
      state.userVehicleInfoLoading = false;
      state.userVehicleInfo = userVehicleInfo;
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
    builder.addCase(patchUserVehicleInfo.fulfilled, (state) => {
      state.patchUserVehicleInfoLoading = false;
      state.patchUserVehicleInfoError = null;
    });
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
    builder.addCase(deleteUserVehicle.fulfilled, (state) => {
      state.deleteUserVehicleLoading = false;
      state.deleteUserVehicleError = null;
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

    builder.addCase(techniqueVehicleConfirmation.pending, (state) => {
      state.saveTechniqueVehicle.loading = true;
      state.saveTechniqueVehicle.errors = null;
    });
    builder.addCase(techniqueVehicleConfirmation.fulfilled, (state, action) => {
      state.saveTechniqueVehicle.results = action.payload;
      state.saveTechniqueVehicle.loading = false;
      state.saveTechniqueVehicle.errors = null;
    });
    builder.addCase(techniqueVehicleConfirmation.rejected, (state, { payload }) => {
      state.saveTechniqueVehicle.loading = false;
      if (payload && typeof payload === 'object' && 'detail' in payload && 'status' in payload) {
        state.saveTechniqueVehicle.errors = {
          ...state.saveTechniqueVehicle.errors,
          detail: payload.detail as string | null,
          status: payload.status as number | null,
        };
      }
    });

    builder.addCase(postInquiries.pending, (state) => {
      state.postInquiriesLoading = true;
      state.postInquiriesError = null;
    });
    builder.addCase(postInquiries.fulfilled, (state) => {
      state.postInquiriesLoading = false;
      state.postInquiriesError = null;
    });
    builder.addCase(postInquiries.rejected, (state, { payload }) => {
      state.postInquiriesLoading = false;
      if (payload && typeof payload === 'object' && 'detail' in payload && 'status' in payload) {
        state.postInquiriesError = {
          ...state.postInquiriesError,
          detail: payload.detail as string | null,
          status: payload.status as number | null,
        };
      }
    });
  },
});

export const {
  setChangeUserProfile,
  setNullReducerVehicleCreate,
  clearUserInfo,
  clearTechniqueVehicle,
  clearCompaniesPagination,
} = companiesSlice.actions;
export const companiesSelector = (state: RootState) => state.companies;
export const techniqueVehicleInfoSelector = (state: RootState) =>
  state.companies.techniqueVehicleInfo;
export const techniqueVehicleUpdateSelector = (state: RootState) =>
  state.companies.techniqueVehicleUpdate;
export const techniqueVehicleConfirmationSelector = (state: RootState) =>
  state.companies.saveTechniqueVehicle;
export default companiesSlice.reducer;
