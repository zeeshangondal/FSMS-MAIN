import './App.css';
import Items from "../pages/Items/Items";
import Requisitions from '../pages/Requisitions/Requisitions';

import {
    createBrowserRouter,
    RouterProvider,
    Route, Outlet,
} from "react-router-dom";

import {Box, createTheme, CssBaseline} from "@mui/material";
import AppBarWithDrawer from "../components/AppBar";
import {styled,ThemeProvider} from "@mui/material/styles";
import Register from '../pages/Users/Register';
import LogIn from '../pages/Users/LogIn';

import StoreKeeperLogin from '../pages/Users/StoreKeeperLogIn';
import AddRequisitionForm from "../pages/Requisitions/AddRequisitionForm";
import StoreKeeperRequisitionForm from "../pages/Requisitions/StoreKeeper/StoreKeeperRequisitionForm";

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));


const theme = createTheme({
    palette: {
        primary: {
            main: "#333996",
            light: '#3c44b126'
        },
        secondary: {
            main: "#f83245",
            light: '#f8324526'
        },
        default: "#f4f5fd",
        success: {
            main: "#006400",
            light: '#9FE2BF'
        }
    },
})

const router = createBrowserRouter([
    {
        path: "/",
        element:
            <ThemeProvider theme={theme}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBarWithDrawer />
                <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                    <DrawerHeader />
                    <Outlet/>
                </Box>
            </Box>
            </ThemeProvider>,
        children:[
            {
                path:'/register',
                element:
                <Register/>
            },
            {
                path:'/login',
                element:
                <LogIn/>
            },
            {
                path:'/storeKeeperLogin',
                element:
                <StoreKeeperLogin/>
            },
            {
                path:'/items',
                element:
                <Items/>
            },
            {
                path: "/requisition",
                element:
                <Requisitions/>
            },
            {
                path: "/requisition/view",
                element:
                    <AddRequisitionForm/>
            },
            {
                path: "/requisition/handle",
                element:
                    <StoreKeeperRequisitionForm/>
            }
        ]
    },

]);

function App() {

  return (
      <RouterProvider router={router}/>
  );
}

export default App;
