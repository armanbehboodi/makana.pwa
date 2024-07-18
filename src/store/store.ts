import {configureStore} from "@reduxjs/toolkit";
import pageSlice from "./page/pageSlice";
import dataSlice from "./data/dataSlice";

export const store = configureStore({
    reducer: {
        page: pageSlice.reducer,
        data: dataSlice.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            thunk: true
        })
});

export const pageSliceActions = pageSlice.actions;
export const dataSliceActions = dataSlice.actions;
export type RootState = ReturnType<typeof store.getState>;