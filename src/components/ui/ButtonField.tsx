import React from "react";
import {Button} from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditIcon from '@mui/icons-material/Edit';
import ReplayIcon from '@mui/icons-material/Replay';
import {CountDown} from "../components";

interface IProps {
    label: string,
    icon?: string,
    color: string,
    pressHandler: () => void,
    isDisabled?: boolean,
    countDownSeconds?: null | number,
    finishCountDown?: () => void,
    className?: string
}

export const ButtonField: React.FC<IProps> = ({
                                                  label,
                                                  icon,
                                                  color,
                                                  isDisabled,
                                                  countDownSeconds,
                                                  pressHandler,
                                                  finishCountDown,
                                                  className
                                              }) => {

    let buttonIcon;
    switch (icon) {
        case "account":
            buttonIcon = <PersonIcon/>;
            break;
        case "confirm":
            buttonIcon = <CheckCircleIcon/>;
            break;
        case "edit":
            buttonIcon = <EditIcon/>;
            break;
        case "again":
            buttonIcon = <ReplayIcon/>;
            break;
        default:
            buttonIcon = null;
            break;
    }

    const clickHandler = () => {
        if (typeof isDisabled === "undefined" || !isDisabled) {
            pressHandler();
        }
    }

    return (
        <Button variant="contained" startIcon={buttonIcon} data-color={color} className={className}
                data-status={isDisabled ? 'disabled' : 'enabled'} onClick={clickHandler}>
            {label} {countDownSeconds ? <CountDown seconds={countDownSeconds} finish={finishCountDown!}/> : null}
        </Button>
    )
}