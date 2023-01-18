import React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import MoreTimeIcon from '@mui/icons-material/MoreTime';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import AddTask from '@mui/icons-material/AddTask'
import AddIcon from '@mui/icons-material/Add'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import MiniDrawer from "./Drawer";
import LoginIcon from '@mui/icons-material/Login';
import FollowTheSignsIcon from '@mui/icons-material/FollowTheSigns';

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const list = [
    {
        text:'Items',
        icon:<AddIcon/>,
        route:'/items',
    },
    {
        text:'Requisitions',
        icon:<AddTask/>,
        route:'/requisition',
    },
    {
        text:'LogIn',
        icon:<LoginIcon/>,
        route:'/login',
    },
    {
        text:'StoreKeeperLogIn',
        icon:<LoginIcon/>,
        route:'/storeKeeperLogin',
    },
    {
        text:'Register',
        icon:<FollowTheSignsIcon/>,
        route:'/register',
    },


]

export default function AppBarWithDrawer() {
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <>
            <AppBar position="fixed" open={open} data-testid="appBar">
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{
                            marginRight: 5,
                            ...(open && { display: 'none' }),
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        Inventory System
                    </Typography>
                </Toolbar>
            </AppBar>
            <MiniDrawer open={open} setOpen={setOpen} handleDrawerOpen={handleDrawerOpen} handleDrawerClose={handleDrawerClose} list={list}/>
        </>
    );
}