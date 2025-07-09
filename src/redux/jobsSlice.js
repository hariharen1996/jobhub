import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";

export const fetchJobs = createAsyncThunk("jobs/fetchJobs", async () => {
  const querySnapshot = await getDocs(collection(db, "jobs"));
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
});

const jobSlice = createSlice({
  name: "jobs",
  initialState: {
    jobs: [],
    status: "idle",
    error: null,
    currentPage: 1,
    jobsPerPage: 6,
  },
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.jobs = action.payload;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { setCurrentPage } = jobSlice.actions;
export default jobSlice.reducer;
