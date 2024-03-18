import React, { useState } from 'react'
import OTPComponent from './OTPInputs';
import { Button, Space } from 'antd';

interface OTPVerificationScreenProps{
    length: number,
    expirationTime?: number,
    descritpion?: string,
    verifyOTpFunc: (otp:string[]) => void,
    cancelAction?:()=>void
}


const OTPVerificationScreen = ({length,expirationTime,descritpion,verifyOTpFunc,cancelAction}:OTPVerificationScreenProps) => {
    const [otp, setOTP] = useState(Array(length).fill(""));
    const [loading, setLoading] = useState(false);
    const handleVerify = async() => {
        // console.log("hey");
        setLoading(true);
        await verifyOTpFunc(otp);
        setLoading(false);
    }
  return (
      <Space size={20} direction='vertical' className=''>
          <p className='text-[22px] text-center text-[#4E6ACB]'>Verify OTP</p>
          {descritpion && <p>{descritpion}</p>}
          <OTPComponent
              otp={otp}
              setOTP={setOTP}
              expirationTime={expirationTime}
          />
          <Space>
              <Button disabled={loading} onClick={cancelAction}>Cancel</Button>
              <Button loading={loading} type='primary' className='bg-[#4E6ACB]' onClick={handleVerify}>Verify OTP</Button>
          </Space>
    </Space>
  )
}



export default OTPVerificationScreen;