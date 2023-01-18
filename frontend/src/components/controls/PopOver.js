import * as React from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ActionButton from "./ActionButton";
import FilterListIcon from '@mui/icons-material/FilterList';
export default function BasicPopover(props) {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return (
        <div>
            {/*<Button aria-describedby={id} variant="contained" onClick={handleClick}>*/}
            {/*    Open Popover*/}
            {/*</Button>*/}
            <ActionButton
                onClick={handleClick}>
                <FilterListIcon fontSize="medium"/>
            </ActionButton>
            <Popover
                sx={{marginTop:2}}
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <div style={{padding:10}}>
                  {props.children}
                </div>
                {/*<Typography sx={{ p: 2 }}>The content of the Popover.</Typography>*/}
            </Popover>
        </div>
    );
}