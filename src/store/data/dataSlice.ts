import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface IData {
    devices: any[]
}

const initialState: IData = {
    devices: []
};

const dataSlice = createSlice({
    name: "data",
    initialState,
    reducers: {
        setDevices: (state, action: PayloadAction<any>) => {
            state.devices = action.payload.devices;
        }
    }
});

export default dataSlice;