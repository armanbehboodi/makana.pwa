import {useEffect} from 'react';

export const useWarnOnClose = (onLeave:any) => {
    useEffect(() => {
        const handleBeforeUnload = (event:any) => {
            event.preventDefault();
            event.returnValue = ''; // Chrome requires returnValue to be set
        };

        const handleUnload = () => {
            onLeave();
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        window.addEventListener('unload', handleUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            window.removeEventListener('unload', handleUnload);
        };
    }, [onLeave]);
};