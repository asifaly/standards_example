import React, { useEffect, useState } from 'react'
import LoginImg1 from '../../Assets/images/loginImg.svg'
import logo from '../../Assets/images/logo.svg'
import { Typography, Input, Button, Space, Col, Divider, Row, message, Form } from 'antd';
import { createSearchParams, useNavigate, useSearchParams } from 'react-router-dom';
import { APIEndpoints, FetchAction, PostAction } from '../../Services/backend/functions';
import { useApiCall } from '../../Hooks/apicall';
import { routeNames } from '../Routes/RouteName';
import { AntdInputAbstract } from '../../Components/element/inputwithlable';
import { useForm } from 'antd/es/form/Form';


function Login() {
    const { Title, Text } = Typography;
    const navigate = useNavigate();
    const [form] = useForm();
    const { isLoading, APIFunc } = useApiCall({
        method: "POST"
    });
    const [searchParams] = useSearchParams();
    const loginError=searchParams.get("errorMessage")

    useEffect(() => {
        if (loginError) {
            message.error(loginError);
            navigate(routeNames.login);
       } 
    },[])

    const [emailId, setEmailId] = useState<string>('');
    const handleInputChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
        setEmailId(target.value)
    }

    // const getotp =() =>{
    //     // navigate(`/otp-verify?emailId=${emailId}`)

    // }

    const sendOTP = async () => {
        const OTPResponse = await APIFunc(({
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
            navigate({
                pathname: routeNames.OtpVerify,
                search: createSearchParams({ emailId: emailId }).toString()
            });
        }
        else {
            message.error(OTPResponse.message)
        }

        // console.log({OTPResponse.});
        // const OTPResponse = await PostAction;


    }

    return (
        <Row className='max-mobile:block'>
            <Col className='w-1/2 max-mobile:w-full'>
                <img className='h-[100vh] object-cover w-full' src={LoginImg1} alt='img' />
            </Col>
            <Col className='w-1/2 h-[100vh] flex items-center    max-mobile:w-full font-poppins bg-[#F3F9FF] '>
                <Space direction="horizontal" className='w-8/12 h-[50vh] mb-20  mx-auto block text-left max-tablet:w-9/12 '>
                    <img className='w-[200px] h-[60px] max-tablet:w-[116px] max-tablet:h-[32px]  max-mobile:w-[164px] max-mobile:h-[46px]' src={logo} alt='logo' />
                    <Title level={3} className='leading-5 font-poppins	mt-10 text-[#2D2D2D] text-[20px] max-tablet:text-[14px] max-mobile:text-[18px] '> Welcome back !</Title>
                    <Text className='text-[#595959] font-[300] text-[18px] font-poppins max-tablet:text-[12px]  max-mobile:text-[14px]'>Enter your email or Mobile Number to Sign In</Text>
                    {/* <Input value={emailId} placeholder="Enter your email" className='text-[#C2C2C2A3]  font-poppins text-[16px] font-[300] p-3 outline-none border-none max-tablet:text-[10px]  max-mobile:text-[12px]' onChange={handleInputChange} /> */}
                    <Form
                        form={form}
                        onFinish={sendOTP}
                        layout='vertical'
                        fields={[
                            {
                                name: "email",
                                value:emailId
                            }
                        ]}
                        onValuesChange={(changedValues, allValues) => {
                            setEmailId(allValues.email)
                        }}
                        className='mt-6'
                    >
                        <AntdInputAbstract
                            FormItemsProps={{
                                name: "email",
                                rules: [
                                    {
                                        required: true,
                                        message: "Email Id is required"
                                    },
                                    {
                                        type: "email",
                                        message: "Invalid email format",
                                    },
                                ],
                                // label: "Enter Email/Phone Number"
                            }}
                            type='text'
                            ElementProps={{
                                className: 'text-[#000]  font-poppins text-[16px] font-[300] p-3 outline-none border-none max-tablet:text-[10px]  max-mobile:text-[12px]',
                                onChange: handleInputChange,
                                placeholder:"xxx@gmail.com / 95XXXXXXXX"
                            }}
                        />
                        <Button htmlType='submit' loading={isLoading} className=' bg-[#4E6ACB] text-[#FFFFFF] font-poppins h-[50px] mt-6 text-[16px] max-tablet:text-[10px]  max-mobile:text-[14px]' block> Get OTP </Button>
                    </Form>
                </Space>
            </Col>
        </Row>
    )
}

export default Login