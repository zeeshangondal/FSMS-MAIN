import React from 'react';
import Container from "@mui/material/Container";
import Requisitions from "../pages/Requisitions/Requisitions";
import {CssBaseline} from "@mui/material";

function Requisition(props) {
    return (
        <>
            <div style={{paddingLeft: '1px',
                width: '100%'}}>
                <>
                    <Requisitions />
                </>
            </div>
            <CssBaseline />
        </>
    );
}

export default Requisition;