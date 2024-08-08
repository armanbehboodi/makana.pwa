import React, {useReducer} from "react";
import {DevicesList, CardField, SwitchField, Loading} from "../../components/components";
import {shallowEqual, useSelector} from "react-redux";
import {useTranslation} from 'react-i18next';
import {RootState} from "../../store/store";
import {getCookie} from "../../helper/CookieHandler";
import {SnackField} from "../../components/components";
import {staticData} from "../../constants/staticData";
import SettingIcon from "../../assets/images/icons/setting.svg";
import FenceIcon from "../../assets/images/icons/fence.svg";
import {useQuery} from "react-query";
import {FencesList} from "../../components/main/FencesList";

interface IGeneralSetting {
    battery: string,
    gps: string,
    internet: string
}

export const Setting: React.FC = () => {

    const {t} = useTranslation(),
        {devices} = useSelector((state: RootState) => ({
            devices: state.data.devices
        }), shallowEqual),
        token = getCookie("mk-login-token");

    const initializer = (initialState: any) => initialState,
        initialState = {
            device: devices[0] || {},
            fences: [],
            loading: false,
            snack: {
                visible: false,
                type: "error",
                message: ""
            },
            light: false,
            sound: false
        };

    const [state, dispatch] = useReducer(
        reducer, initialState, initializer
    );

    // getting general setting data (battery, gps and internet connection) every 10 seconds
    const fetchData = async (deviceId: string) => {
        const response = await fetch(staticData.devices_api + deviceId + '/ws/STATUS', {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (response.ok) return response.json();
    };

    const {data} = useQuery(
        ['fetchData', state.device.id],
        () => fetchData(state.device.id),
        {
            refetchInterval: 15000,
            refetchIntervalInBackground: true,
            staleTime: 5000,
            onSettled: () => {
                if (state.loading) dispatch({type: "loading", payload: false});
            }
        }
    ), Data = data && data.data ? data.data[data.data.length - 1] : null;

    const settingData: IGeneralSetting = Data ? {
        battery: Number(Data['battery_Voltage']) > 4 ? t("general.strong") : t("general.weak"),
        gps: Number(Data['gprs_snr']) > 25 ? t("general.strong") : t("general.weak"),
        internet: Number(Data['best_satellite_snr']) > 25 ? t("general.strong") : t("general.weak")
    } : {battery: "_", gps: "_", internet: "_"};

    // getting fences data
    const getFencesList = async (device: any) => {
        const deviceId = device.id;

        try {
            const response = await fetch(staticData.devices_api + deviceId + '/fences', {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                }),
                data = await response.json();

            if (response.ok) {
                dispatch({type: "data", payload: {fences: data.fences, device: device}});
            } else {
                dispatch({type: "data", payload: {fences: [], device: device}});
            }
        } catch (err) {
            dispatch({type: "data", payload: {fences: [], device: device}});
        }
    };

    // handling led and sound
    const serviceHandler = async (service: string, status: boolean) => {
        dispatch({type: "loading", payload: true});

        try {
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

                    dispatch({
                        type: service,
                        payload: {
                            [service]: status,
                            snack: {visible: true, type: "success", message: message}
                        }
                    });
                } else {
                    dispatch({
                        type: service,
                        payload: {
                            [service]: status,
                            snack: {visible: true, type: "error", message: t("error.default")}
                        }
                    });
                }
            }, 2000);
        } catch (err) {
            dispatch({
                type: "snack",
                payload: {visible: true, type: "error", message: t("error.default")}
            });
        }
    };

    return (
        <div className="mk-setting">
            <div className="mk-map-root">
                <DevicesList onClick={(device) => getFencesList(device)}/>
            </div>
            <div className="mk-setting-status">
                <CardField icon="bf" text={t("setting.battery")} extraText={settingData.battery}/>
                <CardField icon="signal" text={t("setting.internet")} extraText={settingData.internet}/>
                <CardField icon="gps" text={t("setting.gps")} extraText={settingData.gps}/>
            </div>
            <div className="mk-setting-box mk-setting-fences">
                <div className="mk-setting-header">
                    <img src={FenceIcon} alt="fence"/>
                    <h3>{t("setting.fence")}</h3>
                </div>
                <FencesList fences={state.fences}/>
            </div>
            <div className="mk-setting-box mk-setting-general">
                <div className="mk-setting-header">
                    <img src={SettingIcon} alt="setting"/>
                    <h3>{t("setting.general")}</h3>
                </div>
                <div className="mk-setting-switch-box">
                    <SwitchField isChecked={state.light}
                                 handleChange={(value: boolean) => serviceHandler("light", value)}
                                 icon="light" title={t("setting.light")}/>
                    <SwitchField isChecked={state.sound}
                                 handleChange={(value: boolean) => serviceHandler("sound", value)}
                                 icon="sound" title={t("setting.sound")}/>
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
        case "data":
            return {
                ...state,
                device: action.payload.device,
                fences: action.payload.fences
            }
        case "sound":
            return {
                ...state,
                sound: action.payload.sound,
                snack: action.payload.snack,
                loading: false
            }
        case "light":
            return {
                ...state,
                light: action.payload.light,
                snack: action.payload.snack,
                loading: false
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