import { configureStore } from "@reduxjs/toolkit";
import jobsReducer from '../redux/jobsSlice'

export const store = configureStore({
    reducer: {
        jobs: jobsReducer
    }
})