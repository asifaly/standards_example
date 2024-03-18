import { Button, Form, Modal, Row, Space, message } from 'antd'
import React, { useState } from 'react'
import { AntdInputAbstract } from '../element/inputwithlable'
import Paragraph from 'antd/es/typography/Paragraph'
import { CancelAndSaveButton } from '../element/editAndDeleteComponent';
import { useForm } from 'antd/es/form/Form';
import cartIcon from "../../Assets/images/shopingIcon.svg";
import { BuyerSellerInterface } from '../../Features/LoanApplication/BuyerSupplier';
import ModalAbstract from '../element/ModalAbstract';
import { useSearchParams } from 'react-router-dom';
import { useApiCall } from '../../Hooks/apicall';
import { APIEndpoints } from '../../Services/backend/functions';
import { validateLimitOfBuyerSellerInput } from '../../Services/helpers/loanApplication';

interface AddEditBuyerSellerComponentProps{
    closeModal: () => void,
    formValues: BuyerSellerInterface,
    buyerSellersList: {
        label: string,
        value:string
    }[],
    setRandomFetcher: React.Dispatch<React.SetStateAction<string>>
    
}

interface BuyerSupplierCardCompProps{
    name: string,
    limit: number | string,
    editBtnClick: () => void,
    deleteBtnClick: () => void,
    id:number
}



export const AddEditBuyerSellerComponent = ({closeModal,formValues,buyerSellersList,setRandomFetcher }: AddEditBuyerSellerComponentProps) => {
    const [form] = useForm();
    const [searchParams] = useSearchParams();
    const loanId = searchParams.get("id");
    const {isLoading,APIFunc} = useApiCall({
        method:"PUT"
    })

    const handleSubmit = async(values: any) => {
        const invoiceResponse = await APIFunc({
            endpoint: APIEndpoints.buyerSellerList,
            headerProps: {
                token: true
            },
            body: {
                inquiryId: Number(loanId),
                isEdit: formValues.isEdit,
                limit: values.limit,
                gstId: values.gstId,
                ...formValues.isEdit && {
                    id: formValues.id
                }
            }
        });
        if (!invoiceResponse.success) {
            return message.error(invoiceResponse?.message);
        }
        setRandomFetcher(Math.random().toString());
        closeModal();
    }
    
    return (
        <Form
            id='buyerSellerForm'
            form={form}
            layout={"vertical"}
            onFinish={handleSubmit}
            className='p-5'
            initialValues={{
                gstId: formValues.gstId,
                limit:formValues.limit
            }}
        >
            <AntdInputAbstract
                type={"select"}
                FormItemsProps={{
                    label: "Name",
                    name: "gstId",
                    rules: [{
                        required: true,
                        message:"Please select buyer/supplier"
                    }]
                }}
                ElementProps={{
                    placeholder: "Please select Buyer/Supplier",
                    options:buyerSellersList
                }}
            />
            <AntdInputAbstract
                type={"number"}
                FormItemsProps={{
                    label: "Limit",
                    name: "limit",
                    rules: [{
                        required: true,
                        // type:"number"
                    }, {
                        validator:validateLimitOfBuyerSellerInput
                    }]
                }}
                ElementProps={{
                    className: "w-full",
                    placeholder: "Enter Limit Value"
                }}
            />
        </Form>
    )
}

export function BuyerSupplierCardComp({ name, limit, id, editBtnClick,deleteBtnClick }: BuyerSupplierCardCompProps) {
    const [open, setOpen] = useState(false);
    const deleteAction = async () => {
        setOpen(true);
    }
    const handleClose = () => {
        setOpen(false);
    }


    return (
        <>
            <Space direction='vertical' className='rounded-[15px] h-full bg-[#F9F9F9] text-left p-7'>
                <img className='w-[47px] h-[47px] mb-2' src={cartIcon} alt='icon' />
                <p className='text[#707070] text-[16px] font-[400]'>{name}</p>
                <p className=' text[#313131] text-[25px] font-[500]'>INR  {limit}</p>
                <Space size={20}>
                    <Button onClick={editBtnClick} className='bg-[#F9F9F9] px-8 text-[#4E6ACB] h-[40px]' >Edit</Button>
                    <Button onClick={deleteAction} danger type='primary' className='h-[40px] px-6'> Delete</Button>
                </Space>
            </Space>
            <ModalAbstract
                closable={false}
                open={open}
                centered
                onCancel={handleClose}
                onOk={deleteBtnClick}
                okText={"Delete"}
            >Are you sure to delete?</ModalAbstract>
        </>
    )
}
