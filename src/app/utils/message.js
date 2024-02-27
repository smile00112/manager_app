import {toast} from "react-toastify";

const showToast = (message, type = '') => {
    const seetings = {
        position: "top-right",
        autoClose: false,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    };

    type ? toast[type]( message, seetings) : toast( message, seetings);
}

export default showToast;