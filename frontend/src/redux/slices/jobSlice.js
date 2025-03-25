// redux/slices/jobSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api'; // Import the configured axios instance

export const createJob = createAsyncThunk(
  'jobs/createJob',
  async (jobData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const res = await api.post('/jobs/create', jobData); // Use api instance
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create job');
    }
  }
);

export const searchJobs = createAsyncThunk(
  'jobs/searchJobs',
  async (filters, { rejectWithValue }) => {
    try {
      const res = await api.get('/jobs/search', { params: filters }); // Use api instance
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch jobs');
    }
  }
);

export const applyJob = createAsyncThunk(
  'jobs/applyJob',
  async (jobId, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const res = await api.post(`/jobs/${jobId}/apply`, {}); // Use api instance
      return { jobId, application: res.data.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to apply to job');
    }
  }
);

const jobSlice = createSlice({
  name: 'jobs',
  initialState: {
    jobs: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Job
      .addCase(createJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs.push(action.payload);
      })
      .addCase(createJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Search Jobs
      .addCase(searchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload;
      })
      .addCase(searchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Apply Job
      .addCase(applyJob.pending, (state) => {
        state.loading = true;
        state.error = null; // Fixed typo from 'Ficerror'
      })
      .addCase(applyJob.fulfilled, (state, action) => {
        state.loading = false;
        const job = state.jobs.find(j => j._id === action.payload.jobId);
        if (job) job.applications = [...(job.applications || []), action.payload.application];
      })
      .addCase(applyJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError: clearJobError } = jobSlice.actions;
export default jobSlice.reducer;