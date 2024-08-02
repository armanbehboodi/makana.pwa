import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface IData {
    devices: any[],
    mobile: string | number | null
}

const initialState: IData = {
    devices: [],
    mobile: null
};

const dataSlice = createSlice({
    name: "data",
    initialState,
    reducers: {
        setDevices: (state, action: PayloadAction<any>) => {
            state.devices = action.payload.devices;
        },
        setMobile: (state, action: PayloadAction<string | number | null>) => {
            state.mobile = action.payload;
        },
        resetData: (state) => {
            state.devices = [];
            state.mobile = null;
        }
    }
});

export default dataSlice;