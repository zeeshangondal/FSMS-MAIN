import React from 'react'
import Button from '@mui/material/Button';
import {styled } from "@mui/material/styles";

const ActionButtonStyled = styled(Button)(({theme,color})=>({
    minWidth: 0,
    margin: theme.spacing(0.5),
    backgroundColor:
        (color==='secondary') ? theme.palette.secondary.light:
            (color==='success') ? theme.palette.success.light :
                theme.palette.primary.light,
}))

export default function ActionButton(props) {

    const { color, children, onClick ,...other} = props;

    return (
        <ActionButtonStyled
            color={color}
            onClick={onClick}
            {...other}
            >
            {children}
        </ActionButtonStyled>
    )
}
