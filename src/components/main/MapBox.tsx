import React from "react";
import {useTranslation} from 'react-i18next';
import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Pin from "../../assets/images/icons/pin.svg"

interface IProps {
    lat: string,
    lng: string,
    device?: any
}

const MAPCONTAINER: any = MapContainer,
    MARKER: any = Marker;

export const MapBox: React.FC<IProps> = ({lat, lng, device}) => {

    const {t} = useTranslation(),
        customIcon = new L.Icon({
            iconUrl: Pin,
            iconSize: [25, 41], // size of the icon
            iconAnchor: [12, 41], // point of the icon which will correspond to marker's location
            popupAnchor: [1, -34], // point from which the popup should open relative to the iconAnchor
            shadowSize: [41, 41] // size of the shadow
        });

    return (
        <MAPCONTAINER center={[lat, lng]} zoom={15} style={{height: "100vh", width: "100%"}}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
            <MARKER position={[lat, lng]} icon={customIcon}>
                <Popup>{device ? `${device.name} ${t('map.popup')}` : t('map.popupDefault')}</Popup>
            </MARKER>
        </MAPCONTAINER>
    );
}