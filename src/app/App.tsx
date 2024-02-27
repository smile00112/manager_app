import {CssBaseline, ThemeProvider} from '@mui/material';
import React from 'react';
import AppLoader from './components/ui/HOC/AppLoader';
import AppRouter from './router/AppRouter';
import './scss/app.scss';
import theme from './theme';
//import {ToastContainer} from 'react-toastify';
import addNotification, { Notifications } from 'react-push-notification';
// import Pusher from "pusher-js";

//import {getClientToken, onMessageListener} from '../app/services/firebase.service';
//import {useState} from 'react';


// declare global {
//     interface Window {
//         Pusher?:any;
//     }
// }

const App = () => {

    //const [show, setShow] = useState(false);
    //const [notification, setNotification] = useState({title: '', body: ''});
    // const [isTokenFound, setTokenFound] = useState(false);
    // getClientToken(setTokenFound);
    // // if(!isTokenFound){
    // //     addNotification({
    // //         title: 'Привет',
    // //         subtitle: '',
    // //         message: 'Пробуем включить пуши на iOS',
    // //         theme: 'darkblue',
    // //         native: true, // when using native, your OS will handle theming.
    // //         silent: false,
    // //         duration: 60000,
    // //         // onClick: (e: Event | Notification) => {
    // //         //     console.error('!!!', e)
    // //         // },
    // //     });
    // // }
    // //Слушатель сообщений
    //  onMessageListener().then(payload => {
    //     // setShow(true);
    //    //  setNotification({title: payload.notification.title, body: payload.notification.body})
    //      console.warn('onMessageListener', payload);
    //  }).catch(err => console.log('failed: ', err));



    return (
        <AppLoader>
            {
                <ThemeProvider theme={theme}>
                    <CssBaseline/>
                    <AppRouter/>
                </ThemeProvider>

            }
            <Notifications/>
            {/*<ToastContainer/>*/}
        </AppLoader>
    );
};

export default App; 
