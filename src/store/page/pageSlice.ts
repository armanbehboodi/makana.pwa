import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import dataSlice from "../data/dataSlice";

interface IPage {
    page: string;
    content: string,
    is_loading: boolean;
    extra_data?: any
}

interface ISetPageAction {
    page: string,
    extra_data?: any
}

const initialState: IPage = {
    page: "register",
    content: "map",
    is_loading: false,
    extra_data: null
};

const pageSlice = createSlice({
    name: "page",
    initialState,
    reducers: {
        setPage: (state, action: PayloadAction<ISetPageAction>) => {
            state.page = action.payload.page;
            state.extra_data = action.payload.extra_data
        },
        setContent: (state, action: PayloadAction<string>) => {
            state.content = action.payload;
        },
        switchLoading: (state, action: PayloadAction<boolean>) => {
            state.is_loading = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(dataSlice.actions.setDevices, (state: IPage, action: PayloadAction<any>) => {
                state.page = action.payload.page;
            });
    }
});

export default pageSlice;