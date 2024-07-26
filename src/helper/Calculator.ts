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

const getTimeStamp = (dateStr: string, timeStr: string) => {
    const [day, month, year] = dateStr.split('/').map(Number),
        [hours, minutes] = timeStr.split(':').map(Number),
        date = new Date(year, month - 1, day, hours, minutes);

    return date.getTime();
};

export {getDistance, getSpeed, getTimeStamp};