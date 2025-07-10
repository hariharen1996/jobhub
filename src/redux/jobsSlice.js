import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

export const fetchJobs = createAsyncThunk("jobs/fetchJobs", async () => {
  const querySnapshot = await getDocs(collection(db, "jobs"));
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
});

export const addJob = createAsyncThunk("jobs/addJob", async (jobData) => {
  const docRef = await addDoc(collection(db, "jobs"),jobData);
  return { id: docRef.id, ...jobData }
});

export const updateJob = createAsyncThunk("jobs/updateJob", async ({id, ...jobData}) => {
  await updateDoc(doc(db, "jobs",id),jobData);
  return { id, ...jobData }
});

export const deleteJob = createAsyncThunk("jobs/deleteJob", async (id) => {
  await deleteDoc(doc(db, "jobs",id));
  return id
});


const jobSlice = createSlice({
  name: "jobs",
  initialState: {
    jobs: [],
    status: "idle",
    error: null,
    currentPage: 1,
    jobsPerPage: 6,
    editJob: null
  },
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setEditJob: (state,action) => {
      state.editJob = action.payload
    },
    clearEditJob: (state) => {
      state.editJob = null
    }
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
      }).addCase(addJob.fulfilled,(state,action) => {
        state.jobs.push(action.payload)
      }).addCase(updateJob.fulfilled,(state,action) => {
        const index = state.jobs.findIndex(job => job.id === action.payload.id)
        if(index !== -1){
          state.jobs[index] = action.payload
        }
      }).addCase(deleteJob.fulfilled,(state,action) => {
        state.jobs = state.jobs.filter(job => job.id !== action.payload)
      })
  },
});

export const { setCurrentPage,setEditJob,clearEditJob } = jobSlice.actions;
export default jobSlice.reducer;
