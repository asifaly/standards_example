import { Button, Form, Modal, Row, Space, message } from 'antd'
import Title from 'antd/es/skeleton/Title';
import React, { useState } from 'react';
import gstVerifyIcon from "../../Assets/images/gstVerifyIcon.svg";
import gstVerifiedIcon from "../../Assets/images/gstVerifiedIcon.svg";
import OTPComponent from '../OTP/OTPInputs';
import OTPVerificationScreen from '../OTP/VerificationScreen';
import { AntdInputAbstract } from './inputwithlable';
import axios from 'axios';
import { thirdPartyServicesAPI } from '../../configs/common';
import { useApiCall } from '../../Hooks/apicall';
import { APIEndpoints } from '../../Services/backend/functions';
import { useSearchParams } from 'react-router-dom';



// function ButtonComponent(props: any) {
//   const [emailModalVisible, setEmailModalVisible] = useState(false);
//   const [otpModalVisible, setOtpModalVisible] = useState(false);
//   const [successModalVisible, setSuccessModalVisible] = useState(false);
//   const [userEmail, setUserEmail] = useState('');


//   const closeEmailModal = () => {
//     setEmailModalVisible(false);
//     setVerifyState(true)
//   };

//   const handleEmailContinue = (email:any) => {
//     setUserEmail(email);
//     setEmailModalVisible(false);
//     setOtpModalVisible(true);

//   };

//   const closeOtpModal = () => {
//     setOtpModalVisible(false);

//   };

//   const handleOtpVerification = () => {
//     setOtpModalVisible(false);
//     setSuccessModalVisible(true);

//   };

//   const closeSuccessModal = () => {
//     setSuccessModalVisible(false);
//     setVerifyState(true)
//   };
//   const [VerifyState, setVerifyState] = useState(true)

//   const handleVerify = () => {
    
//   }

//   const handleClick = () => {
//     setVerifyState(false)
//     setEmailModalVisible(true);
//   }

//   return (
//     <div>
//       {VerifyState ? <div> {props.data === 'Verified' ? <Button onClick={handleVerify} className={` w-[81px] h-[30px] text-[#FFFFFF] text-[10px] font-[400] bg-[#36B077] rounded `}>Verified</Button> :
//         <Button onClick={handleClick} className={` w-[81px] h-[30px] text-[#FFFFFF] text-[10px] font-[400] bg-[#4E6ACB] rounded `}>Verify GST</Button>} </div>
//         : <div>
//           <EmailModal
//             visible={emailModalVisible}
//             onCancel={closeEmailModal}
//             onContinue={handleEmailContinue}
//           />
//           <OtpVerificationModal
//             visible={otpModalVisible}
//             onCancel={closeOtpModal}
//             onVerify={handleOtpVerification}
//           />
//           <SuccessModal
//             visible={successModalVisible}
//             onDone={closeSuccessModal}
//           />
//         </div>
//       }
//     </div>
//   )
// }

type modalStates="username"|"otp"|"success"|""

const VerifyGstButton = ({ data, props }: any) => {
  const [modalOpenFor, setModalOpenFor] = useState<modalStates>("");
  const [searchParams] = useSearchParams();
  const loanId = searchParams.get("id");
  const [loading, setLoading] = useState(false);
  const {APIFunc} = useApiCall({
    method: "POST"
  });
  const [verifyOTPDetails, setVerifyOTPDetails] = useState({
    userName: "",
    ip: "",
    txn: "",
  })
  const handleVerifyClick = () => {
    setModalOpenFor("username");
  }
  const verifyOTP = async (otp:string[]) => {
    // const verifyResponse = await axios.post(thirdPartyServicesAPI + "/validate_gst_otp", {
    //   uname: verifyOTPDetails.userName,
    //   gstno: props?.gstId,
    //   ip: verifyOTPDetails.ip,
    //   txn: verifyOTPDetails.txn,
    //   otp: otp.join("")
    // });
    // if (verifyResponse.data?.status !== "success") {
    //   return message.error("OTP Verification Failed");
    // }
    const verifyResponse = await APIFunc({
      endpoint: APIEndpoints.verifyGST,
      headerProps: {
        token: true
      },
      body: {
        inquiryId: Number(loanId),
        uname: verifyOTPDetails.userName,
        gstno: props?.gstId,
        ip: verifyOTPDetails.ip,
        txn: verifyOTPDetails.txn,
        otp: otp.join("")
      }
    });
    if (!verifyResponse?.success) {
      return message.error(verifyResponse?.message);
    }
    message.success("OTP Verified Successfully");
    // setLoading(true);
    handleModalOpenState("success");
    // setLoading(false);
  }

  const onSubmit = async (values:any) => {
    setLoading(true);
    const sentResponse = await axios.post(thirdPartyServicesAPI + "/check_gst_username", {
      uname: values?.userName,
      gstno: props?.gstId
    });
    if (sentResponse?.data?.status !== "success") {
      return message.error("GST Username checking Failed");
    }
    setVerifyOTPDetails({
      ...verifyOTPDetails,
      userName: sentResponse?.data?.gst_username,
      txn: sentResponse?.data?.message?.header?.txn,
      ip: sentResponse?.data?.message?.header?.ip_address
    });
    message.success("OTP sent Successfully");
    handleModalOpenState("otp")
    setLoading(false);
  }

  const handleModalOpenState = (state: modalStates) => {
    if (state !== "") {
      handleModalOpenState("");
    }
    setModalOpenFor(state);
  }

  const GSTUserNameForm = () => {
    return (
      <Space size={20} className='flex justify-center' direction='vertical'>
        <p className='text-[#4E6ACB] text-center text-[18px] font-500'>Verify GSTIN</p>
        <img
          alt='verify gst'
          src={gstVerifyIcon}
          className='mx-auto'
        />
        <Form
          layout='vertical'
          disabled={loading}
          // fields={[
          //   {
          //     name: "userName"
          //   }
          // ]}
          onFinish={onSubmit}>
          <AntdInputAbstract
            FormItemsProps={{
              label: "Username",
              rules: [
                {
                  required: true
                }
              ],
              name:"userName"
            }}
            type='text'

          />
          <Space>
            <Button disabled={loading} onClick={() => handleModalOpenState("")}>Cancel</Button>
            <Button loading={loading} type='primary' className='bg-[#4E6ACB]' htmlType='submit'>Send OTP</Button>
          </Space>
        </Form>
      </Space>
    )
  }
  const VerifyOtp = () => {
    return (
      <OTPVerificationScreen
        length={6}
        descritpion={`You will be receiving OTP shortly to the number registered
with ${props?.gstId}`}
        verifyOTpFunc={verifyOTP}
        cancelAction={() => handleModalOpenState("username")}
      />
    )
  }
  const VerifiedComp = () => {
    return (
      <Space size={23} className='flex justify-center items-center' direction={"vertical"}>
        <img
          alt='verify gst'
          src={gstVerifiedIcon}
          className='mx-auto'
        />
        <p className='text-[#4E6ACB] text-center text-[18px] font-500'>GSTIN Verified</p>
        <Button onClick={()=>handleModalOpenState("")} type='primary' className='bg-[#4E6ACB] mx-auto'>Close</Button>
      </Space>
    )
  }

  const ModalChildrenObj = {
    username: GSTUserNameForm,
    otp: VerifyOtp,
    success: VerifiedComp,
    "":GSTUserNameForm
  }

  const ModalChildren=ModalChildrenObj[modalOpenFor]


  return (
    <>
      <Button onClick={handleVerifyClick}  disabled={data} type='primary' className={`${data ? "bg-[#36B077]" : "bg-[#4E6ACB]"} disabled:bg-[#36B077] disabled:text-[#fff]`}>
        {data ? "Verified" : "Verify GST"}
      </Button>
      <Modal
        destroyOnClose={true}
        footer={null}
        centered
        // okButtonProps={{
        //   className:"bg-[#4E6ACB]"
        // }}
        closable={false}
        // onCancel={()=>handleModalOpenState("")}
        open={["otp", "username", "success"].includes(modalOpenFor)}
      >
        <div className='p-4'>
          <ModalChildren />
        </div>
      </Modal>
    </>
  )
}
export default VerifyGstButton