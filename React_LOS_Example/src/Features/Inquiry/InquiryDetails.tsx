/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { Button, Space, Tabs, message } from 'antd';
import type { TabsProps } from 'antd';
import { Row } from 'antd'
import { Typography } from 'antd'
import CompanyDetails from './CompanyDetails';
import ContactDetails from './contactDetails';
import ActivityDetails from './ActivityDetails';
import { inquiryCases } from '../../Context/inquiryContext';
import { useApiCall } from '../../Hooks/apicall';
import { APIEndpoints } from '../../Services/backend/functions';
import { useInquiryDetails } from '../../Hooks/inquiryDetails';
import { createSearchParams, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Loader from '../../Components/element/loader';
import _ from 'lodash';
import { routeNames } from '../Routes/RouteName';
import { useForm } from 'antd/es/form/Form';
import { ErrorCallback } from 'typescript';
import { current } from '@reduxjs/toolkit';
const { Paragraph } = Typography

function NewInquiry() {
  const { isLoading, APIFunc } = useApiCall({
    method: "GET"
  });
  const { isLoading: saveLoading, APIFunc: saveInquiryDetails } = useApiCall({
    method: "PUT"
  });
  const { APIFunc: createInquiry } = useApiCall({
    method: "POST"
  });

  const [errorLst, setErrorLst] = useState([] as string[]);
  const [isActiveTabHasError, setIsActiveTabHasError] = useState(false)
  const [inquiryForm] = useForm();
  const { dispatch, state } = useInquiryDetails();
  const params = useParams();
  const [searchParams] = useSearchParams();
  const inquiryId = searchParams.get("id");
  const navigate = useNavigate();
  const hasCommentsAndNewInquiry = state?.isNewInquiry && state?.inquiryDetails?.comments?.length > 0;

  useEffect(() => {
    if (inquiryId) {
      fetchInquiryDetails();
    }
    dispatch({
      type: inquiryCases.SET_INQUIRY_TYPE,
      payload: {
        isNewInquiry: !Boolean(inquiryId)
      }
    })
    // return () => {
    //   localStorage.removeItem("inquiryKey")
    // }
  }, []);

  const fetchInquiryDetails = async () => {
    const { success, data, message } = await APIFunc({
      endpoint: APIEndpoints.fetchInquiryDetailsById,
      headerProps: {
        token: true
      },
      query: {
        id: Number(inquiryId)
      }
    });
    if (success) {
      // const {  savedData } = data;
      const { party, gsts, userDetails, ...rest } = data;
      // console.log({rest});
      dispatch({
        type: inquiryCases.SET_INQUIRY_DETAILS_FROM_BACKEND,
        payload: {
          // loadData,
          savedData: {
            ...rest,
            userDetails: userDetails.length > 0 ? userDetails : rest?.inquiryDetail?.email ? [{
              email: rest?.inquiryDetail?.email,
              phoneNumber: rest?.inquiryDetail?.phoneNumber,
              name: rest?.inquiryDetail?.name,
              id: 1
            }] : [],
            partyName: party?.name,
            panNumber: party?.panNumber,
            address: party?.communicationAddress,
            partyId: party?.id
          },
          gstData: gsts
        }
      })
    }

  }

  const onChange = (key: string) => {
    navigate({
      pathname: "/dashboard/inquiry/" + key,
      ...inquiryId && {
        search: createSearchParams({
          id: inquiryId
        }).toString()
      }
    });
  };


  const tabNameComp = (name: string) => {
    return <p className={`${errorLst.includes(name) ? 'text-[#FF4545]' : ''} text-[16px]`}>{name}</p>
  }

  const activeTabErrorChecker = (key: string) => {
        let condition = false;
        switch (key) {
            case "company-details":
                condition = errorLst?.includes('Company Details');
                break;
            case "activities":
                condition = errorLst.includes('Activity Details') 
                break;
            default:
                condition = false;
                break;
        }
        setIsActiveTabHasError(condition)
    }

  useEffect(() => {
        activeTabErrorChecker(params.id || '')
    }, [onChange]);

  const TabObject: any = {
    'Company Details': ['inquirySource', 'financingType', 'partyName', 'businessType', 'dateOfInquiry', 'industryType', 'incorporationType', 'address', 'inquiryNum'],

    'Activity Details': ['inquiryStatus', 'nextActionDate']
  }

  const items: TabsProps['items'] = [
    {
      key: "company-details",
      label: tabNameComp('Company Details'),
      children: <CompanyDetails inquiryForm={inquiryForm} />,
    },
    {
      key: "cp",
      label: tabNameComp('Contact Details'),
      children: <ContactDetails />,
    },
    {
      key: "activities",
      label: tabNameComp('Activity Details'),
      children: <ActivityDetails inquiryForm={inquiryForm}/>,
    },
  ];

  type PositionType = 'right';

  const saveInquiryDetailsToBackend = async () => {
    inquiryForm.validateFields().then(async (res: any) => {
      await saveInquiryBodyDetails();
      setErrorLst([])
    }).catch(({ errorFields }: any) => {
      const mappedErrors = errorFields?.flatMap((err: any) => (
        {name: err.name, error: err.errors}
      ))
      const matchingKeys = Object.entries(TabObject)
          .filter(([key, values]: any) => mappedErrors.some((obj: any) =>
            values.includes(obj.name[0])
          )).map(([key]) => key);
      setErrorLst(matchingKeys)
      if (errorFields?.length) {
        return
      }
    });
  }

  const saveInquiryBodyDetails = async () => {
    const body = {
      ...!state.isNewInquiry && {
        id: state.inquiryDetails.id,
        partyId: state.inquiryDetails.partyId
      },
      partyName: state.inquiryDetails.partyName,
      panNumber: state.inquiryDetails.panNumber,
      inquirySourceId: state.inquiryDetails.inquirySource || 2,
      financingTypeId: state.inquiryDetails.financingType,
      incorporationTypeId: state.inquiryDetails.incorporationType,
      businessTypeId: state.inquiryDetails.businessType,
      industryTypeId: state.inquiryDetails.industryType,
      address: state.inquiryDetails.address,
      statusId: state.inquiryDetails.status,
      nextActionDate: state.inquiryDetails.nextActionDate,
      contactPersons: state?.inquiryDetails?.userDetails?.map(({ name, email, phoneNumber }: any) => ({
        name,
        email,
        phoneNumber
      })),
      ...hasCommentsAndNewInquiry && {
        inquiryKey: localStorage.getItem("inquiryKey")
      }
    }
    const { success, message: resMessage } = await saveInquiryDetails({
      endpoint: state?.isNewInquiry ? APIEndpoints.createInquiryFromOwnSource : APIEndpoints.updateInquiry,
      headerProps: {
        token: true
      },
      body: _.pickBy(body, value => value !== null)
    });
    if (!success) {
      message.error(resMessage);
      return
    }
    message.success(resMessage);
    if (state?.isNewInquiry) {
      navigate(routeNames.inquiry)
    }
  }

  const OperationsSlot: Record<PositionType, React.ReactNode> = {
    right: <Space className=' max-mobile:hidden'>
      <Button
        className='h-[40px] px-6 mb-2'
        form='inquiryDetailsSubmit'
        onClick={() => navigate(routeNames.inquiry)}
      >Exit</Button>
      <Button
        type='primary'
        className='bg-[#4E6ACB] h-[40px] px-6 mb-2'
        form='inquiryDetailsSubmit'
        onClick={saveInquiryDetailsToBackend}
        loading={saveLoading}
      >Save</Button>
    </Space>,
  };


  return (
    <Row className='block w-full'>
      <Paragraph className='text-[#101041] text-left font-400 text-[22px] mb-10'>Inquiry</Paragraph>
      {/* <Col  className={` max-mobile:visible  max-mobile:flex items-center  justify-end mb-2 hidden`}>
        <Paragraph className='text-[#4E6ACB] text-[16px] font-400 mr-5 mt-2 self-center cursor-pointer max-mobile:hidden ' >Discard Changes</Paragraph>
        <Button className=' w-[100px] h-[45px] border-[#4E6ACB] rounded-lg text-[#4E6ACB] text-[16px] mr-5' >Edit</Button>
        <Button className=' w-[100px] h-[45px] bg-[#4E6ACB] rounded-lg text-[#fff] text-[16px] pr-5' >Save</Button>
      </Col> */}
      {/* <Col className='max-mobile:visible  max-mobile:flex  hidden'>
        <Button>Save</Button>
      </Col> */}

      <Loader isLoading={isLoading}>
        <Tabs
          className={isActiveTabHasError ? 'tabError' : ''}
          defaultActiveKey={params?.id || "company-details"}
          activeKey={params?.id || "company-details"}
          items={items}
          onChange={onChange}
          tabBarExtraContent={OperationsSlot}
          // destroyInactiveTabPane={}
        />
      </Loader>
    </Row>
  )
}

export default NewInquiry
// export default InquiryDetailsProvider({
//   children: NewInquiry
// })








