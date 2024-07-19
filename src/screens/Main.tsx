import React from "react";
import {NavigationBar} from "../components/main/NavigationBar";
import {shallowEqual, useSelector} from "react-redux";
import {RootState} from "../store/store";
import {Map} from "./Map";

export const Main:React.FC = () => {
    const {currentContent} = useSelector((state: RootState) => ({
        currentContent: state.page.content
    }), shallowEqual);

    console.log(currentContent)

    return (
        <div className="mk-main-root">
            {currentContent === "map" && <Map/>}
            <NavigationBar/>
        </div>
    )
}