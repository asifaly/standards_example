import { Button, Col, FormInstance, Row, Select, message } from 'antd'
import React, { FormEvent, FormEventHandler, useEffect, useState } from 'react'
import { AntdInputAbstract } from '../../Components/element/inputwithlable'
import ColumnGroup from 'antd/es/table/ColumnGroup'
import companyDetails from '../../Context/inquirycompanyDetail.json'
import { type } from 'os'
import { TableComponent } from '../../Components/Table/table'
import { columnsData, Bodydata } from '../../Components/Table/contactData'
import { isVisible } from '@testing-library/user-event/dist/utils'
import { Typography, Form } from 'antd'
import { gstiHeader } from './table'
import { useInquiryDetails } from '../../Hooks/inquiryDetails'
import { documentFormat } from '../../Services/firebase/query'
// import { useForm } from 'antd/es/form/Form'
import moment from 'moment'
import { inquiryCases } from '../../Context/inquiryContext'
import { useConfigurations } from '../../Hooks/configurations';
import _ from "lodash";
import { useApiCall } from '../../Hooks/apicall'
import { APIEndpoints } from '../../Services/backend/functions'
// import { isPanNumberPresent } from '../../Services/helpers/loanApplication'

type companyDetailsType = {
    inquiryForm: FormInstance
}

function CompanyDetails({inquiryForm}: companyDetailsType) {
    const { Paragraph } = Typography;
    const { state, dispatch } = useInquiryDetails();
    const { state: { configurations } } = useConfigurations();
    const transformedConfigurationObject = _.reduce(
        configurations,
        (result: any, item: any) => {
            result[item.name] = item.values;
            return result;
        },
        {}
    );
    const { inquiryDetails, isNewInquiry, gsts } = state;
    // const [form] = Form.useForm();

    const [isShowTableTriggered, SetShowTableTriggered] = useState(false);
    const showGSTTable = isShowTableTriggered || Boolean(gsts?.length);

    const { isLoading: gstFetchLoading, APIFunc: fetchGstData } = useApiCall({
        method: "POST"
    });

    // console.log({showGSTTable});
    // console.log({inquiryDetails,preloadData});



    // useEffect(() => {
    //     // form.setFieldValue("inquiryNum", documentFormat(inquiryDetails?.id || 0));
    //     if (!isNewInquiry) {
    //         form.setFieldsValue({
    //             inquiryNum: documentFormat(inquiryDetails?.id || 0),
    //             inquirySource: inquiryDetails?.inquirySource,
    //             dateOfInquiry: inquiryDetails?.createdAt ? moment(inquiryDetails?.createdAt).format("Do MMM YY") : "",
    //             financingType: inquiryDetails?.financingType,
    //             panNumber: inquiryDetails?.panNumber,
    //             industryType: inquiryDetails?.industryType,
    //             businessType: inquiryDetails?.businessType,
    //             partyName: inquiryDetails?.partyName,
    //             address: inquiryDetails?.address,
    //             incorporationType: inquiryDetails?.incorporationType
    //         })
    //     }
    // }, [inquiryDetails, form, isNewInquiry]);


    const fetchGsts = async () => {
        if (!inquiryDetails?.panNumber) {
            return inquiryForm.setFields([
                {
                    name: "panNumber",
                    errors:["Please enter Pan Number"]
                }
            ])
        }
        const response = await fetchGstData({
            endpoint: APIEndpoints.fetchGSTDataOfParty,
            body: {
                panNum: inquiryDetails?.panNumber,
                ...isNewInquiry ? {
                    inquiryKey: localStorage.getItem("inquiryKey"),
                    isNewInquiry:true
                } : {
                        partyId: inquiryDetails?.partyId,
                        inquiryId: inquiryDetails?.id
                }
            },
            headerProps: {
                token: true
            }
        });
        // console.log({response});
        if (!response.success) {
            return message.error(response.message);
        }
        dispatch({
            type: inquiryCases.SET_GST,
            payload: {
                gsts: response.data
            }
        });
        SetShowTableTriggered(true);
    }


    const filterOptions = (inputValue: string, option: any) => option.label.toLowerCase().includes(inputValue.toLowerCase())
    const selectHandleChange = (value: any, name: string) => {
        dispatch({
            type: inquiryCases.HANDLE_CHANGE_INQUIRY,
            payload: {
                name,
                value
            }
        })
    }

    return (
        <div>
            <Form
                layout='vertical'
                form={inquiryForm}
                id='inquiryDetailsSubmit'
                onChange={(event: any) => {
                    dispatch({
                        type: inquiryCases.HANDLE_CHANGE_INQUIRY,
                        payload: {
                            name: event.target?.id,
                            value: event.target?.value
                        }
                    })
                }}
                fields={[
                    {
                        name: "financingType",
                        value: inquiryDetails?.financingType
                    },
                    {
                        name: "inquirySource",
                        value: inquiryDetails?.inquirySource
                    },
                    {
                        name: "dateOfInquiry",
                        value: inquiryDetails?.createdAt ? moment(inquiryDetails?.createdAt).format("Do MMM YY") : ""
                    },
                    {
                        name: "panNumber",
                        value: inquiryDetails?.panNumber
                    },
                    {
                        name: "industryType",
                        value: inquiryDetails?.industryType
                    },
                    {
                        name: "businessType",
                        value: inquiryDetails?.businessType
                    },
                    {
                        name: "partyName",
                        value: inquiryDetails?.partyName
                    },
                    {
                        name: "address",
                        value: inquiryDetails?.address
                    },
                    {
                        name: "incorporationType",
                        value: inquiryDetails?.incorporationType
                    },
                    {
                        name: "inquiryNum",
                        value: documentFormat(inquiryDetails?.id || 0)
                    }
                ]}
            >
                <div className='block overflow-x-hidden max-mobile:ml-0'>
                    {
                        !isNewInquiry && <Row className=' grid grid-cols-3 gap-10 max-mobile:grid-cols-1'>
                            <Col>
                                <AntdInputAbstract
                                    FormItemsProps={{
                                        label: "Inquiry No",
                                        name: "inquiryNum"
                                    }}
                                    type='text'
                                    ElementProps={{
                                        className: "text-left ",
                                        placeholder: '',
                                        disabled: true
                                    }}
                                />
                            </Col>
                            <Col>
                                <AntdInputAbstract
                                    FormItemsProps={{
                                        label: "Date of inquiry",
                                        name: "dateOfInquiry",
                                        rules: [
                                            {
                                                required: true,
                                                message: "Please select Inquiry Date "
                                            }
                                        ],
                                    }}
                                    type='text'
                                    ElementProps={{
                                        className: "text-left w-full ",
                                        disabled: true
                                    }}
                                />
                            </Col>
                            <Col>
                                <AntdInputAbstract
                                    FormItemsProps={{
                                        label: "Source of inquiry",
                                        name: "inquirySource",
                                        rules: [
                                            {
                                                required: true,
                                                message: "Please select Inquiry Source"
                                            }
                                        ],
                                    }}
                                    type='select'
                                    ElementProps={{
                                        onChange: (value: any) => selectHandleChange(value, "inquirySource"),
                                        className: "text-left",
                                        showSearch: true,
                                        filterOption: filterOptions,
                                        options: transformedConfigurationObject["Inquiry Sources"] || []
                                        // children: optionElements(countries)
                                    }}
                                />
                            </Col>
                        </Row>
                    }
                    <Row className='grid grid-cols-3 gap-10 max-mobile:grid-cols-1'>
                        <Col>
                            <AntdInputAbstract
                                FormItemsProps={{
                                    label: "Financing Type",
                                    name: "financingType",
                                    rules: [
                                        {
                                            required: true,
                                            message: "Please select Financing Type"
                                        }
                                    ],
                                }}
                                type='select'
                                ElementProps={{
                                    onChange: (value: any) => selectHandleChange(value, "financingType"),
                                    className: "text-left",
                                    showSearch: true,
                                    options: transformedConfigurationObject["Financing Types"] || [],
                                    filterOption: filterOptions,
                                    placeholder: "Select Financing Type"
                                    // children: optionElements(countries)
                                }}
                            />
                        </Col>
                        <Col className=''>
                            <AntdInputAbstract
                                FormItemsProps={{
                                    label: "PAN Number",
                                    name: "panNumber",
                                    rules: [
                                        {
                                            required: true,
                                            message: "Please enter PAN Number"
                                        }
                                    ],
                                }}
                                type='text'
                                ElementProps={{
                                    className: "text-left ",
                                    disabled: !isNewInquiry,
                                    placeholder: "Enter PAN Number"
                                }}
                            />
                        </Col>
                        {
                             <Col className='self-end text-left' >
                                <AntdInputAbstract
                                    FormItemsProps={{
                                        name: "FetchGSTINBtn",
                                        
                                    }}
                                    type='button'
                                    ElementProps={{
                                        className: 'text-center text-[#fff] text-[16px] font-[400] h-[43px] bg-[#4E6ACB] ',
                                        children: isShowTableTriggered ? "Fetched" : 'Fetch GSTIN ',
                                        onClick: fetchGsts,
                                        disabled: isShowTableTriggered,
                                        loading: gstFetchLoading
                                    }}
                                />
                            </Col>
                        }
                    </Row>
                    <Row className=' grid grid-cols-3 gap-10 max-mobile:grid-cols-1'>
                        <Col className=''>
                            <AntdInputAbstract
                                FormItemsProps={{
                                    label: "Type of Incorporation",
                                    name: "incorporationType",
                                    rules: [
                                        {
                                            required: true,
                                            message: "Please select Incorporation Type"
                                        },
                                        {
                                            type: "number"
                                        }
                                    ],
                                }}
                                type='select'
                                ElementProps={{
                                    onChange: (value: any) => selectHandleChange(value, "incorporationType"),
                                    className: "text-left",
                                    placeholder: "Select Incorporation Type",
                                    showSearch: true,
                                    options: transformedConfigurationObject["Incorporation Types"] || [],
                                    filterOption: filterOptions
                                    // children: optionElements(countries)
                                }}
                            />
                        </Col>
                        <Col className=''>
                            <AntdInputAbstract
                                FormItemsProps={{
                                    label: "Type of Business",
                                    name: "businessType",
                                    rules: [
                                        {
                                            required: true,
                                            message: "Please select Business field Type"
                                        }
                                    ],
                                }}
                                type='select'
                                ElementProps={{
                                    onChange: (value: any) => selectHandleChange(value, "businessType"),
                                    className: "text-left",
                                    options: transformedConfigurationObject["Business Types"] || [],
                                    filterOption: filterOptions,
                                    showSearch: true,
                                    placeholder: "Select Business Type"
                                    // children: optionElements(countries)
                                }}
                            />
                        </Col>
                        <Col className=''>
                            <AntdInputAbstract
                                FormItemsProps={{
                                    label: "Industry",
                                    name: "industryType",
                                    rules: [
                                        {
                                            required: true,
                                            message: "Please select Industry Type"
                                        }
                                    ],
                                }}
                                type='select'
                                ElementProps={{
                                    className: "text-left",
                                    onChange: (value: any) => selectHandleChange(value, "industryType"),
                                    showSearch: true,
                                    options: transformedConfigurationObject["Industry Types"] || [],
                                    placeholder: "Select Industry Type"

                                    // children: optionElements(countries)
                                }}
                            />
                        </Col>
                    </Row>
                    <Row className=' grid grid-cols-3 gap-5 max-mobile:grid-cols-1'>
                        <Col className='' >
                            {/* <AntdInputWithLabel
                            id='Company-Name-field'
                            type="text"
                            label="Company Name"
                            name="partyName"
                            placeholder="Enter Party Name"
                        /> */}
                            <AntdInputAbstract
                                FormItemsProps={{
                                    label: "Company Name",
                                    name: "partyName",
                                    rules: [
                                        {
                                            required: true,
                                            message: "Please enter Company Name"
                                        }
                                    ],
                                }}
                                type='text'
                                ElementProps={{
                                    className: "text-left ",
                                    placeholder: "Enter Company Name"
                                }}
                            />
                        </Col>
                        <Col className='col-span-2'>
                            {/* <AntdInputWithLabel
                            id='Address-field'
                            type="textarea"
                            label="Address"
                            name="address"
                            placeholder=""
                        /> */}
                            <AntdInputAbstract
                                FormItemsProps={{
                                    label: "Address",
                                    name: "address",
                                    rules: [
                                        {
                                            required: true,
                                            message: "Please enter Address "
                                        }
                                    ],
                                }}
                                type='textarea'
                                ElementProps={{
                                    className: "text-left ",
                                    placeholder: "Enter Company Address"
                                }}
                            />
                        </Col>
                    </Row>
                </div>
            </Form>
            {
                showGSTTable && <Row className={`mt-10 block text-left`} >
                    <Paragraph className=' text-[22px] font-400 text-[#4E6ACB] '>GSTIN</Paragraph>
                    <TableComponent
                        mobile_CardStyle='grid-cols-2'
                        headers={gstiHeader}
                        bodyData={gsts}
                        isLoading={gstFetchLoading}
                    // isLoading={true}
                    />
                </Row>
            }
        </div>
    )
}

export default CompanyDetails