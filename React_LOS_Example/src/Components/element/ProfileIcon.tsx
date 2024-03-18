import { Avatar, Badge, Form, Space } from 'antd'
import React from 'react';
import EditIcon from "../../Assets/images/editIcon.svg";
import UnknownProfileIcon from "../../Assets/images/unknownProfile.svg";


const ProfileIcon = () => {
    const imagSrc=UnknownProfileIcon
  return (
          <Badge className='cursor-pointer' count={
              <img
                  src={EditIcon}
                  alt='editIcon'
                  className='w-[40px] h-[40px]'
              />
          }
              offset={[-20,100]}
          >
              <Avatar
                  size={120}
                  icon={
                      <img
                          alt='profileImage'
                          src={imagSrc}
                      />
                  }
              />
          </Badge>
  )
}

export default ProfileIcon