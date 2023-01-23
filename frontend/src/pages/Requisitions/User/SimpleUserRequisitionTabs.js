import React, { useEffect, useState } from 'react'
import { Paper, TableBody, TableRow, TableCell, Toolbar, InputAdornment, LinearProgress } from '@mui/material';
import * as requisitionService from "../../../service/requisitionService";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import SwipeableViews from "react-swipeable-views-react-18-fix";
import TabPanel from "../../../components/TabPanel";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import Requisitions from "./SimpleUserRequisitions";
import {
    getAllCompletedRequisitionsU,
    getAllUnCompletedRequisitionsU
} from "../../../service/requisitionService";
import * as employeeService from "../../../service/employeeService";


const styles = {
    pageContent: {
        margin: (theme) => theme.spacing(5),
        padding: (theme) => theme.spacing(3)
    }
}

export default function SimpleUserRequisitionTabs() {
    const classes = styles;
    const [records, setRecords] = React.useState([])
    const theme = useTheme();
    const [value, setValue] = React.useState(0);

    useEffect(() => {
        requisitionService.getAllRequisitionsOfLoggedInU(setRecords)
    }, [0])

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleChangeIndex = (index) => {
        setValue(index);
    };

    function a11yProps(index) {
        return {
            id: `full-width-tab-${index}`,
            'aria-controls': `full-width-tabpanel-${index}`,
        };
    }

    return (
        <>
            <Paper sx={classes.pageContent}>
                {<h2>Simple User</h2>}
                {<h4>{employeeService.getLoggedInUser().department } , {employeeService.getLoggedInUser().username}</h4>}

                <Box >
                    <AppBar position="static" elevation={0} sx={{ bgcolor: 'white', width: 500 }}>
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            indicatorColor="primary"
                            // textColor="inherit"
                            sx={{ fontWeight: 'bold' }}
                            variant="fullWidth"
                        // aria-label="full width tabs example"
                        >
                            <Tab label="Pending" bold {...a11yProps(0)} />
                            <Tab label="Completed" bold  {...a11yProps(1)} />
                        </Tabs>
                    </AppBar>
                    <SwipeableViews
                        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                        index={value}
                        onChangeIndex={handleChangeIndex}
                    >
                        <TabPanel value={value} index={0} dir={theme.direction}>
                            <Requisitions update={getAllUnCompletedRequisitionsU}></Requisitions>
                        </TabPanel>
                        <TabPanel value={value} index={1} dir={theme.direction}>
                            <Requisitions update={getAllCompletedRequisitionsU}></Requisitions>
                        </TabPanel>
                    </SwipeableViews>
                </Box>
            </Paper>
        </>
    )
}
