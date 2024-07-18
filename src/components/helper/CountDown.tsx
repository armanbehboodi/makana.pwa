import React, {useEffect, useRef} from 'react';

interface IProps {
    seconds: number,
    finish: () => void
}

export const CountDown:React.FC<IProps> = ({seconds, finish}) => {
    const countdownRef = useRef<any>(null),
        intervalRef = useRef<any>(null),
        secondsRef = useRef(seconds);

    useEffect(() => {
        const updateCountdown = () => {
            if (countdownRef.current) {
                countdownRef.current.textContent = secondsRef.current.toString();
            }
            if (secondsRef.current > 0) {
                secondsRef.current -= 1;
            } else if (intervalRef.current) {
                clearInterval(intervalRef.current);
                finish();
            }
        };

        intervalRef.current = setInterval(updateCountdown, 1000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    return (
        <span ref={countdownRef} style={{marginRight: "10px"}}>{seconds}</span>
    );
}