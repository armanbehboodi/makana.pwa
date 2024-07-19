import React from "react";
import {useTranslation} from 'react-i18next';
import {shallowEqual, useSelector, useDispatch} from "react-redux";
import {pageSliceActions, RootState} from "../../store/store";
import Map from "../../assets/images/icons/map.svg";
import History from "../../assets/images/icons/history.svg";
import Health from "../../assets/images/icons/health.svg";
import Paw from "../../assets/images/icons/paw.svg";
import Profile from "../../assets/images/icons/profile.svg";

interface INavigationList {
    label: string,
    icon: any,
    target: string
}

export const NavigationBar: React.FC = () => {

    const {t} = useTranslation(),
        dispatch = useDispatch(),
        {currentContent} = useSelector((state: RootState) => ({
            currentContent: state.page.content
        }), shallowEqual),
        navigationList: INavigationList[] = [
        {
            label: t("navigation.map"),
            icon: Map,
            target: "map"
        },
        {
            label: t("navigation.history"),
            icon: History,
            target: "history"
        },
        {
            label: t("navigation.health"),
            icon: Health,
            target: "health"
        },
        {
            label: t("navigation.information"),
            icon: Paw,
            target: "information"
        },
        {
            label: t("navigation.profile"),
            icon: Profile,
            target: "profile"
        }
    ];

    return (
        <div className="mk-navigation-root">
            {navigationList.map((item: INavigationList, index: number) => {
                return (
                    <div className={`mk-navigation-item ${item.target === currentContent ? "active" : ""}`} key={index}
                    onClick={() => dispatch(pageSliceActions.setContent(item.target))}>
                        <img src={item.icon} alt="nav"/>
                        <p>{item.label}</p>
                    </div>
                )
            })}
        </div>
    )
}