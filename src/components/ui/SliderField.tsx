import React from 'react';
import Slider from '@mui/material/Slider';

const SmallSlider:React.FC = (props:any) => (
    <Slider
        {...props}
        sx={{
            height: 4,
            '& .MuiSlider-thumb': {
                width: 14,
                height: 14,
            },
            '& .MuiSlider-track': {
                height: 4,
            },
            '& .MuiSlider-rail': {
                height: 4,
            },
        }}
    />
);

const MediumSlider = (props:any) => (
    <Slider
        {...props}
        sx={{
            height: 6,
            '& .MuiSlider-thumb': {
                width: 18,
                height: 18,
            },
            '& .MuiSlider-track': {
                height: 6,
            },
            '& .MuiSlider-rail': {
                height: 6,
            },
        }}
    />
);

const LargeSlider = (props:any) => (
    <Slider
        {...props}
        sx={{
            height: 8,
            '& .MuiSlider-thumb': {
                width: 22,
                height: 22,
            },
            '& .MuiSlider-track': {
                height: 8,
            },
            '& .MuiSlider-rail': {
                height: 8,
            },
        }}
    />
);

export {SmallSlider, MediumSlider, LargeSlider};