import React, {useEffect, useState} from "react";
import Snackbar from "@mui/material/Snackbar";
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

interface IProps {
    isOpen: boolean,
    type: string,
    message: string,
    closeHandler: () => void,
    position?: any,
    duration?: number
}

export const SnackField: React.FC<IProps> = ({isOpen, type, message, closeHandler, duration, position}) => {

    const [open, setOpen] = useState(isOpen);

    useEffect(() => {
        setOpen(isOpen);
    }, [isOpen]);

    const handleClose = () => {
        closeHandler();
        setOpen(false);
    };

    const action = (
        <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleClose}>
            <CloseIcon fontSize="medium" fontWeight="bold"/>
        </IconButton>
    );

    return (
        <Snackbar
            open={open} anchorOrigin={position || {vertical: "top", horizontal: "right"}} action={action}
            autoHideDuration={duration || 3000} data-type={type} onClose={handleClose} message={message}/>
    )
}