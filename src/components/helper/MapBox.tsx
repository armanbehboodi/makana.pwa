import React from "react";
import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface IProps {
    lat: string,
    lng: string
}

const MAPCONTAINER:any = MapContainer;

export const MapBox: React.FC<IProps> = ({lat, lng}) => {
    return (
        <MAPCONTAINER center={[lat, lng]} zoom={15} style={{height: "100vh", width: "100%"}}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
            <Marker position={[lat, lng]}>
                <Popup>User is here</Popup>
            </Marker>
        </MAPCONTAINER>
    );
}