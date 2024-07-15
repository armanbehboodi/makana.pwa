import {useState} from "react";
import {Checkbox, FormControlLabel} from "@mui/material";

interface IProps {
    label: string,
    changeHandler: (isChecked: boolean) => void
}

export const CheckField = (props: IProps) => {
    const [checked, setChecked] = useState(false),
        {label, changeHandler} = props;

    const handleChange = () => {
        changeHandler(!checked);
        setChecked(!checked);
    }

    return (
        <FormControlLabel
            control={<Checkbox checked={checked} onChange={handleChange} name="antoine"/>}
            label={label}/>
    )
};