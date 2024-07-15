import {configureStore} from "@reduxjs/toolkit";
import pageSlice from "./page/pageSlice";

export const store = configureStore({
    reducer: {
        page: pageSlice.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            thunk: true
        })
});

export const pageSliceActions = pageSlice.actions;
export type RootState = ReturnType<typeof store.getState>;