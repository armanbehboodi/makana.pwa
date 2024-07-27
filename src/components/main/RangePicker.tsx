import React, {useState} from "react";
import {useTranslation} from 'react-i18next';
import {DatePicker, TimePicker} from "zaman";
import Slider from '@mui/material/Slider';
import Calendar from "../../assets/images/icons/calendar.svg";
import {ButtonField} from "../ui/ButtonField";
import {getTimeStamp} from "../../helper/Calculator";
import {staticData} from "../../constants/staticData";
import {getCookie} from "../../helper/CookieHandler";

interface IProps {
    device: any,
    onSet: (data: any) => void,
    isDisabled?: boolean,
    onChangeRange: (data: number) => void
}

export const RangePicker: React.FC<IProps> = ({device, onSet, isDisabled, onChangeRange}) => {

    const {t} = useTranslation(),
        [trigger, setTrigger] = useState(false),
        [startDate, setStartDate]: any = useState(null),
        [startTime, setStartTime]: any = useState(null),
        [endDate, setEndDate]: any = useState(null),
        [endTime, setEndTime]: any = useState(null),
        token = getCookie("mk-login-token");

    const dateHandler = (type: string, value: string) => {
        const modal: any = document.querySelector('.rdp__modal') || document.querySelector('.css-1m8qzkt');

        switch (type) {
            case "SD":
                setStartDate(value);
                break;
            case "ED":
                setEndDate(value);
                break;
            case "ST":
                setStartTime(value);
                break;
            case "ET":
                setEndTime(value);
                break;
        }

        if (modal) {
            modal.style.display = "none";
        }
    }

    const pressHandler = async () => {
        const response = await fetch(staticData.devices + device.id + '/archive/gps?end_time=' + getTimeStamp(endDate, endTime) + '&start_time=' + getTimeStamp(startDate, startTime), {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        }), result = await response.json();

        setTrigger(false);
        onSet(result['data']);
    }

    let timer:any;
    const changeRangeHandler = (range: number) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            onChangeRange(range);
        }, 500);
    }

    return (
        <div className={`mk-range-picker-root ${trigger ? "open" : "close"}`}>
            <div className="mk-range-picker-trigger" onClick={() => setTrigger(!trigger)}>
                <span/>
            </div>
            <div className="mk-range-picker-range">
                <Slider disabled={isDisabled} size="small" defaultValue={0} aria-label="Small" onChange={(e: any) => changeRangeHandler(e.target.value)}/>
            </div>
            <div className="mk-range-picker-box start">
                <span className="mk-range-picker-label">{t("date.start")}</span>
                <DatePicker onChange={(e: any) => dateHandler("SD", new Date(e.value).toLocaleDateString())}/>
                <TimePicker onChange={(e: any) => dateHandler("ST", `${e.hour}:${e.minute}`)}/>
                <img src={Calendar} alt="calendar"/>
            </div>
            <div className="mk-range-picker-box end">
                <span className="mk-range-picker-label">{t("date.end")}</span>
                <DatePicker onChange={(e: any) => dateHandler("ED", new Date(e.value).toLocaleDateString())}/>
                <TimePicker onChange={(e: any) => dateHandler("ET", `${e.hour}:${e.minute}`)}/>
                <img src={Calendar} alt="calendar"/>
            </div>
            <ButtonField className={[startDate, startTime, endDate, endTime].some(item => !item) ? "disabled" : ""}
                         label={t("history.check")} color={"main"} pressHandler={pressHandler}/>
        </div>
    )
}