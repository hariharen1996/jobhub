import { configureStore } from "@reduxjs/toolkit";
import jobsReducer from '../redux/jobsSlice'
import userReducer from '../redux/userSlice'

export const store = configureStore({
    reducer: {
        jobs: jobsReducer,
        user: userReducer
    }
})