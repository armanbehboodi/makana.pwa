import React from "react";
import Signal from "../../assets/images/icons/signal.svg";
import Gps from "../../assets/images/icons/gps.svg";
import BatteryFull from "../../assets/images/icons/battery-full.svg";
import BatteryMid from "../../assets/images/icons/battery-mid.svg";
import BatteryLow from "../../assets/images/icons/battery-low.svg";

interface IProps {
    icon: string,
    text: string,
    extraText?: string
}

export const CardField:React.FC<IProps> = ({icon, text, extraText}) => {

    let iconSrc;
    switch (icon) {
        case "signal":
            iconSrc = Signal;
            break;
        case "gps":
            iconSrc = Gps;
            break;
        case "bf":
            iconSrc = BatteryFull;
            break;
        case "bm":
            iconSrc = BatteryMid;
            break;
        case "bl":
            iconSrc = BatteryLow;
            break;
    }

    return (
        <div className="mk-card">
            <img src={iconSrc} alt="icon"/>
            <p>{text} {extraText ? " " + extraText : null}</p>
        </div>
    )
}