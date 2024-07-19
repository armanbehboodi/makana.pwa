import React, {useRef, useReducer} from "react";
import {useDispatch} from "react-redux";
import {useTranslation} from 'react-i18next';
import {pageSliceActions} from "../store/store";
import Snackbar from '@mui/material/Snackbar';
import Logo from "../assets/images/logoWithText.jpg";
import {Validator} from "../helper/Validator";
import {TextField, CheckField, ButtonField} from "../components/ui/uiComponents";
import {staticData} from "../constants/staticData";
import {p2e} from "../helper/LngConvertor";

export const Register:React.FC = () => {
    const {t} = useTranslation(),
        reduxDispatch = useDispatch(),
        refs = {
            mobile: useRef<HTMLInputElement>(null),
            password: useRef<HTMLInputElement>(null),
            repeat: useRef<HTMLInputElement>(null),
        };

    const initializer = (initialState: any) => initialState,
        initialState = {
            faq: false,
            error: {
                mobile: false,
                password: false,
                repeat: false,
            },
            snack: false,
            snackMessage: ""
        };

    const [state, dispatch] = useReducer(
        reducer, initialState, initializer
    );

    const registerHandler = async () => {
        let mobile = p2e(refs.mobile.current!.value),
            password = p2e(refs.password.current!.value),
            repeat = p2e(refs.repeat.current!.value),
            error = {
            mobile: !Validator("mobile", mobile),
            password: !Validator("password", password),
            repeat: password !== repeat,
        };

        if (!Object.values(error).some((item: boolean) => item)) {
            try {
                const response = await fetch(staticData.register_api, {
                    method: "POST",
                    body: JSON.stringify({
                        phone_number: mobile,
                        password: password
                    }),
                    headers: {
                        "Content-Type": "application/json"
                    }
                });

                const data = await response.json();

                if (response.ok) {
                    reduxDispatch(pageSliceActions.setPage({page: "otp", extra_data: refs.mobile.current!.value}));
                } else {
                    dispatch({type: "snack", payload: {snack: true, message: t(`error.${data.message}`)}});
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
                <TextField label={t('register.repeat')} type="password" ref={refs.repeat} error={state.error.repeat}/>
                <CheckField label={t('register.faq')}
                            changeHandler={(isChecked: boolean) => dispatch({type: "faq", payload: isChecked})}/>
                <ButtonField label={t('register.account')} icon="account" color="gray"
                             pressHandler={() => reduxDispatch(pageSliceActions.setPage({page: "login"}))}/>
                <ButtonField label={t('register.confirm')} icon="confirm" color="main" pressHandler={registerHandler}
                             isDisabled={!state.faq}/>
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
        case "faq":
            return {
                ...state,
                faq: action.payload
            };
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
