import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface IData {
    devices: any[],
    mobile: string | number | null,
    firstTrackedData: any
}

const initialState: IData = {
    devices: [],
    mobile: null,
    firstTrackedData: null
};

const dataSlice = createSlice({
    name: "data",
    initialState,
    reducers: {
        setDevices: (state, action: PayloadAction<any>) => {
            state.devices = action.payload.devices;
        },
        setMobile: (state, action: PayloadAction<string|number|null>) => {
            state.mobile = action.payload;
        },
        setTrackedData: (state, action: PayloadAction<any>) => {
            state.firstTrackedData = action.payload;
        }
    }
});

export default dataSlice;