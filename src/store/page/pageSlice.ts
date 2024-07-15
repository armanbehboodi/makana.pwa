import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IPage {
    page: string;
    is_loading: boolean;
    extra_data?: any
}

interface ISetPageAction {
    page: string,
    extra_data?: any
}

const initialState: IPage = {
    page: "register",
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
        switchLoading: (state, action: PayloadAction<boolean>) => {
            state.is_loading = action.payload;
        }
    }
});

export default pageSlice;