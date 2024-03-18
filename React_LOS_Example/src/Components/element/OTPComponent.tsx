import { Button, InputNumber, Space } from 'antd';
import React from 'react'

interface OTPComponentProps{
    length: number
}

const OTPComponent = ({ length }: OTPComponentProps) => {
    
    const [otp, setOtp] = React.useState(Array(length).fill(0));

    const handleResendOTP = () => {

        // TODO: Implement logic to resend OTP
    };

    const handleVerifyOTP = () => {
        // TODO: Implement logic to verify OTP
    };
  return (
      <div>
          {
              otp.map((input,index) => (
                  <InputNumber
                      key={index}
                      placeholder="X"
                      style={{ width: '32px', marginRight: '8px' }}
                      value={otp[index]}
                      onChange={(e) => {
                          const newOtp = otp.slice();
                          newOtp[index] = e.target.value;
                          setOtp(newOtp);
                      }}
                  />
              ))
          }
          {/* <InputNumber
              placeholder="X"
              style={{ width: '32px', marginRight: '8px' }}
              value={otp[0]}
              onChange={(e) => {
                  const newOtp = otp.slice();
                  newOtp[0] = e.target.value;
                  setOtp(newOtp);
              }}
          />
          <InputNumber
              placeholder="Digit 2"
              style={{ width: '32px', marginRight: '8px' }}
              value={otp[1]}
              onChange={(e) => {
                  const newOtp = otp.slice();
                  newOtp[1] = e.target.value;
                  setOtp(newOtp);
              }}
          />
          <InputNumber
              placeholder="Digit 3"
              style={{ width: '32px', marginRight: '8px' }}
              value={otp[2]}
              onChange={(e) => {
                  const newOtp = otp.slice();
                  newOtp[2] = e.target.value;
                  setOtp(newOtp);
              }}
          />
          <InputNumber
              placeholder="Digit 4"
              style={{ width: '32px' }}
              value={otp[3]}
              onChange={(e) => {
                  const newOtp = otp.slice();
                  newOtp[3] = e.target.value;
                  setOtp(newOtp);
              }}
          /> */}
          </div>
  )
}

export default OTPComponent