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
            polyline: false,
            fullData: [],
            device: devices[7] || {},
            range: null
        };

    const [state, dispatch] = useReducer(
        reducer, initialState, initializer
    );

    return (
        <div className="mk-map-root">
            <DevicesList onClick={(device) => dispatch({type: "set_device", payload: device})}/>
            <MapBox lat={'35.69980665825626'} lng={'51.33805755767131'} device={state.device} fullData={state.fullData}
                    polyline={state.polyline} range={state.range}/>
            <RangePicker onSet={(data) => dispatch({type: "set_polyline", payload: data})}
                         isDisabled={!state.fullData.length} device={state.device}
                         onChangeRange={(range: number) => dispatch({type: "set_range", payload: range})}/>
        </div>
    )
}

function reducer(state: any, action: any) {
    switch (action.type) {
        case "set_polyline":
            return {
                ...state,
                polyline: true,
                fullData: action.payload
            };
        case "set_device":
            return {
                ...state,
                device: action.payload
            };
        case "set_range":
            return {
                ...state,
                range: action.payload
            }
    }
}