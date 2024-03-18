// TableNavLink.js
import React, { Children } from 'react';
import { NavLink } from 'react-router-dom';

const TableNavLink = ({ to, children, isLinked }: any) => {
    return (
        <>
            {isLinked ? <NavLink className=' cursor-pointer' to={to} >
                {children}
            </NavLink> : <> {children}</>}
        </>
    );
};

export default TableNavLink;
