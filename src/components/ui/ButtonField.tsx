import {Button} from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditIcon from '@mui/icons-material/Edit';
import ReplayIcon from '@mui/icons-material/Replay';
import {CountDown} from "../CountDown";

interface IProps {
    label: string,
    icon?: string,
    color: string,
    pressHandler: () => void,
    isDisabled?: boolean,
    countDownSeconds?: null | number,
    finishCountDown?: () => void
}

export const ButtonField = (props: IProps) => {
    const {label, icon, color, isDisabled, countDownSeconds} = props;

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
            props.pressHandler();
        }
    }

    return (
        <Button variant="contained" startIcon={buttonIcon} data-color={color}
                data-status={isDisabled ? 'disabled' : 'enabled'} onClick={clickHandler}>
            {label} {countDownSeconds ? <CountDown seconds={countDownSeconds} finish={props.finishCountDown!}/> : null}
        </Button>
    )
}