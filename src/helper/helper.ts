import {getDistance, getSpeed, getTimeStamp, getJalaliData} from "./Calculator";
import {getCookie, setCookie, deleteCookie} from "./CookieHandler";
import {e2p, p2e, sp} from "./LngConvertor";
import {Validator} from "./Validator";
import {usePrevious} from "./hooks/UsePrevious";
import {useWarnOnClose} from "./hooks/UseWarnOnClose";

export {
    getDistance,
    getSpeed,
    getTimeStamp,
    getJalaliData,
    getCookie,
    setCookie,
    deleteCookie,
    e2p,
    p2e,
    sp,
    Validator,
    usePrevious,
    useWarnOnClose
};