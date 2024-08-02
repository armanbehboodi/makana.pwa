import React, {useState} from "react";
import {DevicesList, CardField} from "../../components/components";
import {shallowEqual, useSelector} from "react-redux";
import {useTranslation} from 'react-i18next';
import {RootState} from "../../store/store";

export const Setting:React.FC = () => {

    const {t} = useTranslation(),
        {devices} = useSelector((state: RootState) => ({
            devices: state.data.devices
        }), shallowEqual);

    const [device, setDevice] = useState(devices[7] || {});

    console.log(device);

    return (
        <div className="mk-setting">
            <div className="mk-map-root">
                <DevicesList onClick={(device) => setDevice(device)}/>
            </div>
            <div className="mk-setting-status">
                <CardField icon="b100" text={t("setting.battery")}/>
                <CardField icon="signal" text={t("setting.internet")}/>
                <CardField icon="gps" text={t("setting.gps")}/>
            </div>
        </div>
    )
}