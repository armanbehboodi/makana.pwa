import React, {useEffect, useState} from "react";
import {useTranslation} from 'react-i18next';
import {DatePicker, TimePicker} from "zaman";
import {staticData} from "../../constants/staticData";
import {ButtonField, MediumSlider} from "../components";
import {getCookie, getTimeStamp, usePrevious} from "../../helper/helper";
import Calendar from "../../assets/images/icons/calendar.svg";

interface IProps {
    device: any,
    onSet: (data: any) => void,
    isDisabled?: boolean,
    onChangeRange: (data: number) => void,
    isDeviceChanged?: boolean
}

export const RangePicker: React.FC<IProps> = ({device, onSet, isDisabled, onChangeRange}) => {

    const {t} = useTranslation(),
        today = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric'
        }),
        [trigger, setTrigger] = useState(false),
        [startDate, setStartDate]: any = useState(today),
        [startTime, setStartTime]: any = useState(new Date().setHours(0, 0, 0, 0)),
        [endDate, setEndDate]: any = useState(today),
        [endTime, setEndTime]: any = useState(new Date().setHours(23, 59, 0, 0)),
        [swipeY, setSwipeY] = useState(null),
        token = getCookie("mk-login-token");

    const dateHandler = (type: string, value: string) => {
        const modal: any = document.querySelector('.rdp__modal') || document.querySelector('.css-1m8qzkt');

        // SD : Start Date, ST: Start Time, ED : End Date, ET: End Time
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

    let timer: any;
    const changeRangeHandler = (range: number) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            onChangeRange(range);
        }, 500);
    }

    // user can open rangePicker component by swiping up the trigger
    const handleTouchStart = (e:any) => {
        setSwipeY(e.touches[0].clientY);
    };

    const handleTouchEnd = (e:any) => {
        const swipeEndY = e.changedTouches[0].clientY;

        if (swipeY !== null && swipeY - swipeEndY > 50) {
            setTrigger(true);
        } else if (swipeY !== null && swipeEndY - swipeY > 50) {
            setTrigger(false);
        }

        setSwipeY(null);
    };

    const prevDevice = usePrevious(device);
    useEffect(() => {
        if (prevDevice && device && prevDevice['id'] !== device.id) {
            setTrigger(true);
        }
    }, [device, prevDevice]);

    return (
        <div className={`mk-range-picker-root ${trigger ? "open" : "close"}`}>
            <div className="mk-range-picker-trigger" onClick={() => setTrigger(!trigger)}
                 onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
                <span/>
            </div>
            <div className="mk-range-picker-range">
                <MediumSlider disabled={isDisabled} size="small" defaultValue={0} aria-label="Small"
                              onChange={(e: any) => changeRangeHandler(e.target.value)}/>
            </div>
            <div className="mk-range-picker-box start">
                <span className="mk-range-picker-label">{t("date.start")}</span>
                <DatePicker defaultValue={startDate}
                            onChange={(e: any) => dateHandler("SD", new Date(e.value).toLocaleDateString())}/>
                <TimePicker defaultValue={startTime} onChange={(e: any) => dateHandler("ST", `${e.hour}:${e.minute}`)}/>
                <img src={Calendar} alt="calendar"/>
            </div>
            <div className="mk-range-picker-box end">
                <span className="mk-range-picker-label">{t("date.end")}</span>
                <DatePicker defaultValue={endDate}
                            onChange={(e: any) => dateHandler("ED", new Date(e.value).toLocaleDateString())}/>
                <TimePicker defaultValue={endTime} onChange={(e: any) => dateHandler("ET", `${e.hour}:${e.minute}`)}/>
                <img src={Calendar} alt="calendar"/>
            </div>
            <ButtonField className={[startDate, startTime, endDate, endTime].some(item => !item) ? "disabled" : ""}
                         label={t("history.check")} color={"main"} pressHandler={pressHandler}/>
        </div>
    )
}