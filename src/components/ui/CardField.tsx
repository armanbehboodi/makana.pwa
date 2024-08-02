import React from "react";
import Signal from "../../assets/images/icons/signal.svg";
import Gps from "../../assets/images/icons/gps.svg";
import Battery100 from "../../assets/images/icons/battery100.svg";
import Battery75 from "../../assets/images/icons/battery75.svg";
import Battery50 from "../../assets/images/icons/battery50.svg";
import Battery25 from "../../assets/images/icons/battery25.svg";

interface IProps {
    icon: string,
    text: string
}

export const CardField:React.FC<IProps> = ({icon, text}) => {

    let iconSrc;
    switch (icon) {
        case "signal":
            iconSrc = Signal;
            break;
        case "gps":
            iconSrc = Gps;
            break;
        case "b100":
            iconSrc = Battery100;
            break;
        case "b75":
            iconSrc = Battery75;
            break;
        case "b50":
            iconSrc = Battery50;
            break;
        case "b25":
            iconSrc = Battery25;
            break;
    }

    return (
        <div className="mk-card">
            <img src={iconSrc} alt="icon"/>
            <p>{text}</p>
        </div>
    )
}