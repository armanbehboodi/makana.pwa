import React, {useReducer} from "react";
import {DevicesList, CardField, SwitchField, Loading} from "../../components/components";
import {shallowEqual, useSelector} from "react-redux";
import {useTranslation} from 'react-i18next';
import {RootState} from "../../store/store";
import {getCookie} from "../../helper/CookieHandler";
import {staticData} from "../../constants/staticData";
import SettingIcon from "../../assets/images/icons/setting.svg";
import {SnackField} from "../../components/ui/SnackField";

export const Setting: React.FC = () => {

    const {t} = useTranslation(),
        {devices} = useSelector((state: RootState) => ({
            devices: state.data.devices
        }), shallowEqual),
        token = getCookie("mk-login-token");

    const initializer = (initialState: any) => initialState,
        initialState = {
            device: devices[7] || {},
            loading: false,
            snack: {
                visible: false,
                type: "error",
                message: ""
            }
        };

    const [state, dispatch] = useReducer(
        reducer, initialState, initializer
    );

    // handling led and sound
    const serviceHandler = async (service: string, status: boolean) => {
        dispatch({type: "loading", payload: true});

        const response = await fetch(staticData.devices_api + state.device.id + "/verbs/" + service, {
            method: "POST",
            body: JSON.stringify({
                status: status ? "on" : "off"
            }),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        setTimeout(() => {
            if (response.ok) {
                let message = service === "sound" ? status ? t("setting.soundOn") : t("setting.soundOff") : status ? t("setting.lightOn") : t("setting.lightOff");

                dispatch({type: "snack", payload: {visible: true, type: "success", message: message}});
            } else {
                dispatch({type: "snack", payload: {visible: true, type: "error", message: t("error.default")}});
            }
        }, 2000);
    };

    return (
        <div className="mk-setting">
            <div className="mk-map-root">
                <DevicesList onClick={(device) => dispatch({type: "device", payload: device})}/>
            </div>
            <div className="mk-setting-status">
                <CardField icon="bf" text={t("setting.battery")}/>
                <CardField icon="signal" text={t("setting.internet")}/>
                <CardField icon="gps" text={t("setting.gps")}/>
            </div>
            <div className="mk-setting-general">
                <div className="mk-setting-general-header">
                    <img src={SettingIcon} alt="led"/>
                    <h3>{t("setting.general")}</h3>
                </div>
                <div className="mk-setting-switch-box">
                    <SwitchField isChecked={false} handleChange={(value: boolean) => serviceHandler("led", value)}
                                 icon="light" disabled={state.snack.visible} size="small"
                                 title={t("setting.light")}/>
                    <SwitchField isChecked={false} handleChange={(value: boolean) => serviceHandler("sound", value)}
                                 icon="sound" disabled={state.snack.visible} size="small"
                                 title={t("setting.sound")}/>
                </div>
            </div>
            <SnackField isOpen={state.snack.visible} type={state.snack.type} message={state.snack.message}
                        duration={2000} closeHandler={() => dispatch({
                type: "snack",
                payload: {visible: false, type: state.snack.type, message: ""}
            })}/>
            {state.loading && <Loading/>}
        </div>
    )
}

function reducer(state: any, action: any) {
    switch (action.type) {
        case "device":
            return {
                ...state,
                device: action.payload
            }
        case "loading":
            return {
                ...state,
                loading: action.payload
            }
        case "snack":
            return {
                ...state,
                loading: false,
                snack: action.payload
            }
    }
}