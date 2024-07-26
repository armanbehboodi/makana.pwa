import React, {useReducer} from "react";
import {shallowEqual, useSelector} from "react-redux";
import {RootState} from "../../store/store";
import {RangePicker, DevicesList, MapBox} from "../../components/main/mainComponents";

export const History: React.FC = () => {

    const {devices} = useSelector((state: RootState) => ({
        devices: state.data.devices
    }), shallowEqual);

    const initializer = (initialState: any) => initialState,
        initialState = {
            lat: '35.69980665825626',
            lng: '51.33805755767131',
            device: devices[0] || {}
        };

    const [state, dispatch] = useReducer(
        reducer, initialState, initializer
    );

    return (
        <div className="mk-map-root">
            <DevicesList onClick={(device) => dispatch({type: "set_device", payload: device})}/>
            <MapBox lat={state.lat} lng={state.lng} device={state.device}/>
            <RangePicker/>
        </div>
    )
}

function reducer(state: any, action: any) {
    switch (action.type) {
        case "set_coordinate":
            return {
                ...state,
                lat: action.payload.lat,
                lng: action.payload.lng
            };
        case "set_device":
            return {
                ...state,
                device: action.payload
            };
    }
}