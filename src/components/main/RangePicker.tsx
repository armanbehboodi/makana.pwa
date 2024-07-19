import React, {useState} from "react";
import {useTranslation} from 'react-i18next';
import { DatePicker, TimePicker } from "zaman";
import Calendar from "../../assets/images/icons/calendar.svg";

export const RangePicker:React.FC = () => {

    const {t} = useTranslation(),
        [trigger, setTrigger] = useState(false);

    return (
        <div className={`mk-range-picker-root ${trigger ? "open" : "close"}`}>
            <div className="mk-range-picker-trigger" onClick={() => setTrigger(!trigger)}>
                <span/>
            </div>
            <div className="mk-range-picker-box start">
                <span className="mk-range-picker-label">{t("date.start")}</span>
                <DatePicker onChange={(e:any) => console.log(e.value)} />
                <TimePicker onChange={(e) => console.log(e.hour, e.minute, e.timeConvention)}/>
                <img src={Calendar} alt="calendar"/>
            </div>
            <div className="mk-range-picker-box end">
                <span className="mk-range-picker-label">{t("date.end")}</span>
                <DatePicker onChange={(e:any) => console.log(e.value)} />
                <TimePicker onChange={(e) => console.log(e.hour, e.minute, e.timeConvention)}/>
                <img src={Calendar} alt="calendar"/>
            </div>
        </div>
    )
}