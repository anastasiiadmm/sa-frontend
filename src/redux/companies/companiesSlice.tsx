import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { RootState } from 'redux/hooks';
import { companiesList, usersListPagination } from 'types';
import axiosApi from 'utils/axios-api';
import { defaultError } from 'utils/config';
import toQueryParams from 'utils/toQueryParams';

const nameSpace = 'companies';

interface CompaniesState {
  companies: companiesList[] | null;
  fetchCompaniesLoading: boolean;
  fetchCompaniesError: Object | null;
  companiesListPagination: usersListPagination | null;
}

const INITIAL_STATE = {
  companies: null,
  fetchCompaniesLoading: false,
  fetchCompaniesError: null,
  companiesListPagination: null,
} as CompaniesState;

interface fetchCompaniesParams {
  data: {
    query: {
      page: number;
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

const companiesSlice = createSlice({
  name: nameSpace,
  initialState: INITIAL_STATE,
  reducers: {},
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
      };
    });
    builder.addCase(fetchUsersList.rejected, (state, { payload }: any) => {
      state.fetchCompaniesLoading = false;
      state.fetchCompaniesError = payload?.detail;
    });
  },
});

export const companiesSelector = (state: RootState) => state.companies;
export default companiesSlice.reducer;
