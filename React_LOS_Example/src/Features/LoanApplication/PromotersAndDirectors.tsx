import { Button, Checkbox, Col, Form, Modal, Row, Select, Space, Spin, message } from 'antd'
import { CheckCircleTwoTone } from '@ant-design/icons';
import React, { useEffect, useState } from 'react'
import { AntdInputAbstract } from '../../Components/element/inputwithlable'
import CompanyUsersIndividualComp from '../../Components/element/newContactComponent'
import { useApiCall } from '../../Hooks/apicall'
import { APIEndpoints, deleteFileInStorageAndDB, uploadAttachmentsAndSaveToDB } from '../../Services/backend/functions'
import { useSearchParams } from 'react-router-dom'
import Loader from '../../Components/element/loader'
import { CheckboxChangeEvent } from 'antd/es/checkbox'
import { useForm } from 'antd/es/form/Form'
import { debounceAndSaveToFirestore, upsertAtFirestore } from '../../Services/firebase/query'
import dayjs from 'dayjs';
import _ from 'lodash'
import closeIcon from "../../Assets/images/Closebtn.svg";
import { useAppDispatch, useAppSelector } from '../../redux/store/store'
import { isloanApplicationEditable, phoneNumberValidation, removeErrorsInLoanStore, shareHoldingValidation } from '../../Services/helpers/common'
import { removeErrors } from '../../redux/loanApplicationReducer'
import { AuthorizationComp } from '../../Components/HOC/Authorization'
import { useLoanDetails } from '../../Context/loanContext';
import { createSelector } from '@reduxjs/toolkit'
import OTPVerificationScreen from '../../Components/OTP/VerificationScreen'
import { verifyServicesDescriptions } from '../../configs/loan'
import { arraySpreading, checkShareHoldingPercentage, checkUniqueEmailOrPhoneNumber, sendOTPToAadharUser, sendOTPToPanUser, verifyAadhar } from '../../Services/helpers/loanApplication'

type DocumentTypes = "pan" | "aadhar";


function PromotersAndDirectors() {
  const [searchParams] = useSearchParams();
  const selectErrors = createSelector(
    [(state) => state.loanDetails],
    (loanDetails) => loanDetails || {} // Ensure that 'errors' is always defined
  );
  const { errors, disabled } = useAppSelector(selectErrors);
  const { state: { partyId, status }, dispatch } = useLoanDetails();
  console.log(status, 'status')

  // console.log({errors});
  const [form] = useForm();
  const memberPlainDetails = {
    name: "",
    partyRoleId: "",
    gender: null,
    aadhar: {
      name: "",
      key: "",
      url: ""
    },
    linkedInUrl: null,
    fatherOrSpouseName: null,
    motherName: null,
    dob: null,
    phoneNumber: null,
    panNumber: null,
    pan: {
      name: "",
      key: "",
      url: ""
    },
    email: null,
    dinNumber: null,
    shareHolding: null,
    aadharNumber: null,
    currentAddress: null,
    permanentAddress: null,
    isAadharVerified: false,
    isPanVerified: false,
    aadharId: null,
    panId: null,
    partyId
  }


  const loanId = searchParams.get("id");
  const [promoterDetails, setPromoterDetails] = useState({
    members: [{
      ...memberPlainDetails
    }],
    designations: [],
    genders: []
  });
  const directorPartyRoleId=1

  const [modalProps, setModalProps] = useState({
    open: false,
    for: "aadhar",
    otpLength: 6,
    client_id: "",
    expirationTime: 0
  });

  const [activeMemberIndex, SetActiveMemberIndex] = useState(0);
  const [currAddress, setCurrAddress] = useState(true);
  const activeMember = promoterDetails.members[activeMemberIndex];
  const canValidatePhoneNumber = ["sentToCustomer"].includes(status) || Boolean(activeMember?.phoneNumber);
  const canValidateEmail = ["sentToCustomer"].includes(status) || Boolean(activeMember?.email);

  const promtersList = promoterDetails.members.map((pr: any, index) => ({
    name: pr.name,
    partyRoleId: pr.partyRoleId
  }));
  const { isLoading, APIFunc } = useApiCall({
    method: "GET"
  });

  const [fileUploadLoader, setFileUploadLoader] = useState({
    aadhar: false,
    pan: false
  });

  useEffect(() => {
    fetchMembersOfParty();
  }, []);

  if (errors.users[activeMemberIndex]?.length) {
    // form.resetFields()
    form.setFields(errors.users[activeMemberIndex])
  }
  // useEffect(() => {
  // }, [JSON.stringify(errors.users)])

  const fetchMembersOfParty = async () => {
    const { success, data } = await APIFunc({
      endpoint: APIEndpoints.loanMembersOfPartyById,
      headerProps: {
        token: true
      },
      query: {
        inquiryId: Number(loanId)
      }
    });
    if (success) {
      setPromoterDetails({
        members: data?.savedData,
        designations: data?.preloadData?.designations,
        genders: data?.preloadData?.genders
      });
    }
  }


  const TriggerVerificationAPICall = async (type: DocumentTypes) => {
    const isAadharActivity = type === "aadhar";
    // const verifiedKey = isAadharActivity ? "isAadharVerified" : "isPanVerified";
    const valueKey = isAadharActivity ? "aadharNumber" : "panNumber";
    if (!activeMember[valueKey]) {
      return form.setFields([
        {
          name: valueKey,
          errors: ["Required"]
        }
      ])
    }
    setModalProps({
      ...modalProps,
      open: true,
      for: "loading",
    });

    if (isAadharActivity) {
      const otpSentDetails = await sendOTPToAadharUser(activeMember[valueKey]);
      if (otpSentDetails) {
        setModalProps({
          ...modalProps,
          open: true,
          for: type,
          expirationTime: 600,
          client_id: otpSentDetails?.client_id
        });
      }
    }
    else {
      const isAuthentic = await sendOTPToPanUser(activeMember[valueKey]);
      if (isAuthentic) {
        handleValuesChange({ isPanVerified: true }, {
          ...activeMember,
          isPanVerified: true
        });
      }
      setModalProps({
        open: false,
        for: "aadhar",
        otpLength: 6,
        client_id: "",
        expirationTime: 0
      })
    }

    // handleValuesChange({}, {
    // setModalProps({
    //   ...modalProps,
    //   open: false,
    //   for: "",
    // });
    //   ...activeMember,
    //   [verifiedKey]: true
    // });
  };

  const handleAddContact = () => {
    let stateRef = promoterDetails.members;
    stateRef = [...stateRef, { ...memberPlainDetails }];
    setPromoterDetails({
      ...promoterDetails,
      members: stateRef
    });
    SetActiveMemberIndex(stateRef.length - 1);
  }

  const handleValuesChange = async (changedValues: any, allValues: any) => {
    let formattedDate = allValues["dob"] ? dayjs(allValues["dob"]).toDate().toString() : allValues["dob"];
    allValues = {
      ...allValues,
      dob: formattedDate
    };
    removeErrorsInLoanStore({
      changedValues,
      errors,
      tabKey: "users",
      activeMemberIndex,
      form
    });
    if (changedValues["partyRoleId"]) {
      allValues = {
        ...allValues,
        dinNumber: (changedValues["partyRoleId"]?.toString() !== directorPartyRoleId.toString()) ?"empty":null
      }
    }
    let stateRef = promoterDetails.members;
    stateRef[activeMemberIndex] = {
      ...stateRef[activeMemberIndex],
      ...allValues
    };

    setPromoterDetails({
      ...promoterDetails,
      members: stateRef
    });
    form.validateFields().then((res) => {
      debounceAndSaveToFirestore({
        inquiryId: Number(loanId),
        data: {
          users: stateRef.map((userObj) => _.omitBy(userObj, _.isUndefined))
        }
      });
    }).catch(({ errorFields }) => {
      if (errorFields?.length) {
        return
      }
      debounceAndSaveToFirestore({
        inquiryId: Number(loanId),
        data: {
          users: stateRef.map((userObj) => _.omitBy(userObj, _.isUndefined))
        }
      });
    })
  }

  const handleFileUpload = async ({ file }: any, type: DocumentTypes) => {
    if (isLoading) return;
    if (!_.isNull(activeMember.aadhar) && !_.isNull(activeMember.pan)) {
      if ([activeMember.aadhar?.name, activeMember.pan?.name].includes(file.name)) {
        return message.error("File Already Uploaded")
      }
    }
    setFileUploadLoader({
      ...fileUploadLoader,
      [type]: true
    });

    if (activeMember[type]?.key?.length) {
      deleteFileInStorageAndDB(activeMember[type].key);
    }
    const uploadResponse = await uploadAttachmentsAndSaveToDB({ file });

    if (uploadResponse) {
      handleValuesChange({ [type]: uploadResponse }, {
        ...activeMember,
        [type]: uploadResponse,
        [`${type}Id`]: uploadResponse.id
      });
    }
    setFileUploadLoader({
      ...fileUploadLoader,
      [type]: false
    });
  }

  // const deleteUser = () => {

  // }

  const verifyAadharFunc = async (otpArr: string[]) => {
    const otp = otpArr.join("");
    const verifiedDetails = await verifyAadhar({
      otp,
      client_id: modalProps.client_id
    });
    if (verifiedDetails) {
      // await upsertAtFirestore(Number(loanId), {
      //   isAadharVerified:true
      // })
      const { full_name, dob, zip, address: { house, street, vtc, loc, dist, country }, gender } = verifiedDetails;
      // const 
      handleValuesChange({
        isAadharVerified: true,
        name: full_name,
        dob: new Date(dob),
        permanentAddress: `${house}, ${street}, ${vtc}, ${loc}, ${dist}, ${country}, ${zip}.`,
        gender:gender==="M"?"Male":"Female"
      }, {
        ...activeMember,
        isAadharVerified: true,
        name: full_name,
        dob: new Date(dob),
        permanentAddress: `${house}, ${street}, ${vtc}, ${loc}, ${dist}, ${country}, ${zip}.`,
        gender: gender === "M" ? "Male" : "Female"
      });
    }
    message.success("Aadhar Verified Successfully");
    closeModal();
  }
  // const removeFile = async (file: fileInterface) => {
  //   if (isLoading) return
  //   setIsLoading(true);
  //   await deleteFile(file.key);
  //   let filteredList = uploadedFileList.filter((fl) => fl.key !== file.key);
  //   setUploadFileList(filteredList);
  //   setIsLoading(false);
  // }

  // console.log(contactlist, 'contactlist')

  const closeModal = () => {
    setModalProps({
      ...modalProps,
      open: false,
      for: ""
    })
  }

  return (
    <Loader isLoading={isLoading}>
      <div className='block  overflow-x-hidden '>
        <Row className='block bg-[#F3F9FF] p-5 my-1 rounded-[11px]'>
      
            <Space className='flex justify-end items-end mb-4'>
            
            <Button onClick={handleAddContact} className='bg-[#4E6ACB] text-[#fff] h-[40px]'> Add Party to Application</Button>
            </Space>

          <Space wrap className='grid grid-cols-4 gap-6 max-mobile:grid-cols-1'>
            {promtersList?.map(({ name, partyRoleId }, index: number) => {
              return <CompanyUsersIndividualComp
                name={name}
                partyRoleId={partyRoleId}
                designations={promoterDetails.designations}
                key={index}
                isActive={activeMemberIndex === index}
                onClick={() => {
                  SetActiveMemberIndex(index)
                }}
                hasError={Boolean(errors["users"][index])}
                status={status}
              />
            })}
          </Space>
        </Row>
        <Form
          layout='vertical'
          disabled={disabled?.users}
          fields={[
            {
              name: ["partyRoleId"],
              value: activeMember?.partyRoleId
            },
            {
              name: ["dinNumber"],
              value: activeMember?.dinNumber
            },
            {
              name: ["name"],
              value: activeMember?.name
            },
            {
              name: ["shareHolding"],
              value: activeMember?.shareHolding
            },
            {
              name: ["aadharNumber"],
              value: activeMember?.aadharNumber
            },
            {
              name: ['panNumber'],
              value: activeMember?.panNumber
            },
            {
              name: ["email"],
              value: activeMember?.email
            },
            {
              name: ["phoneNumber"],
              value: activeMember?.phoneNumber
            },
            {
              name: ["gender"],
              value: activeMember?.gender
            },
            {
              name: ["dob"],
              value: activeMember?.dob ? dayjs(new Date(activeMember?.dob).getTime()) : null
            },
            {
              name: ["motherName"],
              value: activeMember?.motherName
            },
            {
              name: ['fatherOrSpouseName'],
              value: activeMember?.fatherOrSpouseName
            },
            {
              name: ["currentAddress"],
              value: activeMember?.currentAddress
            },
            {
              name: ["permanentAddress"],
              value: activeMember?.permanentAddress
            },
            {
              name: ["aadhar"],
              value: activeMember?.aadhar
            },
            {
              name: ["pan"],
              value: activeMember?.pan
            },
            {
              name: ['linkedInUrl'],
              value: activeMember?.linkedInUrl
            },
            // {
            //   name: ['AddDetails'],
            //   value: ''
            // }

          ]}
          // disabled={isloanApplicationEditable()}
          form={form}
          onValuesChange={handleValuesChange}
        >
          <Row className=' grid grid-cols-3 gap-10 max-mobile:grid-cols-1'>
            <Col>
              <AntdInputAbstract
                FormItemsProps={{
                  label: "Designation",
                  name: "partyRoleId",
                  // rules: [
                  //   {
                  //     required: true,
                  //     message: "Please select Inquiry Source"
                  //   }
                  // ],
                }}
                type='select'
                ElementProps={{
                  className: "text-left",
                  showSearch: true,
                  options: promoterDetails.designations,
                  placeholder: 'Select Promoter Designation'
                  // children: optionElements(countries)
                }}
              />
            </Col>
            { (activeMember?.partyRoleId?.toString()===directorPartyRoleId.toString())&&<Col>
              <AntdInputAbstract
                FormItemsProps={{
                  label: "DIN Number",
                  name: "dinNumber",
                }}
                type='text'
                ElementProps={{
                  className: "text-left ",
                  placeholder: "Enter Member's DIN Number"
                }}
              />
            </Col>}
            <Col>
              {/* <AntdInputWithLabel type='text' label='Name' name='Name' /> */}
              <AntdInputAbstract
                FormItemsProps={{
                  label: " Name",
                  name: "name",
                  // rules: [
                  //   {
                  //     required: true,
                  //     message: "Please select inquiry Date field "
                  //   }
                  // ],
                }}
                type='text'
                ElementProps={{
                  className: "text-left ",
                  placeholder: "Enter Member's Name",
                  disabled: true
                }}
              />
            </Col>
          </Row>
          <Row className=" grid grid-cols-3 gap-10 max-mobile:grid-cols-1">
            <Col>
              {/* <AntdInputWithLabel type='text' label='Share Holding' name='Share Holding' addonAfter="%" /> */}
              <AntdInputAbstract
                FormItemsProps={{
                  label: "Share Holding",
                  name: "shareHolding",
                  rules: [
                    {
                      validator:(_,value)=>checkShareHoldingPercentage(promoterDetails.members)
                    }
                  ]
                  // rules: [
                  //   // {
                  //   //   max: 100,
                  //   //   message: "Max share percentage is 100%"
                  //   // },
                  //   {
                  //     type: 'number',
                  //     message: "only numbers formats are allowed"
                  //   },
                  //   {
                  //     validator: shareHoldingValidation,
                  //     // message: 'Please enter a valid Indian phone number.'
                  //   }
                  //   // {
                  //   //   min: 0,
                  //   //   message:"Share Percentage should not be less than 0"
                  //   // }
                  // ],
                }}
                type='number'
                ElementProps={{
                  className: "text-left w-full ",
                  addonAfter: '%',
                  placeholder: "Enter Member's Share Holding %"
                }}
              />
            </Col>
            <Col className='relative'>
              <AntdInputAbstract
                FormItemsProps={{
                  label: "Aadhar Number",
                  name: "aadharNumber",
                  // rules: [
                  //   {
                  //     required: true,
                  //     message: "Please Fill Aadhar Number field"
                  //   }
                  // ],
                }}
                type='text'
                ElementProps={{
                  className: "text-left addonAfter ",
                  placeholder: "Enter Member's Aadhar Number",
                  disabled: Boolean(activeMember?.isAadharVerified),
                  addonAfter: <div
                    className='flex'
                  >  {activeMember?.isAadharVerified ? <CheckCircleTwoTone twoToneColor="#52c41a" className='absolute left-[-20px]'/> : <></>}
                      <p className='px-3 text-[#fff] cursor-pointer' onClick={() => (!activeMember?.isAadharVerified && !disabled?.users) ? TriggerVerificationAPICall("aadhar") : undefined}>{activeMember?.isAadharVerified ? "Edit" : "Verify"}</p></div>
                }}
              />
            </Col>
            <Col className=''>
              <AntdInputAbstract
                FormItemsProps={{
                  label: "PAN Card Number",
                  name: "panNumber",
                  // rules: [
                  //   {
                  //     required: true,
                  //     message: "Please Fill PAN Card Number field "
                  //   }
                  // ],
                }}
                type='text'
                ElementProps={{
                  className: "text-left addonAfter ",
                  placeholder: "Enter Member's PAN Number",
                  disabled: activeMember?.isPanVerified,
                  addonAfter: <p
                    className={`px-3 text-[#fff] ${(activeMember?.isPanVerified || disabled?.users) ? "cursor-not-allowed" : "cursor-pointer"}`}
                    onClick={() => (!activeMember?.isPanVerified && !disabled?.users) ? TriggerVerificationAPICall("pan") : undefined}
                  >{activeMember?.isPanVerified ? "Verified" : "Verify"}</p>
                }}
              />
            </Col>
          </Row>
          <Row className=" grid grid-cols-3 gap-10 max-mobile:grid-cols-1">
            <Col className=''>
              {/* <AntdInputWithLabel id='Email' type="text" label="Email" name="Email" placeholder="" /> */}
              <AntdInputAbstract
                FormItemsProps={{
                  label: "Email",
                  name: "email",
                  rules: [
                    ...arraySpreading([{
                      type: 'email',
                      message: 'Invalid Email Format'
                    },
                      {
                        validator: (_:any, value:any) => checkUniqueEmailOrPhoneNumber(value, [...promoterDetails.members], "email", activeMemberIndex)
                      }],canValidateEmail)
                  ],
                }}
                type='text'
                ElementProps={{
                  className: "text-left ",
                  placeholder: "Enter Member's Email",
                }}
              />
            </Col>
            <Col className=' max-w-full'>
              <AntdInputAbstract FormItemsProps={{
                label: "Phone Number",
                name: "phoneNumber",
                rules: [
                  ...arraySpreading(
                    [
                      {
                        validator: phoneNumberValidation,
                        // message: 'Please enter a valid Indian phone number.',
                      },
                      {
                        validator: (_:any, value:any) => checkUniqueEmailOrPhoneNumber(value, [...promoterDetails.members], "phone number", activeMemberIndex)
                      }
                    ],canValidatePhoneNumber
                  )
                ]
                ,
              }}
                type='number'
                ElementProps={{
                  className: "text-left w-full",
                  placeholder: "Enter Member's Phone Number"
                }} />
            </Col>
            <Col className=''>
              <AntdInputAbstract
                FormItemsProps={{
                  label: "Gender",
                  name: "gender",
                  // rules: [
                  //   {
                  //     required: true,
                  //     message: "Please select Gender field "
                  //   }
                  // ],
                }}
                type='select'
                ElementProps={{
                  placeholder: "Select Member's Gender",
                  className: "text-left",
                  // showSearch: true,
                  options: promoterDetails?.genders.map((g) => ({
                    value: g,
                    label: g
                  })),
                  disabled: true
                }}
              />
            </Col>
          </Row>
          <Row className=' grid grid-cols-3 gap-10 max-mobile:grid-cols-1'>
            <Col >
              <AntdInputAbstract
                FormItemsProps={{
                  label: "Date Of Birth",
                  name: "dob",
                  // rules: [
                  //   {
                  //     required: true,
                  //     message: "Please select Date Of Birth field "
                  //   },
                  //   {
                  //     type: 'date',
                  //     message: 'Please Fill valid Date'
                  //   }
                  // ],
                }}
                type='date'
                ElementProps={{
                  className: "text-left w-full",
                  placeholder: "Enter Member's DOB",
                  disabled: true
                }}
              />
            </Col>
            <Col className=''>
              {/* <AntdInputWithLabel id='Mother’s Maiden Name' type="text" label="Mother’s Maiden Name" name="Mother’s Maiden Name" placeholder="" /> */}
              <AntdInputAbstract
                FormItemsProps={{
                  label: "Mother's Maiden Name",
                  name: "motherName",
                  // rules: [
                  //   {
                  //     required: true,
                  //     message: "Please Fill Mother's Maiden Name field "
                  //   },

                  // ],
                }}
                type='text'
                ElementProps={{
                  className: "text-left ",
                  placeholder: "Enter Member's  Mother Name",
                }}
              />
            </Col>
            <Col className=''>
              {/* <AntdInputWithLabel id='Father / Spouse Name' type="text" label="Father / Spouse Name" name="Father / Spouse Name" placeholder="" /> */}
              <AntdInputAbstract
                FormItemsProps={{
                  label: "Father / Spouse Name",
                  name: "fatherOrSpouseName",
                  // rules: [
                  //   {
                  //     required: true,
                  //     message: "Please Fill Father / Spouse Name field "
                  //   }
                  // ],
                }}
                type='text'
                ElementProps={{
                  className: "text-left ",
                  placeholder: "Enter Member's Father/Spouse Name",
                }}
              />
            </Col>
          </Row>
          <Row className=" grid grid-cols-2 gap-x-10 mt-5 max-mobile:grid-cols-1">
            <Col>
              <AntdInputAbstract
                FormItemsProps={{
                  label: "Permanent Address",
                  name: "permanentAddress",
                  // rules: [
                  //   {
                  //     required: true,
                  //     message: "Please Fill Current Address field "
                  //   }
                  // ],
                }}
                type='textarea'
                ElementProps={{
                  className: "text-left border-[#DFDFDF] border-2",
                  placeholder: "Enter Member's Permanent Address",
                  autoSize: {
                    minRows: 4
                  },
                  disabled: true
                }}
              />
            </Col>
            <Col className="!w-full text-left">
              <Row className="!w-full relative  items-center">
                <div className=" absolute top-0 right-0  max-tablet:mt-5">
                  <Checkbox
                    title='checkBox'
                    type="checkbox"
                    checked={activeMember?.currentAddress === activeMember?.permanentAddress}
                    onChange={(event: CheckboxChangeEvent) => {
                      const isChecked = event.target.checked;
                      setCurrAddress(isChecked)
                      let activeRef: any = {
                        ...activeMember,
                        currentAddress: isChecked ? activeMember?.permanentAddress : ""
                      }
                      handleValuesChange({ currentAddress: isChecked ? activeMember?.permanentAddress : "" },activeRef)

                      // const stateRef = promoterDetails.members;

                      // stateRef[activeMemberIndex] = activeRef
                      // setPromoterDetails({
                      //   ...promoterDetails,
                      //   members: stateRef
                      // });
                      // setPromoterDetails({
                      //   ...companyDetails,
                      //   communicationAddress: isChecked ? companyDetails.registrationAddress : "",
                      // })
                      // setCompanyDetails
                    }}
                  />
                  <label className="ml-2">Same as Permanent Address</label>
                </div>
                <div className='w-full'>
                  <AntdInputAbstract
                    FormItemsProps={{
                      label: "Current Address",
                      name: "currentAddress",
                      
                      // rules: [
                      //   {
                      //     required: true,
                      //     message: "Please Fill Permanent Address field "
                      //   }
                      // ],
                    }}
                    type='textarea'
                    ElementProps={{
                      className: "border-[#DFDFDF] border-2 text-left !w-full",
                      placeholder: "Enter Member's Current Address",
                      autoSize: {
                        minRows: 4
                      },
                      disabled: Boolean(currAddress)
                    }}
                  />
                </div>

              </Row>
            </Col>
          </Row>
          <Row className=" grid grid-cols-2 gap-x-10 mt-5 max-mobile:grid-cols-1">
            <Col >
              {/* <AntdInputWithLabel type='inputWithuploadAddonAfter' label='Upload Aadhar' name='Upload Aadhar' icon={uploadIcon} /> */}
              <AntdInputAbstract
                FormItemsProps={{
                  label: "Upload Aadhar",
                  name: "aadhar",
                  // rules: [
                  //   {
                  //     required: true,
                  //     message: "Please Fill Upload Aadhar field "
                  //   }
                  // ],
                }}
                type='upload'
                ElementProps={{
                  uploadProps: {
                    customRequest: (e: any) => handleFileUpload(e, "aadhar"),
                    multiple: false,
                    showUploadList: false,
                    disabled: disabled?.users
                  },
                  ...activeMember?.aadhar?.url?.length && {
                    children: <a target='_blank' rel='noreferrer' href={activeMember?.aadhar?.url}>{activeMember?.aadhar?.name}</a>
                  },
                  inProgress: fileUploadLoader["aadhar"]
                  // className: "text-left ",
                  // icon: uploadIcon
                }}
              />
            </Col>
            <Col >
              {/* <AntdInputWithLabel type='inputWithuploadAddonAfter' label='Upload PAN' name='Upload PAN' icon={uploadIcon} /> */}
              <AntdInputAbstract
                FormItemsProps={{
                  label: "Upload PAN",
                  name: "pan",
                  // rules: [
                  //   {
                  //     required: true,
                  //     message: "Please Uplaoad Upload PAN field "
                  //   }
                  // ],
                }}
                type='upload'
                ElementProps={{
                  uploadProps: {
                    customRequest: (e: any) => handleFileUpload(e, "pan"),
                    multiple: false,
                    showUploadList: false,
                    disabled: disabled?.users
                  },
                  ...activeMember?.pan?.url && {
                    children: <a target='_blank' rel='noreferrer' href={activeMember?.pan?.url}>{activeMember?.pan?.name}</a>
                  },
                  inProgress: fileUploadLoader["pan"],
                  // iconProps: {
                  //   ...activeMember.pan?.url && {
                  //     src:closeIcon
                  //   }
                  // }
                }}
              />
            </Col>
          </Row>
          <Row className=" grid grid-cols-2 gap-x-6 mt-5 max-mobile:grid-cols-1">
            <Col >
              {/* <AntdInputWithLabel label='LinkedIn' type='text' name='LinkedIn' /> */}
              <AntdInputAbstract
                FormItemsProps={{
                  label: "LinkedIn",
                  name: "linkedInUrl",
                  // rules: [
                  //   {
                  //     required: true,
                  //     message: "Please Fill LinkedIn field "
                  //   }
                  // ],
                }}
                type='text'
                ElementProps={{
                  className: "text-left ",
                  placeholder: "Enter Member's Linked Profile URL",
                }}
              />
            </Col>
          </Row>
          <Row>
            {/* <AntdInputWithLabel placeholder='Add Details' type='button' name='Add Details' className='text-left text-[16px] font-[400]  w-[130px] h-[45px] ' /> */}
            {/* <AntdInputAbstract
              FormItemsProps={{
                name: "AddDetails",
                rules: [
                  {
                    required: false,
                    message: "Please select AddDetails field "
                  }
                ],
              }}
              type='button'
              ElementProps={{
                className: 'text-left text-[#fff] text-[16px] font-[400]  w-[130px] h-[45px] bg-[#4E6ACB] ',
                children: 'Add Detail'
              }}

            /> */}
          </Row>
        </Form>
      </div >
      <Modal destroyOnClose closable={false} okButtonProps={{
        className: "bg-[#4E6ACB]"
      }} centered open={modalProps.open} footer={null} onCancel={closeModal}>
        {
          modalProps?.for === "loading" ? <Spin /> : <OTPVerificationScreen
            length={6}
            descritpion={modalProps.for === "aadhar" ? verifyServicesDescriptions.aadhar : verifyServicesDescriptions.pan}
            expirationTime={modalProps.expirationTime}
            verifyOTpFunc={(otpArr) => verifyAadharFunc(otpArr)}
            cancelAction={closeModal}
          />
        }
      </Modal>
    </Loader>
  )
}

export default PromotersAndDirectors