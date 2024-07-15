import {useReducer, useRef} from "react";
import {useDispatch} from "react-redux";
import {useTranslation} from 'react-i18next';
import Logo from "../assets/images/logoWithText.jpg";
import {TextField} from "../components/ui/TextField";
import {ButtonField} from "../components/ui/ButtonField";
import {Validator} from "../helper/Validator";
import {pageSliceActions} from "../store/store";
import Snackbar from "@mui/material/Snackbar";
import {staticData} from "../constants/staticData";
import {setCookie} from "../helper/CookieHandler";

export const Login = () => {
    const {t} = useTranslation(),
        reduxDispatch = useDispatch(),
        refs = {
            mobile: useRef<HTMLInputElement>(null),
            password: useRef<HTMLInputElement>(null),
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
        let error = {
            mobile: !Validator("mobile", refs.mobile.current!.value),
            password: !Validator("password", refs.password.current!.value),
        };

        if (!Object.values(error).some((item: boolean) => item)) {
            try {
                const response = await fetch(staticData.login_api, {
                    method: "POST",
                    body: JSON.stringify({
                        phone_number: refs.mobile.current!.value,
                        password: refs.password.current!.value
                    }),
                    headers: {
                        "Content-Type": "application/json"
                    }
                });

                const data = await response.json();

                if (response.ok) {
                    setCookie("mk-login-token", data.token, 7);
                    reduxDispatch(pageSliceActions.setPage({page: "login"}));
                } else {
                    dispatch({type: "snack", payload: {snack: true, message: data.message}});
                }
            } catch (error) {
                dispatch({type: "snack", payload: {snack: true, message: t('error.default')}});
            }
        }

        dispatch({type: "error", payload: error});
    }

    const switchToRegisterHandler = () => {
        reduxDispatch(pageSliceActions.setPage({page: "register"}));
    }

    return (
        <div className="mk-register-root">
            <div className="mk-register-container">
                <img src={Logo} alt="logo" className="mk-register-logo"/>
                <TextField label={t('register.mobile')} type="text" ref={refs.mobile} error={state.error.mobile}/>
                <TextField label={t('register.password')} type="password" ref={refs.password}
                           error={state.error.password}/>
                <ButtonField label={t('login.account')} icon="account" color="gray"
                             pressHandler={switchToRegisterHandler}/>
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