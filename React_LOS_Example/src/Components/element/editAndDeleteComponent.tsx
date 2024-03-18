import { Button, Col, Modal, Row, Space, Typography, Form, message, Tag } from 'antd'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import MyModal from './contactDeleteModal'
import { useDispatch, useSelector } from 'react-redux';
import { values } from 'lodash';
import { useAppDispatch, useAppSelector, } from '../../redux/store/store';
import { AntdInputAbstract } from './inputwithlable';
import _ from "lodash";
import { useApiCall } from '../../Hooks/apicall';
import { APIEndpoints, DeleteAction, PostAction, PutAction } from '../../Services/backend/functions';
import { useUsers } from '../../Hooks/users';
import { usersCases } from '../../Context/usersContext';
import closeIcon from "../../Assets/images/closeIcon.svg";
import { useConfigurations } from '../../Hooks/configurations';
import { configurationCases } from '../../Context/configurationsContext';
import { useInquiryDetails } from '../../Hooks/inquiryDetails';
import { inquiryCases } from '../../Context/inquiryContext';
import dustbinIcon from "../../Assets/images/dustbin.svg";
import closeIconOutline from "../../Assets/images/closeIcon.svg";
import { arraySpreading } from '../../Services/helpers/loanApplication';


interface CancelAndSaveButtonProps {
    confirmAction?: ((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void) | undefined,
    cancelAction?: ((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void) | undefined,
    formId?:string,
    cancelText?:any,
    okText?: any,
    modelFor?:string
    // modelFor: string,
    // setModelOpenFor?:Dispatch<SetStateAction<string>>
}

interface UserDeleteFormProps{
    // closeModal: () => void,
    data:Record<string,any>,
    confirmAction:(data:Record<string,any>)=>void
    cancelAction: () => void,
    // closeModal: Dispatch<SetStateAction<string>>
    
}

interface UserEditFormProps {
    data: Record<string, any>,
    modelFor: string,
    closeModal: Dispatch<SetStateAction<string>>,
    // closeModal: ()=>void,
    isEdit?: boolean,
    cancelAction: () => void
}

interface ConfigurationForomComponentProps{
    data: Record<string, any>,
    
}

const { Paragraph } = Typography;

// export const EditAndDeleteComponent = (val: any) => {
//     // console.log({val});
//     const [statevalue, setstatevalue] = useState(true);
//     // console.log({statevalue});
//     const dispatch = useAppDispatch()

//     // console.log(fieldData, 'fieldData')

//     const handleclose = () => {
//         setstatevalue(true)
//     }
//     const handleEdit = (e: any) => {
//         console.log(e)
//         dispatch(contactDetails_Data(e))
//     }
//     const handleDelete = (e: any) => {
//         setstatevalue(false)
//     }
//     return (
//         <Row className='flex px-2'>
//             {statevalue ? <Col className=' flex'>
//                 <Button onClick={(e) => handleEdit(val.props)} className='w-[73px] items-center mx-auto text-[10px] text-[#FFF] p-1 rounded-lg bg-[#4E6ACB] mr-4 max-laptop:mr-0 max-tablet:mr-2 max-mobile:mr-2 mb-3'>Edit</Button>
//                 <Button onClick={(e) => handleDelete(val.props)} className='w-[73px] items-center mx-auto text-[10px] text-[#4E6ACB] p-1 rounded-lg bg-[#FFF] '>Delete</Button>
//             </Col> : <Col>
//                 <MyModal visible={true} onCancel={handleclose} />
//             </Col>}
//         </Row>
//     )
// }

export const EditAndDeleteComponent = (rowValues: any) => {
    const { dispatch,state } = useInquiryDetails();
    
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const { APIFunc } = useApiCall({
        method: "DELETE"
    });
    const handleEdit = () => {
        dispatch({
            type: inquiryCases.SET_CP,
            payload: {
                id:rowValues?.props?.id
            }
        })
    }
    const handleDelete = async() => {
        await APIFunc({
            endpoint:APIEndpoints.deleteCP,
            headerProps: {
                token:true
            },
            query: {
                inquiryId: state?.inquiryDetails?.id,
                email: rowValues?.props?.email
            }
        })
        dispatch({
            type: inquiryCases.DELETE_CP,
            payload: {
                id: rowValues?.props?.id
            }
        });
        setOpenDeleteModal(false);
    }
    return (
        <>
            <div className='flex items-center'>
                <Button onClick={handleEdit} className='text-[#FFF] py-1 px-4 rounded-lg bg-[#4E6ACB] mr-4 max-laptop:mr-0 max-tablet:mr-2 max-mobile:mr-2'>Edit</Button>
                <Button onClick={()=>setOpenDeleteModal(true)} className=' text-[#4E6ACB] py-1 px-4 rounded-lg bg-[#FFF] '>Delete</Button>
            </div>
            <Modal
                open={openDeleteModal}
                onCancel={() => setOpenDeleteModal(false)}
                closable={false}
                centered
                className='!bg-[#F7F7F7] rounded-xl'
                onOk={handleDelete}
                okButtonProps={{
                    // className:"bg-red-600"
                    // danger:true
                    type: "primary",
                    className:"px-6 bg-[#4E6ACB]"
                }}
                destroyOnClose
            >
                <ConfirmationComp />
            </Modal>
        </>
    )
}

const ConfirmationComp = () => {
    return (
        <Space className='flex items-center' direction='vertical'>
            <img
                alt='dustbinIcon'
                src={dustbinIcon}
            />
            <Paragraph className='text-[18px]'>Are you sure to delete the contact details ?</Paragraph>
        </Space>
    )
}

export const EditDeleteComp = (rowValues: Record<string, any>) => {
    const Edit = "edit";
    const Delete = "delete";
    const [modalOpenFor, SetModalOperFor] = useState<any>("");
    const { dispatch } = useUsers();
    const { APIFunc } = useApiCall({
        method:"DELETE"
    })

    const cancelAction = () => {
        SetModalOperFor(false);
    };

    const deleteUser = async (uid:string) => {
        // console.log({uid});
        const response = await APIFunc({
            endpoint: APIEndpoints.fetchUserDetail,
            headerProps: {
                token: true
            },
            query: {
                id: uid
            }
        });
        if (response.success) {
            dispatch({
                type:usersCases.refreshFetch
            })
            SetModalOperFor(false);
        }
        else {
            message.error(response.message);
        }

    }

    return (
        <div key={rowValues?.props?.uid}>
            <Space size={20} className='flex items-center'>
                <Button
                    className='bg-[#4E6ACB]'
                    onClick={() => {
                        SetModalOperFor(Edit);
                    }}
                    type='primary'>Edit</Button>
                <Button
                    className='text-[#4E6ACB] border-[#4E6ACB]'
                    onClick={() => SetModalOperFor(Delete)}
                >Delete</Button>
            </Space>

            <Modal
                destroyOnClose={true}
                open={[Edit, Delete].includes(modalOpenFor)}
                footer={null}
                centered
                closeIcon={<img className='object-cover' alt='closeIcon' src={closeIconOutline} />}
                key={rowValues?.props?.uid}
                onCancel={() => SetModalOperFor("")}
                width={modalOpenFor === Edit ? "60%" : "30%"}
            >
                {
                    modalOpenFor === Edit ? (
                        <UserFormComponent
                            data={rowValues?.props}
                            modelFor={modalOpenFor}
                            closeModal={SetModalOperFor}
                            isEdit={true}
                            cancelAction={cancelAction}
                        />
                    ) : (
                            <UserDeleteConfirm
                                confirmAction={(data: any) => deleteUser(data?.uid)}
                                cancelAction={cancelAction}
                                data={rowValues?.props}
                        />
                    )
                }
            </Modal>
        </div>
    );
};

export const CancelAndSaveButton = ({
    confirmAction,
    cancelAction,
    formId,
    cancelText,
    okText
}: CancelAndSaveButtonProps ) => {
    // const confirmActionButton = modelFor === "edit" ? "Save" : "Yes"
    // const formId :any= (modelFor === "edit") ? `userForm_${data?.uid}` : false
    return (
        <div className='w-full flex justify-center'>
            <Button
                type='dashed'
                onClick={cancelAction}
            >{cancelText}</Button>
            <Button
                type='primary'
                className="bg-[#4E6ACB] !ml-4"
                onClick={confirmAction}
                form={formId}
                htmlType='submit'
            >{okText}</Button>
        </div>
    )
}



export const UserFormComponent = ({ data, isEdit, cancelAction, closeModal,modelFor }: UserEditFormProps) => {
    const { configurations } = useAppSelector(({ configurations }) => configurations);
    const { userTypes } = configurations;
    const { dispatch } = useUsers();
    const { isLoading, APIFunc } = useApiCall({
        method: isEdit ? "PUT":"POST"
    });
    const userRole: any = _.find(userTypes, {
        label: data?.role
    });
    const [form] = Form.useForm();
    const handleSubmit = async (values: any) => {
        let isActive = values?.status === "Active";
        let status = values?.status;
        delete values?.status;
        const body = {
            ...values,
            // phoneNumber:data?.phoneNumber,
            uid: data?.uid,
            isActive
        }
        const updatedResponse = await APIFunc({
            endpoint: APIEndpoints.fetchUserDetail,
            headerProps: {
                token: true
            },
            body
        });
        if (updatedResponse.success) {
            // const roleLabel: any = _.find(userTypes, {
            //     value: body.role
            // })
            dispatch({
                type: usersCases.refreshFetch,
                // payload: {
                //     uid: data?.uid,
                //     user: {
                //         ...values,
                //         status,
                //         role: roleLabel?.label
                //     }
                // }
            });
            closeModal("");
            if (!isEdit) {
                form.resetFields();
            }
            message.success("User Details updated successfully");
        }
        else {
            message.error(updatedResponse.message);
        }
    }

    return (
        <Space direction='vertical' size={"large"} className='w-full'>
            <Typography.Title className='!text-[#4E6ACB] text-center' level={3}>{isEdit?"Edit":"Add"} User</Typography.Title>
            <Form
                disabled={isLoading}
                initialValues={{
                    name: data?.name,
                    email: data?.email,
                    status: data?.status,
                    role: userRole?.value,
                    phoneNumber:data?.phoneNumber
                }}
                
                onFinish={handleSubmit}
                form={form}
                id={`userForm_${data?.uid}`}
                className='px-8'
                layout='vertical'
            >
                <Row className='flex justify-between'>
                    <Col span={11}>
                        <AntdInputAbstract
                            type="text"
                            FormItemsProps={{
                                name: "name",
                                label: "Name",
                                rules: [
                                    {
                                        required: true
                                    }
                                ]
                            }}
                            ElementProps={{
                                placeholder: "Enter user name"
                            }}
                        />
                    </Col>
                    <Col span={11}>
                        <AntdInputAbstract
                            type="text"
                            FormItemsProps={{
                                name: "email",
                                label: "Email",
                                rules: [
                                    {
                                        required: true
                                    },
                                    {
                                        type: "email",
                                        message: 'Invalid Email'
                                    }
                                ]
                            }}
                            ElementProps={{
                                placeholder: "Enter user email"
                            }}
                        />
                    </Col>
                </Row>
                <Row className='flex justify-between'>
                    <Col span={11}>
                        <AntdInputAbstract
                            type='text'
                            FormItemsProps={{
                                name: "phoneNumber",
                                label: "Mobile Number",
                                rules: [
                                    {
                                        required:true
                                    }
                                ]
                            }}
                        />
                    </Col>
                    {/* <Col span={11}>
                        <AntdInputAbstract
                            type="phoneNumber"
                            FormItemsProps={{
                                name: "phoneNumber",
                                label: "Mobile Number",
                                rules: [
                                    {
                                        required: true
                                    }
                                ]
                            }}
                            ElementProps={{
                                selectProps: {
                                    className: "!w-3/12",
                                    disabled:true
                                },
                                inputProps: {
                                    className: "!w-9/12",
                                    // value: "100",
                                    placeholder:'Enter user mobile number'
                                }
                            }}
                        />
                    </Col> */}
                    <Col span={11}>
                        <AntdInputAbstract
                            type="select"
                            FormItemsProps={{
                                name: "role",
                                label: "Role",
                                rules: [
                                    {
                                        required: true
                                    }
                                ]
                            }}
                            ElementProps={{
                                placeholder: "Select user role",
                                options: userTypes || []
                            }}
                        />
                    </Col>
                </Row>
                {/* <Row>
                    <Col span={24}>
                        <AntdInputAbstract
                            type="text"
                            FormItemsProps={{
                                name: "partyName",
                                label: "Company Name",
                                rules: [
                                    {
                                        required: true
                                    }
                                ]
                            }}
                            ElementProps={{
                                placeholder:"Enter user company name"
                            }}
                        />
                    </Col>
                </Row> */}
                <Row>
                    <Col span={14}>
                        <AntdInputAbstract
                            type="radio"
                            FormItemsProps={{
                                name: "status",
                                label: "Status",
                                rules: [
                                    {
                                        required: true
                                    }
                                ]
                            }}
                            ElementProps={{
                                options: [
                                    {
                                        label: "Active",
                                        value: "Active"
                                    },
                                    {
                                        label: "InActive",
                                        value: "InActive"
                                    }
                                ]
                            }}

                        />
                    </Col>
                </Row>
                <CancelAndSaveButton
                    // modelFor={"edit"}
                    cancelAction={cancelAction}
                    // data={data}
                    formId={(modelFor === "edit") ? `userForm_${data?.uid}` : ""}
                    okText={"Save"}
                    cancelText={"Cancel"}
                // setModelOpenFor={setModelOpenFor}
                />
            </Form>
        </Space>
    )
}

export const UserDeleteConfirm = ({  cancelAction, data,confirmAction }: UserDeleteFormProps) => {
    
    return (
        <>
            <Typography.Paragraph className='!text-center w-full py-4 text-[20px]'>Are You sure to delete?</Typography.Paragraph>
            <CancelAndSaveButton
                cancelAction={cancelAction}
                confirmAction={()=>confirmAction(data)}
                modelFor={"delete"}
                okText={"Yes"}
                cancelText={"Cancel"}
            />
        </>

    )
}


export const EditButton = (rowValues: Record<string, any>) => {
    const [openModal, SetOpenModal] = useState(false);
    const closeModal = () => {
        SetOpenModal(false)
    }

    return (
        <div className='flex justify-center'>
            <Button
                className='bg-[#4E6ACB]'
                type='primary'
                onClick={()=>SetOpenModal(true)}
            >Edit</Button>
            <Modal
                open={openModal}
                footer={null}
                onCancel={closeModal}
                // closable={false}
                // afterClose={}
                closeIcon={<img alt='closeIcon' src={closeIconOutline} />}
                destroyOnClose={true}
            >
                <ConfigurationFormComponent
                    closeModal={closeModal}
                    data={rowValues?.props}
                />

            </Modal>
        </div>
    )
}

export const ConfigurationFormComponent = ({ closeModal, data }: any) => {
    const [form] = Form.useForm();
    const isIncorporationModal = data.name === "Incorporation Types";
    const [values, SetValues] = useState(data?.values || []);
    const [formValues, setFormValues] = useState({
        value: "",
        ...isIncorporationModal && {
            code: ""
        }
    });
    // const [value, SetConfigvalue] = useState("");
    // const [code, setCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { dispatch } = useConfigurations();
    const getModelType = () => {
        let formattedValue = formValues.value[0]?.toUpperCase() + formValues.value?.slice(1, formValues.value.length);
        switch (true) {
            case data.name.toLowerCase().includes("business"):
                return {
                    model: "business",
                    type: formattedValue
                }
            case data.name.toLowerCase().includes("industry"):
                return {
                    model: "industry",
                    type: formattedValue
                }
            case data.name.toLowerCase().includes("incorporation"):
                return {
                    model: "incorporation",
                    type: formattedValue,
                    code:formValues.code
                }
            case data.name.toLowerCase().includes("inquiry"):
                return {
                    model: "inquirySource",
                    source: formattedValue
                }
            case data.name.toLowerCase().includes("status"):
                return {
                    model: "status",
                    type: formattedValue
                }
            case data.name.toLowerCase().includes("userType"):
                return {
                    model: "userType",
                    type: formattedValue
                }
            case data.name.toLowerCase().includes("financing"):
                return {
                    model: "finance",
                    type: formattedValue
                }
            case data.name.toLowerCase().includes("documentType"):
                return {
                    model: "documentType",
                    type: formattedValue
                }
            // case data.name.toLowerCase().includes("template"):
            //     return "template"
            default:
                return false;
        }
    }
    const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // SetConfigvalue(event.target.value)
    }
    const addButtonAction = async() => {
        const foundIndex = _.find(values, (item) => {
            return item.label.toLowerCase() === formValues.value[0].toLowerCase();
        });
        if (foundIndex) {
            message.error("Configuration value already present")
        }
        else {
            const body = getModelType();
            if (!body) {
                message.error("Invalid Model type");
                return;
            }
            setIsLoading(true);
            const addedResponse = await PostAction({
                endpoint: APIEndpoints.types,
                headerProps: {
                    token: true
                },
                body: body
            });
            if (addedResponse?.success) {
                SetValues([{
                    label: addedResponse?.data?.type || addedResponse?.data?.source,
                    value: addedResponse?.data?.id
                }, ...values]);
                dispatch({
                    type: configurationCases.refresh
                });
                setFormValues({
                    value: "",
                    code:""
                })
                // SetConfigvalue("");
                // if (isIncorporationModal) {
                //     setCode("");
                // }
                message.success(addedResponse?.message);
            }
            else {
                message.error(addedResponse?.message);
            }
            setIsLoading(false);
        }
    }
    const onRemoveTag = async(index: number) => {
        const indexValue = values[index];
        const query = getModelType();
        if (!query) {
            message.error("Invalid Model type");
            return;
        }
        setIsLoading(true);
        const deletedResponse = await DeleteAction({
            endpoint: APIEndpoints.types,
            headerProps: {
                token: true
            },
            query: {
                model: query.model,
                id: indexValue?.value
            }
        });

        if (deletedResponse?.success) {
            dispatch({
                type: configurationCases.refresh
            });
            SetValues(values.filter((val: any, ind: number) => ind !== index));
            message.success("Configuration Deleted");
        }
        else {
            let isConstraintError = deletedResponse.message === "SequelizeForeignKeyConstraintError";
            if (isConstraintError) {
                message.error("Configuration Already In Use");
            }
            else {
                message.error(deletedResponse?.message);
            }
        }
        setIsLoading(false);

    }
    const handleChange = (changesValues: Record<string, any>, allValues: any) => {
        console.log("hey");
        setFormValues(allValues);
    }
    return (
        <Form
            form={form}
            disabled={isLoading}
            layout='vertical'
            initialValues={{
                name:data?.name
            }}
            onValuesChange={handleChange}
            onFinish={addButtonAction}
            className='py-4'
            autoComplete='off'
            fields={[
                {
                    name: "value",
                    value:formValues.value
                },
                ...arraySpreading({
                    name: "code",
                    value: formValues.code
                },isIncorporationModal)
            ]}
        >
            <Row>
                <Col span={24}>
                    <AntdInputAbstract
                        type='text'
                        FormItemsProps={{
                            name: "name",
                            label: "Configuration",
                            rules: [
                                {
                                    required: true,
                                    message: "Please enter configuration name"
                                }
                            ]
                        }}
                        ElementProps={{
                            disabled:true
                        }}
                    />
                </Col>
            </Row>
           { isIncorporationModal&&<Row>
                <Col span={24}>
                    <AntdInputAbstract
                        type='text'
                        FormItemsProps={{
                            label: "Code",
                            name: "code",
                            rules: [
                                {
                                    required: true,
                                    message: "Please enter Code"
                                }
                            ]
                        }}
                    />
                </Col>
            </Row>}
            <Row>
                <Col span={24}>
                            <AntdInputAbstract
                                type='text'
                                FormItemsProps={{
                                    label: "Values",
                                    name: "value",
                                    rules: [
                                        {
                                            required: true,
                                            message: "Please enter value"
                                        }
                                    ]
                                }}
                                ElementProps={{
                                    addonAfter: <Button type='primary' className='border-none h-[39px] bg-[#4E6ACB] rounded-none' htmlType='submit'>Add</Button>,
                                }}
                            />
                    <Space wrap size={[0, 8]} className='mb-4'>
                        {
                            values.map((val: any, index: number) => (
                                <Tag
                                    className='flex items-center !rounded-[4px] py-1 px-4 text-[13px] bg-[#fff]'
                                    closable
                                    // onClick={() => SetConfigvalue(val?.type)}
                                    onClose={()=>onRemoveTag(index)}
                                    closeIcon={
                                        <img
                                            alt='closeIcon'
                                            src={closeIcon}
                                            className='ml-2'
                                        />
                                    }
                                    key={index}
                                >{val?.label}</Tag>
                            ))
                        }
                    </Space>
                </Col>
                </Row>
            {/* <CancelAndSaveButton
                okText={"Save"}
                cancelText={"Cancel"}
                cancelAction={() => {
                    SetValues(data?.values);
                    form.resetFields();
                    closeModal()
                }}
                confirmAction={closeModal}

            /> */}
        </Form>
    )
}
