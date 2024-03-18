import React, { memo, useEffect, useState } from 'react'
import { columnsData, Bodydata } from '../../Components/Table/contactData'
import { Button, Col, Form, Row, message } from 'antd';
import { contactUsersData, contactHeader } from './table';
import { AntdInputAbstract } from '../../Components/element/inputwithlable';
import Addicon from '../../Assets/images/addBtn.svg'
import closeIcon from '../../Assets/images/Closebtn.svg'
import { TableComponent } from '../../Components/Table/table';
import { useInquiryDetails } from '../../Hooks/inquiryDetails';
import { inquiryCases } from '../../Context/inquiryContext';
import { useForm } from 'antd/es/form/Form';
import _ from 'lodash';
// import { TableComponents } from '../../Components/Table/tableComponent';

function ContactDetails() {
    const { state: { inquiryDetails } } = useInquiryDetails();
    const users = inquiryDetails?.userDetails || [];
    // console.log({state});
    return (
        <Row className=' max-mobile:block'>
            <TableComponent
                mobile_CardStyle='text-left'
                headers={contactHeader}
                bodyData={users}
            />
            <MemoizedAddContactComponent />
        </Row>
    )
}

const AddContactComponent = () => {
    const { state, dispatch } = useInquiryDetails();
    const [form] = Form.useForm();
    const { newCP, action, inquiryDetails } = state;
    // console.log(inquiryDetails.userDetails );
    const showContactBar = ["ADD", "EDIT"].includes(action);
    const isEditMode = action === "EDIT";
    const isAddMode = action === "ADD";
    // useEffect(() => {
        
    // }, []);

    const handleAddButton = () => {
        dispatch({
            type: inquiryCases.SHOW_ADD_COMP,
            payload: {
                value: isAddMode?"":"ADD"
            }
        });
    }
    const handleSubmit = (values: any) => {
        if (isAddMode) {
            const foundObject = _.find(inquiryDetails.userDetails, (obj: any) => {
                return obj?.email === values?.email || (obj?.phoneNumber === values?.phoneNumber)
            });
            if (foundObject) {
                message.error("User Already Exists");
                return
            }
        }
        // console.log("hey ufsd");
        let newId = inquiryDetails?.userDetails.length? inquiryDetails?.userDetails[inquiryDetails?.userDetails.length - 1].id + 1:1;
        const findUserWithId = (id:string) => _.find(inquiryDetails.userDetails, (obj: any) => obj?.id === id);

        while (findUserWithId(newId)) {
            newId++;
        }
        // while (_.find(inquiryDetails.userDetails, (obj: any) => obj?.id === newId)) {
        //     newId++;
        // }

        const payload = { ...values, id: isEditMode ? newCP?.id : newId };
        dispatch({
            type: isEditMode?inquiryCases.EDIT_CP:inquiryCases.ADD_CP,
            payload
        })
    }
    const handleChange = (event: any) => {
        dispatch({
            type: inquiryCases.HANDLE_CHANGE_CP,
            payload: {
                name: event.target.id,
                value: event.target.value.trim()
            }
        })
    }

    return (
        <div className='w-full'>
            <Col className='text-left'>
                <Button
                    danger={showContactBar}
                    id='AddNewrow'
                    onClick={handleAddButton}
                    className='text-[#4E6ACB] border-none text-[16px] font-[400] '
                >{!showContactBar ? "Add Contact +" : "Undo"}</Button>
            </Col>
            {
                showContactBar && <Row className='text-left mx-auto mt-5 w-full'>
                    <Form
                        form={form}
                        layout={"vertical"}
                        className='w-full'
                        onFinish={handleSubmit}
                        fields={[
                            {
                                name: "email",
                                value: newCP?.email
                            },
                            {
                                name: "name",
                                value: newCP?.name
                            },
                            {
                                name: "phoneNumber",
                                value: newCP?.phoneNumber
                            }
                        ]}
                        initialValues={{
                            name: "",
                            email: "",
                            phoneNumber: ""
                        }}
                        onChange={handleChange}
                    >
                        <Row className='w-full' >
                            <Col span={6}>
                                <AntdInputAbstract
                                    FormItemsProps={{
                                        label: "Name",
                                        name: "name",
                                        rules: [
                                            {
                                                required: true,
                                                message: "Name is required "
                                            }
                                        ],
                                    }}
                                    type='text'
                                    ElementProps={{
                                        className: "text-left border-2 border-[#DFDFDF] mr-5 p-1 rounded w-[230px]",
                                        // onChange: handleInputChange
                                    }}
                                />
                            </Col>
                            <Col span={7}>

                                <AntdInputAbstract
                                    FormItemsProps={{
                                        label: "Email",
                                        name: "email",
                                        rules: [
                                            {
                                                required: true,
                                                message: "Email Id is required "
                                            },
                                            {
                                                type: "email",
                                                message: "Invalid email format",
                                            },
                                        ],
                                    }}
                                    type='text'
                                    ElementProps={{
                                        className: 'border-2 w-full border-[#DFDFDF] mr-5 p-1 rounded w-[230px]',
                                        // onChange: handleChange
                                    }}
                                />
                            </Col>
                            <Col span={7}>

                                <AntdInputAbstract
                                    FormItemsProps={{
                                        label: "Phone Number",
                                        name: "phoneNumber",
                                        htmlFor: "phoneNumber",
                                        // name: 'phoneNumber',
                                        rules: [
                                            {
                                                required: true,
                                                message: "Phone number is required",
                                            },
                                            {
                                                pattern: /^[0-9]{10}$/,
                                                message: "Invalid phone number format",
                                            }
                                        ]
                                    }}
                                    type='text'
                                    ElementProps={{
                                        className: 'border-2 border-[#DFDFDF] mr-5 p-1 rounded w-[230px]',
                                        selectProps: {
                                            options: [
                                                { value: "+1", label: "+1" },
                                                { value: "+91", label: "+91" },
                                            ],
                                            defaultValue: "+91",
                                            disabled: true,
                                            id: "phoneNumberCountryCodeSelect"
                                            // className:"w-5/12"
                                        },
                                        inputProps: {
                                            id: 'phoneNumber',
                                            // name: 'phoneNumber',
                                        },
                                    }}
                                />

                            </Col>
                            <Col span={3} className='flex items-center mt-2 ml-4'>
                                <img
                                    id='new-Contact-Clear'
                                    className='self-center cursor-pointer mr-5'
                                    src={closeIcon}
                                    alt='close icon'
                                    onClick={handleAddButton}
                                />
                                <Button htmlType='submit' className='border-none outline-none flex'>
                                    <img
                                        id='new-Contact-Add cursor-pointer'
                                        className='self-center cursor-pointer'
                                        src={Addicon}
                                        alt='add icon'
                                    />
                                </Button>
                            </Col>
                        </Row>
                    </Form>

                </Row>
            }
        </div>
    )
}

const MemoizedAddContactComponent = memo(AddContactComponent);

export default ContactDetails;