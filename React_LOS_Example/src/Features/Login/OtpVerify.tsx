import React, { useState, useRef, useEffect } from 'react'
import OtpImg from '../../Assets/images/otpverify.svg'
import logo from '../../Assets/images/logo.svg'
import { Typography, Input, Button, Space, Col, Divider, Row, message } from 'antd';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApiCall } from '../../Hooks/apicall';
import { APIEndpoints } from '../../Services/backend/functions';
import { routeNames } from '../Routes/RouteName';


function OtpVerify() {
    const navigate = useNavigate();
    const { Title, Text } = Typography;
    let currentIndex: number = 0;
    const { APIFunc:verifyOtpFunction,isLoading } = useApiCall({
        method: "POST"
    });
    const { APIFunc: resendOTPFunc, isLoading: resendLoading } = useApiCall({
        method: "POST"
    });

    const [otpNumber, setOtpNumber] = useState<string[]>(new Array(4).fill(''));
    const [otpIndices, setOtpIndices] = useState<number[]>([0, 0, 0, 0]);
    const inputRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

    const [searchParams, setSearchParams] = useSearchParams();
    let emailId = searchParams.get("emailId")

    const handleInputChange = ({ target }: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const { value } = target;
        const newOtp = [...otpNumber];
        newOtp[index] = value.substring(value.length - 1);
        setOtpNumber(newOtp);
    
        // Check if the input is not empty and there's a next input field
        if (value && index < 3) {
            // Calculate the next index
            const nextIndex = index + 1;
    
            // Update the index for the next input
            setOtpIndices([...otpIndices.slice(0, nextIndex), nextIndex, ...otpIndices.slice(nextIndex + 1)]);
    
            // Move focus to the next input
            inputRefs[nextIndex].current?.focus();
        }
    };
    

    const handleKeyDown = ({ key }: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (key === 'Backspace' && otpNumber[index] === '') {
            if (index > 0) {
                const newOtp = [...otpNumber];
                newOtp[index - 1] = ''; // Clear the previous input
                setOtpNumber(newOtp);
                const prevIndex = index - 1;
                setOtpIndices([...otpIndices.slice(0, prevIndex), prevIndex, ...otpIndices.slice(prevIndex + 1)]);
                inputRefs[prevIndex].current?.focus();
            }
        } else if (key === 'ArrowRight' || key === 'ArrowLeft') {
            if (key === 'ArrowRight' && index < 3) {
                const nextIndex = index + 1;
                inputRefs[nextIndex].current?.focus();
            } else if (key === 'ArrowLeft' && index > 0) {
                const prevIndex = index - 1;
                inputRefs[prevIndex].current?.focus();
            }
        }
    };
    
    
    
    

    useEffect(() => {
        // Focus on the current input field using refs
        inputRefs[0].current?.focus();
    }, []);

    const verifyOtpFunc = async() => {
        const verifyResponse = await verifyOtpFunction({
            // headerProps
            endpoint: APIEndpoints.verifyOTP,
            body: {
                identifier: emailId,
                otp: otpNumber.join("")
            }
        })
        if (verifyResponse.success) {
            message.success(verifyResponse.message);
            navigate(routeNames.dashboard, {
                replace: true
            });
        }
        else {
            message.error(verifyResponse.message)
        }
    }

    const resendOTP = async () => {
        const OTPResponse = await resendOTPFunc(({
            endpoint: APIEndpoints.sendOtp,
            headerProps: {
                token: true
            },
            body: {
                identifier: emailId,
                identifierType: "email"
            }
        }));
        if (OTPResponse.success) {
            message.success(OTPResponse.message)
            // navigate({
            //     pathname: routeNames.OtpVerify,
            //     search: crea({ emailId: emailId }).toString()
            // });
        }
        else {
            message.error(OTPResponse.message)
        }
    }

    return (
        <Row className='max-mobile:block'>
            <Col className='w-1/2  max-mobile:w-full'>
                <img className='h-[100vh] object-cover w-full' src={OtpImg} alt='img' />
            </Col>
            <Col className='w-1/2 h-[100vh] flex items-center max-mobile:w-full'>
                <Space direction="horizontal" className='w-8/12 h-[50vh] mb-20  mx-auto block text-left max-tablet:w-9/12 '>
                    <img className='w-[200px] h-[60px]  max-tablet:w-[116px] max-tablet:h-[32px]  max-mobile:w-[164px] max-mobile:h-[46px]' src={logo} alt='logo' />
                    <Title level={3} className='leading-7 mt-10 text-[#2D2D2D] text-[20px]  max-tablet:text-[14px]   max-mobile:text-[18px]'>OTP Verification</Title>
                    <Text className='text-[#595959] font-[300] text-[18px]  max-tablet:text-[12px]  max-mobile:text-[14px]'>Enter the OTP sent in <span className='text-[#353535] font-[400]  max-tablet:text-[14px]  max-mobile:text-[16px]'> {emailId}</span></Text>
                    <Row className="flex text-center mt-16 ">
                        {otpNumber.map((_, index) => {
                            return <input id='otpNumber' key={index} value={otpNumber[index]} ref={inputRefs[index]}  onKeyDown={(e) => handleKeyDown(e, index)} type='text' className="otp-input w-[80px] max-tablet:w-[55px]  max-mobile:w-[50px] px-7  py-3 h-14 border-b-2 ml-3 border-b-[#4E6ACB] text-[35px] outline-none  text-[#707070] spin-button-none" onChange={(e) => handleInputChange(e, index)} 
                            />
                        })}
                    </Row>
                    <Button loading={isLoading || resendLoading} type="default" id='Login' className=' bg-[#4E6ACB] text-[#FFFFFF] h-[50px] mt-16 text-[16px]  max-tablet:text-[12px]   max-mobile:text-[14px]' onClick={verifyOtpFunc} block> Login </Button>
                    <Button loading={resendLoading||isLoading} type="default" id='Login' className=' bg-[#4E6ACB] text-[#FFFFFF] h-[50px] mt-4 text-[16px]  max-tablet:text-[12px]   max-mobile:text-[14px]' onClick={resendOTP} block> Resend OTP </Button>

                </Space>
            </Col>
        </Row>
    )
}

export default OtpVerify