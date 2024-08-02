import React, {useReducer, useRef} from "react";
import {useDispatch} from "react-redux";
import {useNavigate} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import Snackbar from "@mui/material/Snackbar";
import {dataSliceActions} from "../store/store";
import {staticData} from "../constants/staticData";
import {TextField, ButtonField} from "../components/components";
import {setCookie, p2e, Validator} from "../helper/helper";
import Logo from "../assets/images/logoWithText.jpg";

export const Login: React.FC = () => {
    const {t} = useTranslation(),
        navigate = useNavigate(),
        reduxDispatch = useDispatch(),
        refs = {
            mobile: useRef<HTMLInputElement | null>(null),
            password: useRef<HTMLInputElement | null>(null),
        };

    const initializer = (initialState: any) => initialState,
        initialState = {
            error: {
                mobile: false,
                password: false,
            },
            snack: false,
            snackMessage: ""
        };

    const [state, dispatch] = useReducer(
        reducer, initialState, initializer
    );

    const loginHandler = async () => {
        let mobile = p2e(refs.mobile.current!.value),
            password = p2e(refs.password.current!.value),
            error = {
                mobile: !Validator("mobile", mobile),
                password: !Validator("password", password),
            };

        if (!Object.values(error).some((item: boolean) => item)) {
            try {
                const response = await fetch(staticData.login_api, {
                    method: "POST",
                    body: JSON.stringify({
                        phone_number: mobile,
                        password: password
                    }),
                    headers: {
                        "Content-Type": "application/json"
                    }
                });

                const loginData = await response.json();

                if (response.ok) {
                    fetch(staticData.devices, {
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${loginData['token']}`
                        }
                    }).then((response) => {
                        return response.json();
                    }).then((devicesData) => {
                        const filteredDevices = devicesData.devices.filter((device:any) => device.state === "Active");

                        setCookie("mk-login-token", loginData['token'], 3);
                        reduxDispatch(dataSliceActions.setDevices({devices: filteredDevices}));

                        // activating the first device (default selected device)
                        fetch(staticData.devices + filteredDevices[0].id + "/verb", {
                            method: "POST",
                            body: JSON.stringify({
                                status: "open"
                            }),
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${loginData['token']}`
                            }
                        })
                            .then((res) => {
                                if (res.ok) {
                                    navigate("/");
                                } else dispatch({type: "snack", payload: {snack: true, message: t('error.default')}});
                            })
                    }).catch(() => {
                        dispatch({type: "snack", payload: {snack: true, message: t('error.default')}});
                    })
                } else {
                    dispatch({type: "snack", payload: {snack: true, message: t(`error.${loginData.message}`)}});
                }
            } catch (error) {
                dispatch({type: "snack", payload: {snack: true, message: t('error.default')}});
            }
        }

        dispatch({type: "error", payload: error});
    }

    return (
        <div className="mk-register-root">
            <div className="mk-register-container">
                <img src={Logo} alt="logo" className="mk-register-logo"/>
                <TextField label={t('register.mobile')} type="text" ref={refs.mobile} error={state.error.mobile}/>
                <TextField label={t('register.password')} type="password" ref={refs.password}
                           error={state.error.password}/>
                <ButtonField label={t('login.account')} icon="account" color="gray"
                             pressHandler={() => navigate("/register")}/>
                <ButtonField label={t('register.confirm')} icon="confirm" color="main" pressHandler={loginHandler}/>
            </div>
            <Snackbar
                open={state.snack} anchorOrigin={{vertical: "top", horizontal: "right"}}
                autoHideDuration={5000} data-type="error"
                onClose={() => dispatch({type: "closeSnack"})}
                message={state.snackMessage}/>
        </div>
    )
};

function reducer(state: any, action: any) {
    switch (action.type) {
        case "error":
            return {
                ...state,
                error: action.payload
            };
        case "snack":
            return {
                ...state,
                snack: action.payload.snack,
                snackMessage: action.payload.message
            };
        case "closeSnack":
            return {
                ...state,
                snack: false
            }
    }
}