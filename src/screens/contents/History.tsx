import React, {useReducer} from "react";
import {shallowEqual, useSelector} from "react-redux";
import {useTranslation} from 'react-i18next';
import {RootState} from "../../store/store";
import {RangePicker, DevicesList, MapBox} from "../../components/components";
import {SnackField} from "../../components/ui/SnackField";

export const History: React.FC = () => {

    const {t} = useTranslation(),
        {devices} = useSelector((state: RootState) => ({
            devices: state.data.devices
        }), shallowEqual);

    const initializer = (initialState: any) => initialState,
        initialState = {
            polyline: false,
            fullData: [],
            device: devices[7] || {},
            range: null,
            snack: false
        };

    const [state, dispatch] = useReducer(
        reducer, initialState, initializer
    );

    return (
        <div className="mk-map-root">
            <DevicesList onClick={(device) => dispatch({type: "change_device", payload: device})}/>
            <MapBox device={state.device} fullData={state.fullData}
                    polyline={state.polyline} range={state.range}/>
            <RangePicker
                onSet={(data) => dispatch({type: "set_polyline", payload: data})}
                isDisabled={!state.fullData.length} device={state.device}
                onChangeRange={(range: number) => dispatch({type: "set_range", payload: range})}/>
            <SnackField isOpen={state.snack} type={"error"} message={t("history.noHistory")}
                        closeHandler={() => dispatch({type: "set_snack", payload: false})}/>
        </div>
    )
}

function reducer(state: any, action: any) {
    switch (action.type) {
        case "change_device":
            return {
                ...state,
                polyline: false,
                fullData: [],
                range: null,
                device: action.payload
            }
        case "set_polyline":
            return {
                ...state,
                polyline: true,
                snack: !action.payload.length,
                fullData: action.payload
            };
        case "set_range":
            return {
                ...state,
                range: action.payload
            }
        case "set_snack":
            return {
                ...state,
                snack: action.payload
            }
    }
}