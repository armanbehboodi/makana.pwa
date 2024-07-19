import React, {useEffect, useReducer} from "react";
import {shallowEqual, useSelector} from "react-redux";
import {useTranslation} from 'react-i18next';
import {RootState} from "../../store/store";
import {MapBox} from "../../components/main/MapBox";
import {ButtonField} from "../../components/ui/ButtonField";
import {getCookie} from "../../helper/CookieHandler";
import Default from "../../assets/images/default.png";
import {staticData} from "../../constants/staticData";

export const Map: React.FC = () => {
    const {t} = useTranslation(),
        {devices} = useSelector((state: RootState) => ({
            devices: state.data.devices
        }), shallowEqual),
        token = getCookie("mk-login-token");

    const initializer = (initialState: any) => initialState,
        initialState = {
            lat: '35.69980665825626',
            lng: '51.33805755767131',
            device: devices[0] || {},
            data: {}
        };

    const [state, dispatch] = useReducer(
        reducer, initialState, initializer
    );

    const getData = async (device: any) => {
        const response = await fetch(staticData.devices + device.id + '/ws/gps', {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            }),
            data = await response.json();

        console.log(data);
    }

    useEffect(() => {
        getData(devices[0]);
    }, []);

    return (
        <div className="mk-map-root">
            <div className="mk-map-devices-list">
                {devices.map((device, index: number) => {
                    return (
                        <div className="mk-map-device" key={index}
                             onClick={() => {
                                 dispatch({type: "set_device", payload: device})
                                 // getData(device);
                             }}>
                            <img src={device['image_url'] || Default} className={!device['image_url'] ? 'default' : ''}
                                 alt="device" onError={(e: any) => e.currentTarget.src = Default}/>
                            <p>{device.name}</p>
                        </div>
                    )
                })}
            </div>
            <MapBox lat={state.lat} lng={state.lng} device={state.device}/>
            <div className="mk-map-selected-device">
                <img src={state.device['image_url'] || Default} alt="device"
                     onError={(e: any) => e.currentTarget.src = Default}/>
                <div className="mk-map-data-box">
                    <p>{t('map.speed')}</p>
                    <p>{state.data['speed'] || "_"}</p>
                </div>
                <div className="mk-map-data-box">
                    <p>{t('map.movement')}</p>
                    <p>{state.data['movement'] || "_"}</p>
                </div>
                <div className="mk-map-data-box">
                    <p>{t('map.height')}</p>
                    <p>{state.data['height'] || "_"}</p>
                </div>
                <ButtonField label={t('map.start')} color="main" pressHandler={() => console.log(123)}/>
            </div>
        </div>
    );
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
        case "set_data":
            return {
                ...state,
                data: action.payload
            }
        case "set_complete_data":
            return {
                ...state,
                device: action.payload.device,
                data: action.payload.data
            }
    }
}