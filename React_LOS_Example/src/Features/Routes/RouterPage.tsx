import React from 'react'
import {BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../Login/Login';
import OtpVerify from '../Login/OtpVerify';
import { routeNames } from './RouteName';
import AuthHOC from '../../Components/HOC/AuthHOC';
import Dashboard from '../../Components/Layout/layout';
import InternalServerError from '../ErrorPages/InternalServerError';

function RouterPage() {
  return (
    <BrowserRouter >
      <Routes >
        <Route path={routeNames.login} element={<Login />} />
        <Route path="/" element={<Navigate replace={true} to={routeNames.dashboard} />} />
        <Route path={routeNames.OtpVerify} element={<OtpVerify />} />
        <Route path={routeNames.internalError} element={<InternalServerError />} />
        <Route path={routeNames.dashboard} element={<Navigate to={routeNames.inquiry} />} />
        <Route path='/:dashboard' element={<AuthHOC children={<Dashboard />} />} />
        <Route path='/:dashboard/:page' element={<AuthHOC children={<Dashboard />} />} />
        <Route path='/:dashboard/:page/:id' element={<AuthHOC children={<Dashboard />} />} />
        
        {/* <Route path={routeNames.inquiry} element={<Inquiry />} />
        <Route path={routeNames.newInquiry} element={<NewInquiry/>} /> */}
      </Routes>
    </BrowserRouter >

   )
}

export default RouterPage