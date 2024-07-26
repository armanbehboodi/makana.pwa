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
            history: [],
            device: devices[0] || {}
        };

    const [state, dispatch] = useReducer(
        reducer, initialState, initializer
    );

    const historyHandler = (data: any) => {
        let history:any = [];

        if (data.length > 0) {
            data.map((item:any) => {
                history.push([Number(item.latitude),Number(item.longitude)])
            })
        }

        dispatch({type: "set_polyline", payload: history});
    }

    return (
        <div className="mk-map-root">
            <DevicesList onClick={(device) => dispatch({type: "set_device", payload: device})}/>
            <MapBox lat={'35.69980665825626'} lng={'51.33805755767131'} device={state.device} history={state.history}
                    polyline={state.polyline}/>
            <RangePicker onSet={(data) => historyHandler(data)} device={state.device}/>
        </div>
    )
}

function reducer(state: any, action: any) {
    switch (action.type) {
        case "set_polyline":
            return {
                ...state,
                polyline: true,
                history: action.payload
            };
        case "set_device":
            return {
                ...state,
                device: action.payload
            };
    }
}