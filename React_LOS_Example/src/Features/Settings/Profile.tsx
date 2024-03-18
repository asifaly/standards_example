// import React, { useEffect, useState } from 'react'
import ProfileIcon from '../../Components/element/ProfileIcon'
import { Space,Form } from 'antd'
import { AntdInputAbstract } from '../../Components/element/inputwithlable'
import { useAppSelector } from '../../redux/store/store'

const Profile = () => {
    const { userDetails }: any = useAppSelector(({ userDetails }) => userDetails);
  return (
      <Space size={16} direction='vertical' className='w-full py-2'>
          <ProfileIcon />
          <Form
              layout='vertical'
              fields={[
                  {
                      name: "email",
                      value: userDetails?.email
                  },
                  {
                      name: "phoneNumber",
                      value: userDetails?.phoneNumber
                  },
                  {
                      name: "name",
                      value:userDetails?.name
                }
              ]}
          >
              <AntdInputAbstract
                  FormItemsProps={{
                      name: "name",
                      label: "Name"
                  }}
                  ElementProps={{
                      disabled:true
                  }}
                  type='text'
              />
              <AntdInputAbstract
                  FormItemsProps={{
                      htmlFor: "phoneNumber",
                      label: "Mobile Number",
                      className: "w-full"
                  }}
                  type='phoneNumber'
                  ElementProps={{
                      selectProps: {
                          disabled: true,
                          value:"+91"
                      },
                      inputProps: {
                          id: "phoneNumber",
                          name: "phoneNumber",
                          value: userDetails?.phoneNumber,
                          disabled:true,
                          className:"w-full"
                      }
                  }}
              />
              <AntdInputAbstract
                  FormItemsProps={{
                      name: "email",
                      label: "Email",
                      rules: [{
                          type: "email"
                      }],
                  }}
                  type='text'
                  ElementProps={{
                      disabled:true
                  }}
              />
          </Form>
    </Space>
  )
}

export default Profile