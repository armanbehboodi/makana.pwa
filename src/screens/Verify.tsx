import React, {useEffect, useReducer} from "react";
import {shallowEqual, useSelector} from "react-redux";
import {useNavigate} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import OtpInput from 'react-otp-input';
import {RootState} from "../store/store";
import {staticData} from "../constants/staticData";
import {ButtonField} from "../components/components";
import {p2e} from "../helper/helper";
import Logo from "../assets/images/logoWithText.jpg";
import {SnackField} from "../components/ui/SnackField";

export const Verify: React.FC = () => {
    const {t} = useTranslation(),
        navigate = useNavigate(),
        {mobile} = useSelector((state: RootState) => ({
            mobile: state.data.mobile
        }), shallowEqual);

    const initializer = (initialState: any) => initialState,
        initialState = {
            otp: "",
            resend: false,
            snack: false,
            snackType: "error",
            snackMessage: ""
        };

    const [state, dispatch] = useReducer(
        reducer, initialState, initializer
    );

    const refreshCodeHandler = async () => {
        dispatch({type: "resend", payload: false});

        try {
            const response = await fetch(staticData.refresh_code_api, {
                method: "POST",
                body: JSON.stringify({
                    phone_number: p2e(mobile)
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const data = await response.json();

            if (!response.ok) {
                dispatch({type: "snack", payload: {snack: true, message: data.message}});
            }
        } catch (error) {
            dispatch({type: "snack", payload: {snack: true, message: t('error.default')}});
        }
    }

    const verifyHandler = async () => {
        try {
            const response = await fetch(staticData.verify_api, {
                method: "POST",
                body: JSON.stringify({
                    phone_number: p2e(mobile),
                    verification_code: p2e(state.otp)
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const data = await response.json();

            if (response.ok) {
                dispatch({type: "snack", payload: {snack: true, message: t('otp.success'), type: "success"}});
                setTimeout(() => {
                    navigate("/login");
                }, 5000);
            } else {
                dispatch({type: "snack", payload: {snack: true, message: t(`error.${data.message}`)}});
            }
        } catch (error) {
            dispatch({type: "snack", payload: {snack: true, message: t('error.default')}});
        }
    }

    useEffect(() => {
        if (state.otp.length === 6) {
            if (document.activeElement && document.activeElement instanceof HTMLElement) {
                (document.activeElement as HTMLElement).blur();
            }

            verifyHandler();
        }
    }, [state.otp]);

    return (
        <div className="mk-register-root">
            <div className="mk-register-container">
                <img src={Logo} alt="logo" className="mk-register-logo"/>
                <span className="mk-otp-label">{t('otp.label')}</span>
                <OtpInput containerStyle="mk-otp-container" value={state.otp}
                          onChange={(value: string) => dispatch({type: "otp", payload: value})}
                          numInputs={6} renderInput={(props) => <input {...props} />}/>
                <ButtonField label={t('otp.edit')} icon="edit" color="main"
                             pressHandler={() => navigate("/register")}/>
                <ButtonField label={t('otp.resend')} icon="again" color="main" pressHandler={refreshCodeHandler}
                             isDisabled={!state.resend} countDownSeconds={!state.resend ? 120 : null}
                             finishCountDown={() => dispatch({type: "resend", payload: true})}/>
            </div>
            <SnackField isOpen={state.snack} type={state.snackType} duration={5000} message={state.snackMessage}
                        closeHandler={() => dispatch({type: "closeSnack"})}/>
        </div>
    )
};

function reducer(state: any, action: any) {
    switch (action.type) {
        case "otp":
            return {
                ...state,
                otp: action.payload
            };
        case "resend":
            return {
                ...state,
                resend: action.payload
            };
        case "snack":
            return {
                ...state,
                snack: action.payload.snack,
                snackMessage: action.payload.message,
                snackType: action.payload.type || "error"
            };
        case "closeSnack":
            return {
                ...state,
                snack: false
            }
    }
}