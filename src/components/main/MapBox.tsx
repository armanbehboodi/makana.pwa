import React, {useState, useEffect} from "react";
import {useTranslation} from 'react-i18next';
import {MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap, CircleMarker} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {LocationButton, TrackLocation} from "../helper/LiveLocation";
import Pin from "../../assets/images/icons/pin.svg";
import {getJalaliData} from "../../helper/Calculator";

interface IProps {
    lat: string,
    lng: string,
    device?: any | number,
    polyline?: boolean,
    fullData?: any,
    range?: number | null
}

// disabling focus on device location when user tries to check the map (dragging)
const MapEventHandler: any = ({onDragStart}: any) => {
    useMapEvents({
        dragstart: () => onDragStart()
    });
};

export const MapBox: React.FC<IProps> = ({lat, lng, device, polyline, fullData, range}) => {

    const {t} = useTranslation(),
        [shouldFocus, setShouldFocus] = useState(true),
        customIcon = new L.Icon({
            iconUrl: Pin,
            iconSize: [25, 41], // size of the icon
            iconAnchor: [12, 41], // point of the icon which will correspond to marker's location
            popupAnchor: [1, -34], // point from which the popup should open relative to the iconAnchor
            shadowSize: [41, 41] // size of the shadow
        }), Lat = Number(lat), Lng = Number(lng),
        history: any[] = [];

    if (fullData && fullData.length > 0) {
        fullData.map((item: any) => {
            history.push([Number(item.latitude), Number(item.longitude)])
        })
    }

    const FitBoundsToPolyline = () => {
        const map = useMap();

        useEffect(() => {
            if (map && history.length > 0) {
                const bounds = L.latLngBounds(history);
                map.fitBounds(bounds);
            }
        }, [map, history]);

        return null;
    };

    const rangeIndex = range ? Math.min(Math.floor((range / 100) * history.length), history.length - 1) : 0,
        historyLat = history && history.length ? history[rangeIndex][0] : '35.69980665825626',
        historyLng = history && history.length ? history[rangeIndex][1] : '51.33805755767131';

    return (
        <MapContainer center={[Lat, Lng]} zoom={18} style={{height: "100vh", width: "100%"}}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
            {!polyline ?
                <Marker position={[Lat, Lng]} icon={customIcon}>
                    <Popup>{device ? `${device.name} ${t('map.popup')}` : t('map.popupDefault')}</Popup>
                </Marker>
                :
                history.length &&
                <Marker position={[historyLat, historyLng]} icon={customIcon}>
                    <Popup>{getJalaliData(fullData[rangeIndex].timestamp)}</Popup>
                </Marker>
            }
            {polyline ?
                <>
                    {history.map((position, idx) => (
                        <CircleMarker key={idx} center={position} radius={5} color="#0a81d7"/>
                    ))}
                    <FitBoundsToPolyline/>
                </>
                :
                <>
                    <LocationButton lat={lat} lng={lng}/>
                    <TrackLocation lat={lat} lng={lng} shouldFocus={shouldFocus}/>
                    <MapEventHandler onDragStart={() => setShouldFocus(false)}/>
                </>
            }
        </MapContainer>
    );
}