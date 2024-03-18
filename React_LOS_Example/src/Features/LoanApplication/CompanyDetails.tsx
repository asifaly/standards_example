import { Checkbox, Col, Form, Row } from "antd";
import React, { useEffect, useState } from "react";
import { AntdInputAbstract } from "../../Components/element/inputwithlable";
import { useApiCall } from "../../Hooks/apicall";
import { APIEndpoints } from "../../Services/backend/functions";
import { useNavigate, useSearchParams } from "react-router-dom";
import Loader from "../../Components/element/loader";
import { useConfigurations } from "../../Hooks/configurations";
import GSTVerification from "./GSTVerification";
import { useForm } from "antd/es/form/Form";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { debounceAndSaveToFirestore } from "../../Services/firebase/query";
import { useAppSelector } from "../../redux/store/store";
import { removeErrorsInLoanStore } from "../../Services/helpers/common";
import { createSelector } from "@reduxjs/toolkit";


function CompanyDetails() {
    const [searchParams] = useSearchParams();
    const selectErrors = createSelector(
        [(state) => state.loanDetails],
        (loanDetails) => loanDetails || {} // Ensure that 'errors' is always defined
    );
    const { errors, disabled } = useAppSelector(selectErrors);
    const [form] = useForm();
    if (errors.party.length > 0) {
        form.setFields(errors.party);
        // form.scrollToField(errors.party[0]);
    }
    // useEffect(() => {
    //     if (errors.party.length) {
    //         console.log("hi",errors);
    //         form.setFields(errors.party);
    //     }
    // }, [JSON.stringify(errors.party)])
    const { state: { objectConfigurations } } = useConfigurations();
    const loanId = searchParams.get("id")
    const { isLoading, APIFunc } = useApiCall({
        method: "GET"
    });
    const [companyDetails, setCompanyDetails] = useState({
        panNumber: "",
        financingTypeId: null,
        name: "",
        incorporationTypeId: null,
        businessTypeId: null,
        industryTypeId: null,
        communicationAddress: "",
        registrationAddress: "",
        // isSameAsregistrationAddress:false
    });
    useEffect(() => {
        if (loanId) {
            fetchLoanDetailsById();
        }
    }, []);

    const fetchLoanDetailsById = async () => {
        const { success, data } = await APIFunc({
            endpoint: APIEndpoints.loanPartyDetailsById,
            headerProps: {
                token: true
            },
            query: {
                inquiryId: loanId
            }
        });
        if (success) {
            setCompanyDetails({
                ...companyDetails,
                ...data
            });
        }
    }
    const handleFormChange = (changedValues: any, allValues: any) => {
        setCompanyDetails(allValues);
        removeErrorsInLoanStore({
            tabKey: "party",
            form,
            errors,
            changedValues
        });
        debounceAndSaveToFirestore({
            inquiryId: Number(loanId),
            data: {
                party: allValues
            }
        })
    };

    return (
        <Loader isLoading={isLoading}>
            <Form
                layout="vertical"
                form={form}
                disabled={disabled?.party}
                className=" block w-[100%]"
                onValuesChange={handleFormChange}
                fields={[
                    {
                        name: ["panNumber"],
                        value: companyDetails?.panNumber
                    },
                    {
                        name: ["financingTypeId"],
                        value: companyDetails?.financingTypeId
                    },
                    {
                        name: ["name"],
                        value: companyDetails?.name
                    },
                    {
                        name: ["incorporationTypeId"],
                        value: companyDetails?.incorporationTypeId
                    },
                    {
                        name: ["businessTypeId"],
                        value: companyDetails?.businessTypeId
                    },
                    {
                        name: ['industryTypeId'],
                        value: companyDetails?.industryTypeId
                    },
                    {
                        name: ['communicationAddress'],
                        value: companyDetails?.communicationAddress
                    },
                    {
                        name: ['registrationAddress'],
                        value: companyDetails?.registrationAddress
                    },
                    // {
                    //     name: ["isSameAsregistrationAddress"],
                    //     value: companyDetails?.registrationAddress === companyDetails?.communicationAddress
                    // }

                ]}
            //     onChange={(event) => {
            //         console.log("hi");
            //         const { id, value,checked,name }: any = event.target;
            //         if (name === "isSameAsregistrationAddress") {
            //             setCompanyDetails({
            //                 ...companyDetails,
            //                 ...checked && {
            //                     communicationAddress: companyDetails.registrationAddress,
            //                     // isSameAsregistrationAddress: checked
            //                 }
            //             })
            //         }
            //         else {
            //             setCompanyDetails({
            //                 ...companyDetails,
            //                 [id]: value
            //             })
            //     }

            // }}
            >
                <Row className=" grid grid-cols-3 gap-10 max-mobile:grid-cols-1">
                    <Col>
                        <AntdInputAbstract
                            FormItemsProps={{
                                label: "PAN Number",
                                name: "panNumber",
                            }}
                            type='text'
                            ElementProps={{
                                className: "text-left py-2 !rounded-[4px]",
                                placeholder: "Enter PAN Number",
                                disabled: true
                            }}
                        />
                    </Col>
                    <Col>
                        <AntdInputAbstract
                            FormItemsProps={{
                                label: "Financing Type",
                                name: "financingTypeId",
                            }}
                            type='select'
                            ElementProps={{
                                // defaultValue: "sathish",
                                className: "text-left",
                                showSearch: true,
                                placeholder: "Select Financing Type",
                                options: objectConfigurations["Financing Types"] || []
                            }}
                        />
                    </Col>
                    <Col>
                        <AntdInputAbstract
                            FormItemsProps={{
                                label: "Company Name",
                                name: "name",
                            }}
                            type='text'
                            ElementProps={{
                                className: "text-left ",
                                placeholder: "Enter Company Name"
                            }}
                        />
                    </Col>
                </Row>
                <Row className=" grid grid-cols-3 gap-10 max-mobile:grid-cols-1">
                    <Col>
                        <AntdInputAbstract
                            FormItemsProps={{
                                label: "Type of Incorporation",
                                name: "incorporationTypeId",
                            }}
                            type='select'
                            ElementProps={{
                                className: "text-left",
                                showSearch: true,
                                options: objectConfigurations["Incorporation Types"] || [],
                                placeholder: "Select Incorporation Type"
                            }}
                        />
                    </Col>
                    <Col>
                        <AntdInputAbstract
                            FormItemsProps={{
                                label: "Type of Business",
                                name: "businessTypeId",
                            }}
                            type='select'
                            ElementProps={{
                                className: "text-left",
                                showSearch: true,
                                options: objectConfigurations["Business Types"] || [],
                                placeholder: "Select Business Type"
                            }}
                        />
                    </Col>
                    <Col>
                        <AntdInputAbstract
                            FormItemsProps={{
                                label: "Industry",
                                name: "industryTypeId",
                            }}

                            type='select'
                            ElementProps={{
                                className: "text-left ",
                                showSearch: true,
                                placeholder: "Select Industry Type",
                                // children: optionElements(countries)
                                options: objectConfigurations["Industry Types"] || []
                            }}
                        />
                    </Col>
                </Row>
                <GSTVerification

                />
                <div className=" grid grid-cols-2 gap-x-6 mt-5 max-mobile:grid-cols-1">
                    {/* <Col> */}
                    <AntdInputAbstract
                        FormItemsProps={{
                            label: "Registered Addres",
                            name: "registrationAddress",
                            rules: [
                                {
                                    required: true,
                                    message: "Please Fill Registered Addres field "
                                }
                            ],
                        }}
                        type='textarea'
                        ElementProps={{
                            className: "text-left border-[#DFDFDF] border-2",
                            autoSize: {
                                minRows: 4
                            },
                            placeholder: "Enter Registration Address"
                            // rows: 3,
                            // cols: 50
                        }}
                    />
                    {/* </Col> */}
                    <Col className=" text-left">
                        <Row className=" relative  items-center">
                            <Col className=" absolute top-0 right-0  max-tablet:mt-5">
                                <Checkbox
                                    name="isSameAsregistrationAddress"
                                    checked={companyDetails?.communicationAddress === companyDetails?.registrationAddress}
                                    onChange={(event: CheckboxChangeEvent) => {
                                        const isChecked = event.target.checked;
                                        // setCompanyDetails({
                                        //     ...companyDetails,
                                        //     communicationAddress: isChecked ? companyDetails.registrationAddress : "",
                                        // })
                                        // setCompanyDetails
                                        handleFormChange({ communicationAddress: isChecked ? companyDetails.registrationAddress : "" }, {
                                            ...companyDetails,
                                            communicationAddress: isChecked ? companyDetails.registrationAddress : "",
                                        })
                                    }}
                                />
                                <label className="ml-2">Same as Registered Address</label>
                            </Col>
                            <Col className="w-full">
                                <AntdInputAbstract
                                    FormItemsProps={{
                                        label: "Communication Address",
                                        name: "communicationAddress",
                                        rules: [
                                            {
                                                required: true,
                                                message: "Please Fill Communication Address field "
                                            }
                                        ],
                                    }}
                                    type='textarea'
                                    ElementProps={{
                                        className: "border-[#DFDFDF] !w-full border-2 text-left",
                                        autoSize: {
                                            minRows: 4
                                        },
                                        placeholder: "Enter Communication Address"
                                    }}
                                />
                            </Col>
                        </Row>
                    </Col>
                </div>
            </Form>
        </Loader>
    );
}

export default CompanyDetails;
