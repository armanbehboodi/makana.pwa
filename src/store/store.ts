import {configureStore} from "@reduxjs/toolkit";
import dataSlice from "./data/dataSlice";

export const store = configureStore({
    reducer: {
        data: dataSlice.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            thunk: true
        })
});

export const dataSliceActions = dataSlice.actions;
export type RootState = ReturnType<typeof store.getState>;