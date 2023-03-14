import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { message } from 'antd';

import { RootState } from 'redux/hooks';
import { companiesList, ICompany, usersListPagination } from 'types';
import axiosApi from 'utils/axios-api';
import { defaultError } from 'utils/config';
import toQueryParams from 'utils/toQueryParams';

const nameSpace = 'companies';

interface CompaniesState {
  companies: companiesList[] | null;
  fetchCompaniesLoading: boolean;
  fetchCompaniesError: Object | null;
  companiesListPagination: usersListPagination | null;
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
}

const INITIAL_STATE = {
  companies: null,
  fetchCompaniesLoading: false,
  fetchCompaniesError: null,
  companiesListPagination: null,

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
      message.success('Новый пользователь успешно создан!');
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
    id: string | undefined;
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
  data: ICompany;
}

export const updateUserInfo = createAsyncThunk<void, updateUserInfoParams>(
  `${nameSpace}/updateUserInfo`,
  async (data, { rejectWithValue, dispatch }) => {
    try {
      const resp = await axiosApi.patch(`/companies/${data?.id}/`, data?.data);
      message.success('Данные успешно изменены!');

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
    builder.addCase(userCreate.fulfilled, (state) => {
      state.userCreateLoading = false;
      state.userCreateError = null;
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
  },
});

export const { setChangeUserProfile } = companiesSlice.actions;
export const companiesSelector = (state: RootState) => state.companies;
export default companiesSlice.reducer;
