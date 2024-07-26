import React, {useState} from "react";
import {shallowEqual, useSelector, useDispatch} from "react-redux";
import {useQuery} from 'react-query';
import {useTranslation} from 'react-i18next';
import {dataSliceActions, RootState} from "../../store/store";
import {DevicesList, MapBox} from "../../components/main/mainComponents";
import {getCookie} from "../../helper/CookieHandler";
import {getDistance, getSpeed} from "../../helper/Calculator";
import {staticData} from "../../constants/staticData";
import Default from "../../assets/images/default.png";
import Satellite from "../../assets/images/icons/satellite.svg";

export const Map: React.FC = () => {

    const {t} = useTranslation(),
        {devices, firstTrackedData} = useSelector((state: RootState) => ({
            devices: state.data.devices,
            firstTrackedData: state.data.firstTrackedData
        }), shallowEqual),
        dispatch = useDispatch(),
        [device, setDevice] = useState(devices[7] || {}),
        token = getCookie("mk-login-token");

    const fetchData = async () => {
        const response = await fetch(staticData.devices + device.id + '/ws/GPS', {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (response.ok) return response.json();
    };

    const {data} = useQuery(
        'fetchData',
        fetchData,
        {
            refetchInterval: 4000, // Poll every 4 seconds
            refetchIntervalInBackground: true, // Continue polling even when window is not in focus
        }
    ), trackerData = data ? data.data : null;

    // save first tracked data for calculating the distance
    if (!firstTrackedData && trackerData && trackerData.length) {
        dispatch(dataSliceActions.setTrackedData(trackerData[0]));
    }

    const lastData = trackerData && trackerData.length ? trackerData[trackerData.length - 1] : null;

    return (
        <div className="mk-map-root">
            <DevicesList onClick={(device) => setDevice(device)}/>
            <MapBox lat={lastData ? lastData.latitude : '35.69980665825626'}
                    lng={lastData ? lastData.longitude : '51.33805755767131'}
                    device={device}/>
            <div className="mk-map-selected-device">
                <img src={device['image_url'] || Default} alt="device" className="mk-map-selected-device-img"
                     onError={(e: any) => e.currentTarget.src = Default}/>
                <div className="mk-map-data-box">
                    <p>{t('map.speed')}</p>
                    <p>{trackerData && trackerData.length ? `${getSpeed(trackerData)} m/s` : "_"}</p>
                </div>
                <div className="mk-map-data-box">
                    <p>{t('map.movement')}</p>
                    <p>{firstTrackedData && lastData ? `${getDistance({
                        lat1: Number(firstTrackedData.latitude),
                        lon1: Number(firstTrackedData.longitude),
                        lat2: Number(lastData.latitude),
                        lon2: Number(lastData.longitude),
                    }).toFixed(1)} m` : "_"}</p>
                </div>
                <div className="mk-map-data-box">
                    <p>{t('map.height')}</p>
                    <p>{lastData ? lastData['sea_level'] + " m" : "_"}</p>
                </div>
                <div className="mk-map-satellites">
                    <img src={Satellite} alt="satellite"/>
                    <span>{lastData ? lastData['number_of_satellites'] : 1}</span>
                </div>
            </div>
        </div>
    );
}