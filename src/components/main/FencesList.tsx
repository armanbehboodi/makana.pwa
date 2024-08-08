import React, {useState} from "react";
import {useTranslation} from 'react-i18next';
import IconButton from '@mui/material/IconButton';
import {SwitchField} from "../ui/SwitchField";
import DeleteIcon from '@mui/icons-material/Delete';
import ShowIcon from '@mui/icons-material/Visibility';
import FenceIcon from "../../assets/images/icons/fence.svg";
import {ButtonField} from "../components";
import {AddNewFenceDialog} from "../dialogs/AddNewFenceDialog";

interface IProps {
    fences: any[]
}

export const FencesList: React.FC<IProps> = React.memo(({fences}) => {

    const {t} = useTranslation(),
        [openDialog, setOpenDialog] = useState(false);

    return (
        <div className="mk-fences-box">
            {fences.length < 1 ?
                (
                    <div className="mk-fences-no-result">
                        <img src={FenceIcon} alt="fence"/>
                        <p>{t("fences.noResult")}</p>
                    </div>
                )
                :
                (
                    fences.map((fence, index) => {
                        return (
                            <div className="mk-fence" key={index}>
                                <p className="mk-fence-name">{fence.name}</p>
                                <img src={FenceIcon} alt="fence" className="mk-fence-icon"/>
                                <SwitchField isChecked={false} handleChange={(value: boolean) => console.log(value)}/>
                                <div className="mk-fence-options">
                                    <IconButton aria-label="eye">
                                        <ShowIcon/>
                                    </IconButton>
                                    <IconButton aria-label="delete">
                                        <DeleteIcon/>
                                    </IconButton>
                                </div>
                            </div>
                        )
                    })
                )
            }
            <ButtonField label={t("fences.add")} color={'main'} pressHandler={() => setOpenDialog(true)}
                         className="add-fence-button"/>
            {openDialog &&
                <AddNewFenceDialog isOpen={openDialog} closeHandler={() => setOpenDialog(false)}/>
            }
        </div>
    )
})