import React, {useState} from "react";
import {shallowEqual, useSelector} from "react-redux";
import {useTranslation} from 'react-i18next';
import {RootState} from "../../store/store";
import {staticData} from "../../constants/staticData";
import {getCookie} from "../../helper/helper";
import Default from "../../assets/images/default.png";
import {SnackField} from "../ui/SnackField";

interface IProps {
    onClick: (device: any) => void
}

export const DevicesList: React.FC<IProps> = (props) => {

    const {t} = useTranslation(),
        token = getCookie("mk-login-token");

    const {devices} = useSelector((state: RootState) => ({
            devices: state.data.devices
        }), shallowEqual),
        [selectedDevice, setSelectedDevice] = useState(devices[0]),
        [snack, setSnack] = useState(false);

    const clickHandler = (device: any) => {
        if (device.id !== selectedDevice.id) {
            fetch(staticData.devices_api + device.id + "/verb", {
                method: "POST",
                body: JSON.stringify({
                    status: "open"
                }),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })
                .then((response) => {
                    if (response.ok) {
                        props.onClick(device);
                        setSelectedDevice(device);
                    } else setSnack(true);
                })
        }
    }

    return (
        <div className="mk-map-devices-list">
            {devices.map((device, index: number) => {
                return (
                    <div
                        className={`mk-map-device ${selectedDevice.id === device.id ? "active" : ""}`}
                        key={index} onClick={() => clickHandler(device)}>
                        <img src={device['image_url'] || Default} className={!device['image_url'] ? 'default' : ''}
                             alt="device" onError={(e: any) => e.currentTarget.src = Default}/>
                        <p>{device.name}</p>
                    </div>
                )
            })}
            <SnackField isOpen={snack} type={"error"} duration={5000} message={t('error.default')}
                        closeHandler={() => setSnack(false)}/>
        </div>
    )
}