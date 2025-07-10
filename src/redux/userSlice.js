import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

export const fetchUserRole = createAsyncThunk(
  "user/fetchUserRole",
  async (uid) => {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists) {
      return docSnap.data().role;
    }
    throw new Error("user not found");
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    role: null,
    status: "idle",
    error: null,
  },
  reducers: {
    setUserRole: (state, action) => {
      state.role = action.payload;
    },
    clearUser(state) {
      state.role = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserRole.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserRole.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.role = action.payload;
      })
      .addCase(fetchUserRole.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { setUserRole, clearUser } = userSlice.actions;
export default userSlice.reducer;
