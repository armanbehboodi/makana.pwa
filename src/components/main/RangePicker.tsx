import React, {useState} from "react";
import {useTranslation} from 'react-i18next';
import {DatePicker, TimePicker} from "zaman";
import Calendar from "../../assets/images/icons/calendar.svg";
import {ButtonField} from "../ui/ButtonField";

export const RangePicker: React.FC = () => {

    const {t} = useTranslation(),
        [trigger, setTrigger] = useState(false),
        [startDate, setStartDate]: any = useState(null),
        [startTime, setStartTime]: any = useState(null),
        [endDate, setEndDate]: any = useState(null),
        [endTime, setEndTime]: any = useState(null);

    const dateHandler = (type:string, value:string) => {
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

    return (
        <div className={`mk-range-picker-root ${trigger ? "open" : "close"}`}>
            <div className="mk-range-picker-trigger" onClick={() => setTrigger(!trigger)}>
                <span/>
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
                         label={t("history.check")} color={"main"} pressHandler={() => console.log(123)}/>
        </div>
    )
}