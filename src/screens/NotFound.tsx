import React from "react";
import Lottie from 'react-lottie';
import animation from "../assets/animations/cat.json";

export const NotFound: React.FC = () => {

    const options = {
        loop: true,
        autoplay: true,
        animationData: animation,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };

    return (
        <div className="mk-main-root">
            <div className="mk-not-found">
                <Lottie options={options} height={300} width={300}/>
            </div>
        </div>
    )
}