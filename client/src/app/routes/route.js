import React from "react";
import { Route, Routes } from "react-router-dom";
import ROUTES from "./names";
import Home from '../../pages/home';
import Reassort from "../../pages/reassort";

const AppRoute = () => {
  return (
    <Routes>
       <Route path={ROUTES.HOME} element={<Home />} />
       <Route path={ROUTES.REASSORT} element={<Reassort />} />
    </Routes>
    
    
  );
};

export default AppRoute;
