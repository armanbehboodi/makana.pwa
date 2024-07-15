import {useState, forwardRef, ForwardedRef} from "react";
import {FilledInput, FormControl, InputLabel} from "@mui/material";
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {CacheProvider} from "@emotion/react";
import createCache from '@emotion/cache';
import rtlPlugin from 'stylis-plugin-rtl';
import {prefixer} from 'stylis';
import { v4 as uuidv4 } from 'uuid';

interface IProps {
    label: string,
    type: string,
    error: boolean
}

const cacheRtl = createCache({
    key: 'muirtl',
    stylisPlugins: [prefixer, rtlPlugin],
});

export const TextField = forwardRef<HTMLInputElement, IProps>((props: IProps, ref: ForwardedRef<any>) => {
    const [showPassword, setShowPassword] = useState(false),
        {label, type, error} = props,
        uniqueId = uuidv4();

    return (
        <CacheProvider value={cacheRtl}>
            <FormControl sx={{width: '100%'}} variant="filled">
                <InputLabel htmlFor={uniqueId}>{label}</InputLabel>
                <FilledInput
                    id={uniqueId} inputRef={ref} error={error}
                    type={type === "password" ? showPassword ? 'text' : 'password' : type}
                    endAdornment={type === "password" ?
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <VisibilityOff/> : <Visibility/>}
                            </IconButton>
                        </InputAdornment>
                        : null
                    }
                />
            </FormControl>
        </CacheProvider>
    )
});
