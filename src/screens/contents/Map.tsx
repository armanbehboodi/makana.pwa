import React, {useReducer} from "react";
import {shallowEqual, useSelector} from "react-redux";
import {useQuery} from 'react-query';
import {useTranslation} from 'react-i18next';
import {RootState} from "../../store/store";
import {staticData} from "../../constants/staticData";
import {DevicesList, MapBox, Loading} from "../../components/components";
import {getCookie, getSpeed} from "../../helper/helper";
import Default from "../../assets/images/default.png";
import Satellite from "../../assets/images/icons/satellite.svg";
import {SnackField} from "../../components/ui/SnackField";

export const Map: React.FC = () => {

    const {t} = useTranslation(),
        {devices} = useSelector((state: RootState) => ({
            devices: state.data.devices
        }), shallowEqual),
        token = getCookie("mk-login-token");

    const initializer = (initialState: any) => initialState,
        initialState = {
            device: devices[0] || {},
            loading: false,
            snack: false
        };

    const [state, dispatch] = useReducer(
        reducer, initialState, initializer
    );

    const fetchData = async (deviceId: string, token: string) => {
        const response = await fetch(staticData.devices_api + deviceId + '/ws/GPS', {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (response.ok) return response.json();
    };

    const {data} = useQuery(
        ['fetchData', state.device.id], // Query key should include the device ID for caching and refetching purposes
        () => fetchData(state.device.id, token),
        {
            refetchInterval: 4000, // Get location every 4 seconds
            refetchIntervalInBackground: true, // Continue getting location even when window is not in focus
            onSuccess: (data: any) => {
                if (!state.snack && data && !data.data.length) dispatch({type: "snack", payload: true});
            },
            onSettled: () => { // executes either success or fail
                if (state.loading) dispatch({type: "loading", payload: false});
            }
        }
    ), trackerData = data ? data.data : null;

    const lastData = trackerData && trackerData.length ? trackerData[trackerData.length - 1] : null;

    return (
        <div className="mk-map-root">
            <DevicesList onClick={(device) => {
                dispatch({type: "device", payload: device});
            }}/>
            <MapBox lat={lastData ? lastData.latitude : null}
                    lng={lastData ? lastData.longitude : null}
                    device={state.device}/>
            <div className="mk-map-selected-device">
                <img src={state.device['image_url'] || Default} alt="device" className="mk-map-selected-device-img"
                     onError={(e: any) => e.currentTarget.src = Default}/>
                <div className="mk-map-data-box">
                    <p>{t('map.speed')}</p>
                    <p>{trackerData && trackerData.length ? `${getSpeed(trackerData)} m/s` : "_"}</p>
                </div>
                <div className="mk-map-data-box">
                    <p>{t('map.distance')}</p>
                    <p>_</p>
                </div>
                <div className="mk-map-data-box">
                    <p>{t('map.height')}</p>
                    <p>{lastData ? lastData['sea_level'] + " m" : "_"}</p>
                </div>
                <div className="mk-map-satellites">
                    <img src={Satellite} alt="satellite"/>
                    <span>{lastData ? lastData['number_of_satellites'] : 0}</span>
                </div>
            </div>
            <SnackField isOpen={state.snack} type={"error"} message={t("map.noData")}
                        closeHandler={() => dispatch({type: "snack", payload: false})}/>
            {state.loading && <Loading/>}
        </div>
    )
}

function reducer(state: any, action: any) {
    switch (action.type) {
        case "device":
            return {
                ...state,
                device: action.payload,
                loading: true
            }
        case "loading":
            return {
                ...state,
                loading: action.payload
            }
        case "snack":
            return {
                ...state,
                snack: action.payload
            }
    }
}