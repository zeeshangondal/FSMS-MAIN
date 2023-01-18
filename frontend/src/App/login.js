import React from 'react';
import Container from "@mui/material/Container";
import LogIn from "../pages/Users/LogIn";
import {CssBaseline} from "@mui/material";
function Login(props) {
    return (
        <>
            <div>
                <Container>
                    <LogIn />
                </Container>
            </div>
            <CssBaseline />
        </>
    );
}

export default Login;