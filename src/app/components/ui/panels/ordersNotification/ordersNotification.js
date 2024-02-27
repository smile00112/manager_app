import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import DeleteIcon from '@mui/icons-material/Delete';

import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";

import {useSelector} from "react-redux";
import {deleteNotification} from "../../../../store/orders";
import {useAppDispatch} from '../../../../store/createStore';
import {ListSubheader, TextField} from "@mui/material";

import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import IconButton from "@mui/material/IconButton";


export function OrdersNotification({openNotifState, closeNotification, notifications}) {

    const dispatch = useAppDispatch();
    const [state, setState] = React.useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });
    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        closeNotification();
        //setState({ ...state, [anchor]: open });
    };
    const handleDeleteNotification = (item_index) => (event) => {
       dispatch(deleteNotification(item_index));
        //return false; // отмена действия по умолчанию (переход по ссылке)
    }
    const [dense, setDense] = React.useState(false);
    const list = (anchor) => (
        <Box
            sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
            role="presentation"
            //onClick={toggleDrawer(anchor, false)}
            //onKeyDown={toggleDrawer(anchor, false)}
        >
            <ListSubheader>Уведомления</ListSubheader>
            <Divider />
            <List>
                {
                    notifications.map((item, index) =>
                    <ListItem
                        key={`notif_`+index}
                    >
                        <ListItemText
                            primary=""
                            secondary={item}
                        />
                        <IconButton edge="end" aria-label="delete"
                                    onClick={ handleDeleteNotification(index) } >
                            <DeleteIcon />
                        </IconButton>
                    </ListItem>,
                )}
            </List>

        </Box>
    );
    const anchor = 'right';
    return (
        <div>
            <Drawer
                anchor={anchor}
                // open={state[anchor]}
                open={openNotifState}
                onClose={toggleDrawer(anchor, false)}
            >
                {list(anchor)}
            </Drawer>
        </div>
    );
}