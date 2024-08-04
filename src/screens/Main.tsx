import React, {useEffect} from "react";
import {Outlet} from "react-router-dom";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {useTranslation} from 'react-i18next';
import {dataSliceActions, RootState} from "../store/store";
import {staticData} from "../constants/staticData";
import {NavigationBar} from "../components/components";
import {deleteCookie, getCookie, useWarnOnClose} from "../helper/helper";

export const Main: React.FC = () => {

    const {t} = useTranslation(),
        dispatch = useDispatch(),
        {devices} = useSelector((state: RootState) => ({
            devices: state.data.devices
        }), shallowEqual),
        token = getCookie("mk-login-token");

    // check if token is valid but there is no device, call the devices api
    useEffect(() => {
        if (token.length && !devices.length) {
            fetch(staticData.devices_api, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            }).then((response) => {
                return response.json();
            }).then((devicesData) => {
                const filteredDevices = devicesData.devices.filter((device: any) => device.state === "Active");

                fetch(staticData.devices_api + filteredDevices[0].id + "/verb", {
                    method: "POST",
                    body: JSON.stringify({
                        status: "open"
                    }),
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                })
                    .then((res) => {
                        if (res.ok) {
                            dispatch(dataSliceActions.setDevices({devices: filteredDevices}));
                        } else dispatch({type: "snack", payload: {snack: true, message: t('error.default')}});
                    })
            })
        }
    }, []);

    // alert user when tries to leave the app. logout when leaves => deleting cookie and data
    const handleLeaveApp = () => {
        deleteCookie("mk-login-token");
        dispatch(dataSliceActions.resetData());
    }

    useWarnOnClose(handleLeaveApp);

    return (
        <div className="mk-main-root">
            <Outlet key={Math.random()}/> {/* Content will be rendered here based on the route */}
            <NavigationBar/>
        </div>
    );
}