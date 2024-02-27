import addNotification from 'react-push-notification';

const ShowOrderNotification = ({title, message, subTitle=``}) => {
    console.warn({title, message, subTitle})
    addNotification({
        title: title,
        subtitle: subTitle,
        message: message,
        theme: 'darkblue',
        native: false, // when using native, your OS will handle theming.
        silent: false,
        duration: 60000,
    });

}
export default ShowOrderNotification;