import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

export const fetchJobs = createAsyncThunk("jobs/fetchJobs", async () => {
  const querySnapshot = await getDocs(collection(db, "jobs"));
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
});

export const addJob = createAsyncThunk("jobs/addJob", async (jobData) => {
  const docRef = await addDoc(collection(db, "jobs"), jobData);
  return { id: docRef.id, ...jobData };
});

export const updateJob = createAsyncThunk(
  "jobs/updateJob",
  async ({ id, ...jobData }) => {
    await updateDoc(doc(db, "jobs", id), jobData);
    return { id, ...jobData };
  }
);

export const deleteJob = createAsyncThunk("jobs/deleteJob", async (id) => {
  await deleteDoc(doc(db, "jobs", id));
  return id;
});

const initialState = {
  jobs: [],
  status: "idle",
  error: null,
  currentPage: 1,
  jobsPerPage: 6,
  editJob: null,
  filters: {
    searchQuery: "",
    experience: "",
    salaryRange: [0, 100],
    location: [],
    skills: [],
    workMode: "all",
  },
};

const jobSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setEditJob: (state, action) => {
      state.editJob = action.payload;
    },
    clearEditJob: (state) => {
      state.editJob = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.currentPage = 1;
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
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
      })
      .addCase(addJob.fulfilled, (state, action) => {
        state.jobs.push(action.payload);
      })
      .addCase(updateJob.fulfilled, (state, action) => {
        const index = state.jobs.findIndex(
          (job) => job.id === action.payload.id
        );
        if (index !== -1) {
          state.jobs[index] = action.payload;
        }
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.jobs = state.jobs.filter((job) => job.id !== action.payload);
      });
  },
});

function parseExperience(expStr) {
  if (!expStr) return 0;
  if (expStr.includes("+")) return parseInt(expStr);
  const match = expStr.match(/(\d+)-(\d+)/);
  if (match) {
    const min = parseInt(match[1]);
    const max = parseInt(match[2]);
    return (min + max) / 2;
  }
  return 0;
}

function parseSalary(salaryStr) {
  if (!salaryStr) return [0, 0];
  const match = salaryStr.match(/₹([\d,]+)\s*-\s*₹([\d,]+)/);
  if (match) {
    const minSalary = Number(match[1].replace(/,/g, "")) / 100000;
    const maxSalary = Number(match[2].replace(/,/g, "")) / 100000;
    return [minSalary, maxSalary];
  }
  return [0, 0];
}

export const selectFilteredJobs = (state) => {
  const { jobs, filters } = state.jobs;
  const modifiedSearch = (str) => str?.toLowerCase().replace(/\s+/g, "") || "";

  return jobs.filter((job) => {
    if (filters.searchQuery) {
      const modifiedSearchdQuery = modifiedSearch(filters.searchQuery);
      const modifiedSearchdTitle = modifiedSearch(job.jobTitle);
      const modifiedSearchdCompany = modifiedSearch(job.companyName);

      const titleMatch = modifiedSearchdTitle.includes(modifiedSearchdQuery);
      const companyMatch = modifiedSearchdCompany.includes(modifiedSearchdQuery);

      if (!titleMatch && !companyMatch) return false;
    }

    if (filters.experience) {
      const jobExp = parseExperience(job.experience);
      if (filters.experience === "5+" && jobExp < 5) return false;
      if (filters.experience !== "5+" && jobExp > parseInt(filters.experience))
        return false;
    }

    if (filters.salaryRange) {
      const [minFilter, maxFilter] = filters.salaryRange;
      const [minSalary, maxSalary] = parseSalary(job.salary);

      if (minSalary > maxFilter || maxSalary < minFilter) return false;
    }

    if (filters.location?.length > 0) {
      const jobCity = job.location?.split(",")[0]?.trim();
      if (!filters.location.includes(jobCity)) return false;
    }

    if (filters.skills?.length > 0) {
      const hasAllSkills = filters.skills.some((skill) =>
        job.jobSkills?.includes(skill)
      );
      if (!hasAllSkills) return false;
    }

    if (filters.workMode && filters.workMode !== "all") {
      if (job.workMode !== filters.workMode) return false;
    }

    return true;
  });
};

export const {
  setCurrentPage,
  setEditJob,
  clearEditJob,
  setFilters,
  resetFilters,
} = jobSlice.actions;
export default jobSlice.reducer;
