import React from 'react';
 import {default as MuiButton} from '@mui/material/Button';
import {styled} from "@mui/material/styles";


 const ButtonStyled = styled(MuiButton)(({theme,color})=>({
     margin: theme.spacing(0.5),
     // color:
     //     (color==='secondary') ? theme.palette.secondary.main:
     //         (color==='success') ? theme.palette.success.main :
     //             (color==='default') ? theme.palette.background.default :
     //             theme.palette.primary.main,
     // backgroundColor:
     //     (color==='secondary') ? theme.palette.secondary.light:
     //         (color==='success') ? theme.palette.success.light :
     //             (color==='default') ? theme.palette.background.default :
     //             theme.palette.primary.light,
 }))

export default function Button(props) {

    const { text, size, color, variant, onClick, ...other } = props

    return (
    <ButtonStyled
    variant={variant || "contained"}
    size={size || "large"}
    color={color}
    onClick={onClick}
    {...other}
>
    {text}
</ButtonStyled>
    );
}
