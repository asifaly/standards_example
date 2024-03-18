import { Col, Row, Input, Avatar, MenuProps, Dropdown, Typography, Button, message } from 'antd'
import React, { useState } from 'react'
import { SearchOutlined } from '@ant-design/icons';
import seachIcon from '../../Assets/images/SearchIconImg.svg'
import { useAppSelector } from '../../redux/store/store';
import { useApiCall } from '../../Hooks/apicall';
import { APIEndpoints } from '../../Services/backend/functions';
import { useNavigate } from 'react-router-dom';
import { routeNames } from '../../Features/Routes/RouteName';
import { userLogoutSetups } from '../../Services/helpers/auth';
function Header() {
  const onSearch = (value: string) => {
    console.log("searching...");
  };
  const { isLoading, APIFunc } = useApiCall({
    method: "POST"
  });
  const navigate = useNavigate();
  const { userDetails: { name } } = useAppSelector((state) => state["userDetails"]);
  const nameFormat = name ? name[0].toLocaleUpperCase() : "A";
  const logoutUser = async() => {
    const response = await APIFunc({
      endpoint: APIEndpoints.logout,
      headerProps: {
        token:true
      }
    });
    if (response?.success) {
      navigate(routeNames.login, {
        replace: true
      });
      userLogoutSetups();
      message.success("Logged out successfully")
    }
    else {
      message.error(response?.message);
    }
  }
  // const [user, setUser] = useState(UserList[0].toLocaleUpperCase());

  const items: MenuProps["items"] = [
    {
      label: <Button danger onClick={logoutUser} className='!border-none'>Logout</Button>,
      type: "group"
    }
  ]

  return (
    <Row>
      <Col className=' flex item-center'>
        <Input.Search size="large" placeholder="Search" className='mr-5 rounded-md bg-[#fff]' bordered={false} onSearch={onSearch} />
        <Dropdown arrow={{ pointAtCenter: true }} placement='bottomRight' menu={{ items }}>
          <Avatar className='bg-gradient-to-r from-[#2D95DC] to-[#5364C9] px-4' size="large">
            {nameFormat}
          </Avatar>
        </Dropdown>
      </Col>
    </Row>
  )
}

export default Header