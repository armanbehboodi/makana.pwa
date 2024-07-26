import React, {useEffect} from "react";
import {useMap} from 'react-leaflet';
import Location from "../../assets/images/icons/location.svg";

interface IProps {
    lat: string,
    lng: string,
    shouldFocus?: boolean
}

const LocationButton: React.FC<IProps> = ({lat, lng}) => {

    const map = useMap(),
        focusLocation = () => {
            map.setView([Number(lat), Number(lng)], map.getZoom(), {
                animate: true,
                duration: 0.5
            });
        };

    return (
        <button className="mk-map-current-location" onClick={focusLocation}>
            <img src={Location} alt="location"/>
        </button>
    );
};

const TrackLocation: React.FC<IProps> = ({ lat, lng, shouldFocus }) => {
    const map = useMap();

    useEffect(() => {
        if (shouldFocus) {
            map.setView([Number(lat), Number(lng)], map.getZoom(), {
                animate: true,
                duration: 0.5
            });
        }
    }, [lat, lng, shouldFocus, map]);

    return null;
};

export {LocationButton, TrackLocation};