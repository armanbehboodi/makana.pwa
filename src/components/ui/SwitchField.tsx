import React, {useState} from "react";
import {useTranslation} from 'react-i18next';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import LightOff from "../../assets/images/icons/light.svg";
import LightOn from "../../assets/images/icons/ligh-on.svg";
import SoundOn from "../../assets/images/icons/sound-on.svg";
import SoundOff from "../../assets/images/icons/sound-off.svg";

interface IProps {
    isChecked: boolean,
    handleChange: (value: boolean) => void,
    title?: string,
    icon?: string,
    label?: string,
    disabled?: boolean
}

export const SwitchField: React.FC<IProps> = ({isChecked, handleChange, icon, label, title,disabled}) => {

    const {t} = useTranslation(),
        [checked, setChecked] = useState(isChecked);

    const changeHandler = (e:any) => {
        const checked = e.target.checked;

        handleChange(checked);
        setChecked(checked);
    };

    let onLabel, offLabel, onIcon, offIcon;

    switch (label) {
        case "on":
            onLabel = t("general.on");
            offLabel = t("general.off");
            break;
        default:
            onLabel = t("general.enable");
            offLabel = t("general.disable");
            break;
    }

    switch (icon) {
        case "light":
            onIcon = LightOn;
            offIcon = LightOff;
            break;
        case "sound":
            onIcon = SoundOn;
            offIcon = SoundOff;
            break;
    }

    if (label) {
        return (
            <div className="mk-switch-box">
                {title ? <p className="mk-switch-title">{title}</p> : null}
                <FormControlLabel
                    control={
                        <Switch checked={checked} onChange={changeHandler} disabled={disabled}/>
                    }
                    label={checked ? onLabel : offLabel}
                />
                {icon ?
                    checked ? <img src={onIcon} alt="on"/> : <img src={offIcon} alt="off"/>
                    :
                    null
                }
            </div>
        )
    }

    return (
        <div className="mk-switch-box">
            {title ? <p className="mk-switch-title">{title}</p> : null}
            <Switch checked={checked} onChange={changeHandler} disabled={disabled}/>
            {icon ?
                checked ? <img src={onIcon} alt="on"/> : <img src={offIcon} alt="off"/>
                :
                null
            }
        </div>
    )
}