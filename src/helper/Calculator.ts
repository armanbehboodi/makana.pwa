import {toJalaali} from 'jalaali-js';

interface IGetDistanceProps {
    lat1: number,
    lat2: number,
    lon1: number,
    lon2: number,
}

const getDistance = ({lat1, lon1, lat2, lon2}: IGetDistanceProps): number => {
    const R = 6371, // Radius of the Earth in kilometers
        dLat = (lat2 - lat1) * Math.PI / 180,
        dLon = (lon2 - lon1) * Math.PI / 180,
        a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2),
        c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c * 1000; // Return distance in meters
};

const getSpeed = (data: any[]): string => {
    if (data.length < 2) {
        return "0";
    }

    // Calculate distance
    const distance = getDistance({
        lat1: data[0].latitude,
        lon1: data[0].longitude,
        lat2: data[data.length - 1].latitude,
        lon2: data[data.length - 1].longitude
    });

    // Calculate speed (distance / time)
    const speed = distance / 60;

    return speed.toFixed(1); // Return speed formatted to 1 decimal place
};

const getTimeStamp = (dateStr: string, timeStr: string | number) => {
    const date = dateStr.split("/").reverse().map(item => item.toString().padStart(2, '0')),
        time = typeof timeStr === "number" ? [`${new Date(timeStr).getHours()}`, `${new Date(timeStr).getHours()}`] : timeStr.split(":").map(item => item.toString().padStart(2, '0'));

    time.push("00");

    return `${date[0]}${date[2]}${date[1]}${time.join("")}`;
};

const getJalaliData = (gregorianDateStr: string) => {

    // Extract year, month, day, hour, minute, second
    const year = parseInt(gregorianDateStr.slice(0, 4), 10),
        month = parseInt(gregorianDateStr.slice(4, 6), 10),
        day = parseInt(gregorianDateStr.slice(6, 8), 10),
        hour = gregorianDateStr.slice(8, 10),
        minute = gregorianDateStr.slice(10, 12),
        second = gregorianDateStr.slice(12, 14);

    // Convert to Jalali date
    const jalaaliDate = toJalaali(year, month, day);

    // Format the Jalali date
    return `${hour}:${minute}:${second} ${jalaaliDate.jy}/${String(jalaaliDate.jm).padStart(2, '0')}/${String(jalaaliDate.jd).padStart(2, '0')}`;
}

export {getDistance, getSpeed, getTimeStamp, getJalaliData};