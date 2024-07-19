import React, {useReducer} from "react";
import Default from "../../assets/images/default.png";
import {MapBox} from "../../components/main/MapBox";
import {shallowEqual, useSelector} from "react-redux";
import {RootState} from "../../store/store";
import {RangePicker} from "../../components/main/RangePicker";

export const History:React.FC = () => {

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
            <div className="mk-map-devices-list">
                {devices.map((device, index: number) => {
                    return (
                        <div className="mk-map-device" key={index}
                             onClick={() => dispatch({type: "set_device", payload: device})}>
                            <img src={device['image_url'] || Default} className={!device['image_url'] ? 'default' : ''}
                                 alt="device" onError={(e: any) => e.currentTarget.src = Default}/>
                            <p>{device.name}</p>
                        </div>
                    )
                })}
            </div>
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