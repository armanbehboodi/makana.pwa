import * as React from 'react';
import Progress from "../../assets/images/icons/progress.svg";

export const Loading:React.FC = () => {

    return (
        <div className="mk-loading">
            <img src={Progress} alt="progress"/>
        </div>
    )
}