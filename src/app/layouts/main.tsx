import React from 'react';
import Footer from '../components/common/Footer';
import Header from '../components/common/Header';
import HomePage from '../components/pages/HomePage';
import Soskets from '../components/ui/sockets/soskets';
import {ToastContainer} from 'react-toastify';
const Main: React.FC = () => {

  return (
    <>
        <Header />
        <HomePage />
        <Footer />
        <Soskets />
        <ToastContainer/>
    </>
  );
};

export default Main;
