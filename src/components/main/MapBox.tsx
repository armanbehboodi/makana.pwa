import React, {useState, useEffect} from "react";
import {useTranslation} from 'react-i18next';
import {MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap, CircleMarker} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {LocationButton, TrackLocation} from "../components";
import {getJalaliData} from "../../helper/helper";
import Pin from "../../assets/images/icons/pin.svg";

interface IProps {
    lat?: string,
    lng?: string,
    device?: any,
    polyline?: boolean,
    fullData?: any,
    range?: number | null
}

export const MapBox: React.FC<IProps> = ({lat, lng, device, polyline, fullData, range}) => {

    const {t} = useTranslation(),
        [shouldFocus, setShouldFocus] = useState(true),
        customIcon = new L.Icon({
            iconUrl: Pin, iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
        }), Lat = Number(lat), Lng = Number(lng),
        history: any[] = [];

    if (fullData && fullData.length > 0) {
        fullData.map((item: any) => {
            history.push([Number(item.latitude), Number(item.longitude)])
        })
    }

    const rangeIndex = range ? Math.min(Math.floor((range / 100) * history.length), history.length - 1) : 0,
        historyLat = history && history.length ? history[rangeIndex][0] : null,
        historyLng = history && history.length ? history[rangeIndex][1] : null,
        hasCoordinate = lat && lng;

    // disabling focus on device location when user tries to check the map (dragging)
    const MapEventHandler: React.FC<{ onDragStart: () => void }> = ({ onDragStart }) => {
        useMapEvents({
            dragstart: () => onDragStart()
        });
        return null; // Return null to indicate no DOM elements are rendered
    };

    // fixing the map into the polyline bounds
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

    // zoom on marker when there is a valid coordinate
    const SetZoomToMarker = () => {
        const map = useMap();

        useEffect(() => {
            if (map) {
                if (lat) map.setView([Lat, Lng], 18);
                else map.setZoom(5);
            }
        }, [Lat, Lng]);

        return null;
    };

    return (
        <MapContainer center={[33.142144, 53.281073]} zoom={18} style={{height: "100vh", width: "100%"}}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
            {!polyline && hasCoordinate ?
                <Marker position={[Lat, Lng]} icon={customIcon}>
                    <Popup>{device ? `${device.name} ${t('map.popup')}` : t('map.popupDefault')}</Popup>
                </Marker>
                :
                polyline && history.length &&
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
                !polyline && hasCoordinate ?
                    <>
                        <LocationButton lat={lat} lng={lng}/>
                        <TrackLocation lat={lat} lng={lng} shouldFocus={shouldFocus}/>
                        <MapEventHandler onDragStart={() => setShouldFocus(false)}/>
                    </>
                    : null
            }
            {!polyline && <SetZoomToMarker/>}
        </MapContainer>
    );
};