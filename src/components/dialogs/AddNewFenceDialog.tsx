import React, {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {MapContainer, TileLayer, useMap} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-draw';
import {Button, AppBar, Dialog, Toolbar, IconButton, Slide} from '@mui/material/index';
import CloseIcon from '@mui/icons-material/Close';
import {TransitionProps} from '@mui/material/transitions';

interface IProps {
    isOpen: boolean,
    closeHandler: () => void
}

const LEAFLET:any = L;

export const AddNewFenceDialog: React.FC<IProps> = ({isOpen, closeHandler}) => {

    const {t} = useTranslation();

    const LeafletDrawComponent = () => {
        const map = useMap();

        useEffect(() => {
            const drawnItems = new LEAFLET.FeatureGroup();
            map.addLayer(drawnItems);

            const drawControl = new LEAFLET.Control['Draw']({
                edit: {
                    featureGroup: drawnItems,
                },
                draw: {
                    polygon: true,
                    polyline: true,
                    circle: true,
                    rectangle: false,
                    marker: false,
                    circlemarker: false,
                },
            });

            map.addControl(drawControl);

            map.on(LEAFLET['Draw'].Event['CREATED'], function (event:any) {
                const {layerType, layer} = event;

                if (layerType === 'circle') {
                    const center = layer.getLatLng(),
                        radius = layer.getRadius();

                    console.log(center, radius);
                } else if (layerType === 'polygon' || layerType === 'polyline' || layerType === 'rectangle') {
                    const latlngs = layer.getLatLngs();
                    console.log('Shape latlngs:', latlngs);
                }

                drawnItems.addLayer(layer);
            });

        }, [map]);

        return null;
    }

    const Transition = React.forwardRef(function Transition(
        props: TransitionProps & {
            children: React.ReactElement;
        },
        ref: React.Ref<unknown>,
    ) {
        return <Slide direction="up" ref={ref} {...props} children={props.children}/>;
    });

    return (
        <Dialog fullScreen open={isOpen} onClose={closeHandler} TransitionComponent={Transition}>
            <AppBar sx={{position: 'relative'}}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="close" onClick={closeHandler}>
                        <CloseIcon/>
                    </IconButton>
                    <Button autoFocus color="inherit" onClick={closeHandler}>{t("general.save")}</Button>
                </Toolbar>
            </AppBar>
            <MapContainer center={[35.69980665825626, 51.33805755767131]} zoom={15}
                          style={{height: '100vh', width: '100%'}}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                <LeafletDrawComponent/>
            </MapContainer>
        </Dialog>
    );
}