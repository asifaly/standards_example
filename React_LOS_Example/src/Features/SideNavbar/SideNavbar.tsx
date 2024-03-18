import React, { useState } from 'react';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import { Col, Row } from 'antd';

import dashImg from '../../Assets/images/DashBordImg.svg'
import SettingImg from '../../Assets/images/SettingImg.svg'
import newRequestImg from '../../Assets/images/newRequestImg.svg'

import { Link, NavLink, useLocation, useNavigate, useParams } from 'react-router-dom';
import { routeNames } from '../Routes/RouteName';
import { useAppSelector } from '../../redux/store/store';


function SideNavBar() {
    const params = useParams();
    const {userDetails:{isKrediqUser}} = useAppSelector((state) => state["userDetails"]);
    // console.log({params});

    type MenuItem = Required<MenuProps>['items'][number];
    

    function getItem(
        label: React.ReactNode,
        key: React.Key,
        icon?: React.ReactNode,
        children?: MenuItem[],
        type?: 'group',
    ): MenuItem {
        return {
            key,
            icon,
            children,
            label,
            type,
        } as MenuItem;
    }

    const krediqUsersNavs = [
        getItem(<NavLink to={routeNames.inquiry} >Dashboard</NavLink>, 'dashboard', <img src={dashImg} alt='icon' />, [
            getItem(<NavLink to={routeNames.inquiry}>Inquiry</NavLink>, 'inquiries', null),
            getItem(<NavLink to={routeNames.newapplication}> New Application</NavLink>, 'new-application', null),
            getItem(<NavLink to={routeNames.sendToCustomer}>Sent to Customer </NavLink>, 'sent-to-customer', null),
            getItem(<NavLink to={routeNames.submitted}>Submitted </NavLink>, 'submitted', null),
            getItem(<NavLink to={routeNames.customerApproval}>Customer Approval </NavLink>, 'customer-approval', null),
            getItem(<NavLink to={routeNames.customerAccepted}>Customer Accepted </NavLink>, 'customer-accepted', null),
            getItem(<NavLink to={routeNames.Completed}>Completed</NavLink>, 'completed', null)
        ]),
        getItem(<NavLink className={"text-[15px]"} to={routeNames.newRequest}>New Request</NavLink>, 'new-request', <img src={newRequestImg} alt='icon' />),
        getItem(<NavLink className={"text-[15px]"} to={routeNames.settings}>Settings</NavLink>, 'settings', <img src={SettingImg} alt='icon' />),
    ]
    const customerNavs = [
        getItem(<NavLink to={routeNames.inquiry} >Dashboard</NavLink>, 'dashboard', <img src={dashImg} alt='icon' />, [
            getItem(<NavLink to={routeNames.inquiry}>Inquiry</NavLink>, 'inquiries', null)])
    ]

    const items: MenuProps['items'] = isKrediqUser?krediqUsersNavs:customerNavs;

    return (
        <Row className=''>
            <Col className=' border-none'>
                <Menu       
                    className=' outline-none !border-none text-[15px] text-left  bg-[#F3F9FF]'
                    // onClick={onClick}
                    defaultOpenKeys={["dashboard"]}
                    mode="inline"
                    items={items}
                    activeKey={params?.dashboard}
                    defaultValue={"dashboard"}
                />
            </Col>
        </Row>
    )
}

export default SideNavBar