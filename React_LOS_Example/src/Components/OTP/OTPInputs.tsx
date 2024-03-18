import { Button, Input, InputNumber, InputNumberProps, Space } from 'antd';
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import _ from 'lodash';

interface OTPComponentProps {
    otp: string[],
    setOTP: Dispatch<SetStateAction<string[]>>,
    expirationTime?:number
}

// const OTPComponent = ({ otp, setOTP, expirationTime }: OTPComponentProps) => {
//     const inputRefs = useRef<Array<any>>([]);

//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
//         if (!_.isNaN(e.target.value)) {
//             const newOtp = otp.slice();
//             newOtp[index] = Number(e.target.value);
//             setOTP(newOtp);

//             // Move to the next input field or stay on the current one
//             if (index < otp.length - 1) {
//                 inputRefs.current[index + 1]?.focus();
//             }
//         }
//     };

//     const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>, index: number) => {
//         e.preventDefault();
//         const pastedData = e.clipboardData.getData('text').replace(/\D/g, '');
//         const newOtp = otp.slice();

//         // Update the OTP fields with the pasted data
//         for (let i = 0; i < pastedData.length; i++) {
//             if (index + i < otp.length) {
//                 newOtp[index + i] = Number(pastedData[i]);
//             }
//         }

//         setOTP(newOtp);

//         // Move to the next input field if available
//         if (index + pastedData.length < otp.length) {
//             inputRefs.current[index + pastedData.length]?.focus();
//         }
//     };

//     const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
//         // Handle backspace key to move to the previous input field
//         if (e.key === 'Backspace' && index > 0) {
//             const newOtp = otp.slice();
//             newOtp[index] =0;
//             console.log({newOtp});
//             setOTP(newOtp);
//             inputRefs.current[index - 1].focus();
//         }
//     };

//     return (
//         <div className='w-7/12 mx-auto space-y-2'>
//             <Space>
//                 {otp.map((input, index) => (
//                     <Input
//                         key={index}
//                         placeholder="X"
//                         style={{ width: '33px', marginRight: '8px' }}
//                         value={otp[index]}
//                         onPaste={(e)=>handlePaste(e,index)}
//                         onChange={(e) => handleInputChange(e, index)}
//                         onKeyDown={(e) => handleKeyDown(e, index)}
//                         ref={(inputRef) => (inputRefs.current[index] = inputRef)}
//                     />
//                 ))}
//             </Space>
//             {/* {expirationTime && <CountDownTimer timeInSeconds={expirationTime} />} */}
//         </div>
//     );
// };

const OTPComponent = ({ expirationTime,otp,setOTP }: OTPComponentProps) => {
    const otpLength = 6;
    // const [otp, setOTP] = useState<string[]>(Array(otpLength).fill(""));
    const inputRefs = useRef<Array<any>>(Array(otpLength).fill(null));

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace' && index > 0) {
            const newOTP = [...otp];
            newOTP[index] = '';
            setOTP(newOTP);
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleInputChange = (value: string, index: number) => {
        // console.log({ value }, value.match(/^\d$/));
        
        const newOTP = [...otp];
        if (value.match(/^\d$/)) {
            newOTP[index] = value;
            setOTP(newOTP);
        } else {
            newOTP[index] = '';
            setOTP(newOTP);
        }

        if (index < otpLength - 1 && value.match(/^\d$/)) {
            inputRefs.current[index + 1]?.focus();
        } else if (index > 0 && !value) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>, index: number) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '');

        const newOTP = [...otp];
        for (let i = 0; i < pastedData.length && index + i < otpLength; i++) {
            newOTP[index + i] = pastedData[i];
        }
        setOTP(newOTP);

        if (index + pastedData.length < otpLength) {
            inputRefs.current[index + pastedData.length]?.focus();
        }
    };

    return (
        <div className='w-7/12 mx-auto space-y-2'>
            <Space>
                {otp.map((input, index) => (
                    <Input
                        key={index}
                        placeholder="X"
                        // style={{ width: '35px' }}
                        className='w-[40px] text-center'
                        value={input}
                        onChange={(e) => handleInputChange(e.target.value, index)}
                        onPaste={(e) => handlePaste(e, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        ref={(inputRef) => (inputRefs.current[index] = inputRef)}
                    />
                ))}
            </Space>
            {expirationTime && <CountDownTimer timeInSeconds={expirationTime} />}
        </div>
    );
};


interface CountDownTimerProps{
    timeInSeconds:number
}

export const CountDownTimer = ({ timeInSeconds }: CountDownTimerProps) => {
    const [seconds, setSeconds] = useState(timeInSeconds);
    const intervalId = useRef<any>(null);

    // Reset the countdown when timeInSeconds changes
    useEffect(() => {
        if (intervalId.current) {
            clearInterval(intervalId.current);
        }

        setSeconds(timeInSeconds);

        if (timeInSeconds > 0) {
            intervalId.current = setInterval(() => {
                setSeconds((prevSeconds) => prevSeconds - 1);
            }, 1000);
        }

        return () => {
            if (intervalId.current) {
                clearInterval(intervalId.current);
            }
        };
    }, [timeInSeconds]);

    useEffect(() => {
        if (seconds <= 0) {
            clearInterval(intervalId.current);
        }
    }, [seconds]);

    const formatSeconds = () => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;

        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (
        <p className='text-right text-[#4E6ACB] text-[15px]'>{formatSeconds()}</p>
    );

};

export default OTPComponent