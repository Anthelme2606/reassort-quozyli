import React from 'react';
import AppRoute from './app/routes/route';
// import { AppProvider } from './app/providers/app-provider';
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import ServerProvider from './lib/apollo-client';

const App = () => {
  return (
    <>
    <ToastContainer/>
      <AppRoute />
    </>
  );
};

const AppWrapper = () => (
  <ServerProvider>

    <Router>
      
        <App />
   
    </Router>
  
  </ServerProvider>
 
);

export default AppWrapper;
