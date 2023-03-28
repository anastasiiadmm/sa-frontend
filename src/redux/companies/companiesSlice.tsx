import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { message } from 'antd';

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
import axiosApi from 'utils/axios-api';
import { defaultError } from 'utils/config';
import toQueryParams from 'utils/toQueryParams';

const nameSpace = 'companies';

interface CompaniesState {
  companies: companiesList[] | null;
  fetchCompaniesLoading: boolean;
  fetchCompaniesError: Object | null;
  companiesListPagination: usersListPagination | null;
  userCreate: PostNewUser | null;
  userCreateLoading: boolean;
  userCreateError: Object | null;
  userInfo: companiesList | null;
  userInfoLoading: boolean;
  userInfoError: Object | null;
  updateUserInfoLoading: boolean;
  updateUserInfoError: Object | null;
  updateUserData: ICompany | null | Object;
  updateUserDataLoading: boolean;
  updateUserDataError: Object | null;
  deleteUserInfoLoading: boolean;
  deleteUserInfoError: Object | null;
  vehicleList: vehicleList | null;
  fetchVehicleListLoading: boolean;
  fetchVehicleListError: Object | null;
  vehicleListPagination: vehicleListPagination | null;
  userVehicleInfo: userVehicleInfo | null;
  userVehicleInfoLoading: boolean;
  userVehicleInfoError: Object | null;
  vehicleCreateLoading: boolean;
  vehicleCreateSuccess: boolean;
  vehicleCreateError: Object | null;
  patchUserVehicleInfoLoading: boolean;
  patchUserVehicleInfoError: Object | null;
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
      let error = e?.response?.data;
      if (!e.response) {
        error = defaultError;
      }
      return rejectWithValue(error);
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
      let error = e?.response?.data;
      if (!e.response) {
        error = defaultError;
      }
      return rejectWithValue(error);
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
      let error = e?.response?.data;
      if (!e.response) {
        error = defaultError;
      }
      return rejectWithValue(error);
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

export const deleteUserInfo = createAsyncThunk<void, string>(
  `${nameSpace}/deleteUserInfo`,
  async (id, { rejectWithValue }) => {
    try {
      const resp = await axiosApi.delete(`/companies/${id}/`);
      message.success('Данные успешно удалены!');

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
      let error = e?.response?.data;
      if (!e.response) {
        error = defaultError;
      }
      return rejectWithValue(error);
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
      let error = e?.response?.data;
      if (!e.response) {
        error = defaultError;
      }
      return rejectWithValue(error);
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
      let error = e?.response?.data;
      if (!e.response) {
        error = defaultError;
      }
      return rejectWithValue(error);
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
      let error = e?.response?.data;
      if (!e.response) {
        error = defaultError;
      }
      return rejectWithValue(error);
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
    builder.addCase(fetchUsersList.rejected, (state, { payload }: any) => {
      state.fetchCompaniesLoading = false;
      state.fetchCompaniesError = payload?.detail;
    });

    builder.addCase(userCreate.pending, (state) => {
      state.userCreateLoading = true;
      state.userCreateError = null;
    });
    builder.addCase(userCreate.fulfilled, (state, { payload }: any) => {
      state.userCreateLoading = false;
      state.userCreateError = null;
      state.userCreate = payload;
    });
    builder.addCase(userCreate.rejected, (state, { payload }: any) => {
      state.userCreateLoading = false;
      state.userCreateError = payload?.detail;
    });

    builder.addCase(fetchUserInfo.pending, (state) => {
      state.userInfoLoading = true;
      state.userInfoError = null;
    });
    builder.addCase(fetchUserInfo.fulfilled, (state, { payload: companyInfo }: any) => {
      state.userInfoLoading = false;
      state.userInfo = companyInfo;
    });
    builder.addCase(fetchUserInfo.rejected, (state, { payload }: any) => {
      state.userInfoLoading = false;
      state.userInfoError = payload?.detail;
    });

    builder.addCase(updateUserInfo.pending, (state) => {
      state.updateUserInfoLoading = true;
      state.updateUserInfoError = null;
    });
    builder.addCase(updateUserInfo.fulfilled, (state) => {
      state.updateUserInfoLoading = false;
      state.updateUserInfoError = null;
    });
    builder.addCase(updateUserInfo.rejected, (state, { payload }: any) => {
      state.updateUserInfoLoading = false;
      state.updateUserInfoError = payload?.detail;
    });

    builder.addCase(deleteUserInfo.pending, (state) => {
      state.deleteUserInfoLoading = true;
      state.deleteUserInfoError = null;
    });
    builder.addCase(deleteUserInfo.fulfilled, (state) => {
      state.deleteUserInfoLoading = false;
    });
    builder.addCase(deleteUserInfo.rejected, (state, { payload }: any) => {
      state.deleteUserInfoLoading = false;
      state.deleteUserInfoError = payload?.detail;
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
    builder.addCase(fetchUserVehicleList.rejected, (state, { payload }: any) => {
      state.fetchVehicleListLoading = false;
      state.fetchVehicleListError = payload?.detail;
    });

    builder.addCase(fetchUserVehicleInfo.pending, (state) => {
      state.userVehicleInfoLoading = true;
      state.userVehicleInfoError = null;
    });
    builder.addCase(fetchUserVehicleInfo.fulfilled, (state, { payload: userVehicleInfo }: any) => {
      state.userVehicleInfoLoading = false;
      state.userVehicleInfo = userVehicleInfo;
    });
    builder.addCase(fetchUserVehicleInfo.rejected, (state, { payload }: any) => {
      state.userVehicleInfoLoading = false;
      state.userVehicleInfoError = payload?.detail;
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
    builder.addCase(vehicleCreate.rejected, (state, { payload }: any) => {
      state.vehicleCreateLoading = false;
      state.vehicleCreateSuccess = false;
      state.vehicleCreateError = payload?.detail;
    });

    builder.addCase(patchUserVehicleInfo.pending, (state) => {
      state.patchUserVehicleInfoLoading = true;
      state.patchUserVehicleInfoError = null;
    });
    builder.addCase(patchUserVehicleInfo.fulfilled, (state) => {
      state.patchUserVehicleInfoLoading = false;
      state.patchUserVehicleInfoError = null;
    });
    builder.addCase(patchUserVehicleInfo.rejected, (state, { payload }: any) => {
      state.patchUserVehicleInfoLoading = false;
      state.patchUserVehicleInfoError = payload?.detail;
    });
  },
});

export const { setChangeUserProfile, setNullReducerVehicleCreate } = companiesSlice.actions;
export const companiesSelector = (state: RootState) => state.companies;
export default companiesSlice.reducer;
