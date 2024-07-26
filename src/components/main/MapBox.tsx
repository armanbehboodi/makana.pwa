import React, {useState} from "react";
import {useTranslation} from 'react-i18next';
import {MapContainer, TileLayer, Marker, Popup, useMapEvents} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {LocationButton, TrackLocation} from "../helper/LiveLocation";
import Pin from "../../assets/images/icons/pin.svg";

interface IProps {
    lat: string,
    lng: string,
    device?: any | number
}

// disabling focus on device location when user tries to check the map (dragging)
const MapEventHandler:any = ({onDragStart}: any) => {
    useMapEvents({
        dragstart: () => onDragStart()
    });
};

export const MapBox: React.FC<IProps> = ({lat, lng, device}) => {

    const {t} = useTranslation(),
        [shouldFocus, setShouldFocus] = useState(true),
        customIcon = new L.Icon({
            iconUrl: Pin,
            iconSize: [25, 41], // size of the icon
            iconAnchor: [12, 41], // point of the icon which will correspond to marker's location
            popupAnchor: [1, -34], // point from which the popup should open relative to the iconAnchor
            shadowSize: [41, 41] // size of the shadow
        }), Lat = Number(lat), Lng = Number(lng);

    return (
        <MapContainer center={[Lat, Lng]} zoom={18} style={{height: "100vh", width: "100%"}}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
            <Marker position={[Lat, Lng]} icon={customIcon}>
                <Popup>{device ? `${device.name} ${t('map.popup')}` : t('map.popupDefault')}</Popup>
            </Marker>
            <LocationButton lat={lat} lng={lng}/>
            <TrackLocation lat={lat} lng={lng} shouldFocus={shouldFocus}/>
            <MapEventHandler onDragStart={() => setShouldFocus(false)}/>
        </MapContainer>
    );
}