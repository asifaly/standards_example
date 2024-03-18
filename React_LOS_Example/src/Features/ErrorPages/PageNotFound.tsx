import { Button, Space } from 'antd';
import React from 'react'
import { useNavigate } from 'react-router-dom'

const PageNotFound = () => {
    const navigate = useNavigate();
    const handleBack = () => {
        navigate(-1)
    }
  return (
      <div className='w-full h-[70vh] flex justify-center items-center'>
          <Space size={12} direction={"vertical"} className='w-8/12 mx-auto'>
              <img src="" alt="statusImage" className="" />
              <p className='text-[24px] font-[400]'>Page Not Found</p>
              <p className='text-[20px] font-[400]'>Sorry, We can't find the page you're looking for.</p>
              <Button className='bg-[#4E6ACB] h-[40px] rounded-none' type='primary' onClick={handleBack}>Go Back</Button>
          </Space>
    </div>
  )
}

export default PageNotFound