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

import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";

import {useSelector} from "react-redux";
import {updateFilters, getStatuces} from "../../../../store/orders";
import {useAppDispatch} from '../../../../store/createStore';
import {TextField} from "@mui/material";

import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';


export function OrdersFilter({openFilterState, closeFilter, filtration}) {

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

        closeFilter();
        //setState({ ...state, [anchor]: open });
    };

    const [statusValue, setStatusValue] = React.useState('');
    const [deliveryValue, setValueDelivery] = React.useState('');
    const [priceFromValue, setValuePriceFrom] = React.useState(0);
    const [priceToValuePriceTo, setValuePriceTo] = React.useState(0);
    const [dateFromValue, setDateFromValue] = React.useState(0);
    const [dateToValue, setDateToValue] = React.useState(0);
    const [timer, setTimer] = React.useState(null);

    const radioGroupRef = React.useRef(null);
    const options = useSelector(getStatuces());


    const statusHandleChange = (event) =>{
        setStatusValue(event.target.value);
        dispatch(updateFilters({status: event.target.value}))
    }
    const deliveryHandleChange = (event) =>{
        setValueDelivery(event.target.value);
        dispatch(updateFilters({delivery_code: event.target.value}))
    }

    const priceFromHandleChange = (event) =>{
       // dispatch(updateFilters({price_from: event.target.value}))
        if (timer) {
            clearTimeout(timer);
            setTimer(null);
        }
        setTimer(
            setTimeout(() => {
                dispatch(updateFilters({price_from: event.target.value}))
            }, 2000)
        );
       //setValueDelivery(event.target.value);

    }
    const priceToHandleChange = (event) =>{
        // dispatch(updateFilters({price_to: event.target.value}))
        // setValueDelivery(event.target.value);
        if (timer) {
            clearTimeout(timer);
            setTimer(null);
        }
        setTimer(
            setTimeout(() => {
                dispatch(updateFilters({price_to: event.target.value}))
            }, 2000)
        );

    }
    const dateFromHandleChange = (event) => {
        dispatch(updateFilters({date_from: event.target.value}))
    }
    const dateToHandleChange = (event) => {
        dispatch(updateFilters({date_to: event.target.value}))
    }
    const list = (anchor) => (
        <Box
            sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
            role="presentation"
            //onClick={toggleDrawer(anchor, false)}
            //onKeyDown={toggleDrawer(anchor, false)}
        >
            <List>
                <ListItem key={'1'}>
                    <Accordion
                        // sx={{ '& .MuiPaper-root': { box-shadow: 'none' } }}
                        className={'filter-order-status'}
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header2"
                        >
                            <Typography>Статус заказа</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <RadioGroup
                                ref={radioGroupRef}
                                aria-label="ringtone"
                                name="ringtone"
                                value={statusValue}
                                onChange={statusHandleChange}
                            >
                                <FormControlLabel
                                    value={''}
                                    key={''}
                                    control={<Radio />}
                                    label={'Все'}
                                />
                                {options.map((option) => (
                                    <FormControlLabel
                                        value={option.code}
                                        key={option.code}
                                        control={<Radio />}
                                        label={option.name}
                                    />
                                ))}
                            </RadioGroup>
                        </AccordionDetails>
                    </Accordion>
                </ListItem>
                <ListItem button key={'2'}>
                    <Accordion
                        // sx={{ '& .MuiPaper-root': { box-shadow: 'none' } }}
                        className={'filter-order-delivery'}
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header2"
                        >
                            <Typography>Тип доставки</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <RadioGroup
                                ref={radioGroupRef}
                                aria-label="ringtone"
                                name="ringtone"
                                value={deliveryValue}
                                onChange={deliveryHandleChange}
                            >
                                <FormControlLabel
                                    value={''}
                                    key={''}
                                    control={<Radio />}
                                    label={'Все'}
                                />
                                <FormControlLabel
                                    value={'flat_rate'}
                                    key={'flat_rate'}
                                    control={<Radio />}
                                    label={'Доставка'}
                                />
                                <FormControlLabel
                                    value={'local_pickup'}
                                    key={'local_pickup'}
                                    control={<Radio />}
                                    label={'Самовывоз'}
                                />
                                <FormControlLabel
                                    value={'wcso_booking'}
                                    key={'wcso_booking'}
                                    control={<Radio />}
                                    label={'В зале'}
                                />
                            </RadioGroup>
                        </AccordionDetails>
                    </Accordion>
                </ListItem>
                <ListItem button key={'3'}></ListItem>
                {/*{['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (*/}
                {/*    <ListItem button key={text}>*/}
                {/*        <ListItemIcon>*/}
                {/*            {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}*/}
                {/*        </ListItemIcon>*/}
                {/*        <ListItemText primary={text} />*/}
                {/*    </ListItem>*/}
                {/*))}*/}
            </List>
            {/*<Divider />*/}
            {/*<List>*/}
            {/*    <ListItem button key={'Дата от'}>*/}
            {/*        <TextField type="number" id="price_from" label="Дата от" variant="standard" onChange={dateFromHandleChange} />*/}
            {/*    </ListItem>*/}
            {/*    <ListItem button key={'Дата до'}>*/}
            {/*        <TextField type="number" id="price_to" label="Дата до" variant="standard" onChange={dateToHandleChange} />*/}
            {/*    </ListItem>*/}
            {/*</List>*/}

            <Divider />
            <List>
                <ListItem button key={'Цена от'}>
                    <TextField type="number" id="price_from" label="Цена от" variant="standard" inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} onChange={priceFromHandleChange} />
                </ListItem>
                <ListItem button key={'Цена до'}>
                    <TextField type="number" id="price_to" label="Цена до" variant="standard" inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} onChange={priceToHandleChange} />
                </ListItem>

            </List>

            <Divider />

            <List>
                <ListItem button key={'Дата от'}>
                        <TextField type="date" id="date_from" label="Дата от" variant="standard" onChange={dateFromHandleChange} />
                </ListItem>
                <ListItem button key={'Дата до'}>
                    <TextField type="date" id="date_to" label="Дата до" variant="standard" onChange={dateToHandleChange} />
                </ListItem>

            </List>
            {/*<List>*/}
            {/*    {['All mail', 'Trash', 'Spam'].map((text, index) => (*/}
            {/*        <ListItem button key={text}>*/}
            {/*            <ListItemIcon>*/}
            {/*                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}*/}
            {/*            </ListItemIcon>*/}
            {/*            <ListItemText primary={text} />*/}
            {/*        </ListItem>*/}
            {/*    ))}*/}
            {/*</List>*/}
        </Box>
    );
    const anchor = 'right';
    return (
        <div>
            <Drawer
                anchor={anchor}
                // open={state[anchor]}
                open={openFilterState}
                onClose={toggleDrawer(anchor, false)}
            >
                {list(anchor)}
            </Drawer>
            {/*{['left', 'right', 'top', 'bottom'].map((anchor) => (*/}
            {/*    <React.Fragment key={anchor}>*/}
            {/*        <Button onClick={toggleDrawer(anchor, true)}>{anchor}</Button>*/}
            {/*        <Drawer*/}
            {/*            anchor={anchor}*/}
            {/*            open={state[anchor]}*/}
            {/*            onClose={toggleDrawer(anchor, false)}*/}
            {/*        >*/}
            {/*            {list(anchor)}*/}
            {/*        </Drawer>*/}
            {/*    </React.Fragment>*/}
            {/*))}*/}
        </div>
    );
}