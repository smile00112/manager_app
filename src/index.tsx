import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {Router} from 'react-router-dom';
import App from './app/App';
import {createStore} from './app/store/createStore';
import history from './app/utils/history';
import {DevSupport} from "@react-buddy/ide-toolbox";
import {ComponentPreviews, useInitial} from "./dev";
import {useDispatch} from 'react-redux';
import {loadOrdersList, clearOrdersList, addLog} from '../src/app/store/orders';

//import useCheckIsMobile from '../src/app/services/isMobile'
//import { Notifications } from 'react-push-notification';
//import ShowOrderNotification from "./app/utils/react-push-notification";
//import Soskets from "./app/components/ui/sockets/soskets";
//import reportWebVitals from './reportWebVitals';
//import Home from './app/components/pages/HomePage/Home';
//import Soskets from '../src/app/components/ui/sockets/soskets';
//import reportWebVitals from './reportWebVitals';

declare global {
    interface MyWindow extends Window {
        foo: string;
    }
}
declare const window: any;

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>     
//     <Home />  
//   </React.StrictMode>
// );

const store = createStore();

// const rootElement = document.getElementById("root")!;
// const root = ReactDOM.createRoot(rootElement);
// root.render(
//   <React.StrictMode>
//     <Provider store={store}>
//         <App /> 
//     </Provider> 
//   </React.StrictMode>
// );  


if (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Windows Phone/i.test(
        navigator.userAgent
    )
) {
    window.addEventListener('pageshow', function () {
      //  alert('pageshow')
        store.dispatch( addLog('pageshow') )
    });
    window.addEventListener('visibilitychange', function () {
       // alert('visibilitychange')
         store.dispatch( addLog('visibilitychange') )
         store.dispatch(clearOrdersList());
         store.dispatch(loadOrdersList('', 1));
    });
    window.addEventListener('focus', () => {
        store.dispatch( addLog('focus') )

    })
}else{
    //alert('not ios')
}
//Для ios обновляем заказы при разворачивании приложения

window.addEventListener('blur', () => {

    if (
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Windows Phone/i.test(
            navigator.userAgent
        )
    ) {
        console.error('blur')
        // alert('blur')
        store.dispatch( addLog('blur') )

        // store.dispatch(clearOrdersList());
        // store.dispatch(loadOrdersList('', 1));
    }
})

ReactDOM.render(

/*<React.StrictMode>*/
    <>

        <Provider store={store}>
            <Router history={history}>
                <DevSupport ComponentPreviews={ComponentPreviews}
                            useInitialHook={useInitial}
                >
                    <App/>
                </DevSupport>
            </Router>
            {/*<Notifications/>*/}
            {/*<Soskets />*/}
        </Provider>

    </>
    /*</React.StrictMode>*/
    ,
    document.getElementById('root')
);

//reportWebVitals();
//reportWebVitals();
