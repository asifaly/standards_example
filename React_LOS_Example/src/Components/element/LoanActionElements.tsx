import { Button, Modal, Space, message } from 'antd'
import React, { useState } from 'react'
import { useLoanDetails } from '../../Context/loanContext'
import { APIEndpoints, PutAction } from '../../Services/backend/functions'
import { useApiCall } from '../../Hooks/apicall'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../redux/store/store'
import { resetLoanApplicationErrors, setLoanApplicationErrors } from '../../redux/loanApplicationReducer'
// import Paragraph from 'antd/es/typography/Paragraph';
import {Typography} from 'antd'
import { isKrediqUser } from '../../Services/helpers/loanApplication'
import { createSelector } from '@reduxjs/toolkit'
import { Statuses, customerActionButtonStatuses, krediqActionButtonStatuses } from '../../configs/common'
import { statustoRouteNames } from '../../Services/helpers/common'
import _ from 'lodash'
import DraftComponent from './DraftComponent'

const actionButtonClassName = "bg-[#4E6ACB] text-[#fff] h-[45px]"

const LoanActionElements = () => {
    const {Title}=Typography
    const { state } = useLoanDetails();
    const reduxState = createSelector(
        [(state) => state.userDetails["userDetails"]],
        (userDetails) => userDetails || {} // Ensure that 'errors' is always defined
    );
    const userDetails = useAppSelector(reduxState);
    const formState = useAppSelector((state) => state.loanDetails.formState);
    const dispatch = useAppDispatch();
    const [searchParams] = useSearchParams();
    const loanId = searchParams.get('id');
    const status:any = state.status;
    const [modalProps, setModalProps] = useState <{open:boolean,message:undefined|string}>({
        open: false,
        message: ""
    });
    const navigate = useNavigate();
    const { isLoading, APIFunc } = useApiCall({
        method: "PUT"
    });
    const loadingOccurence = isLoading || (formState === "draft");

    const navigateToTableList = () => {
        const name = _.has(statustoRouteNames, status) ? status : "inquiries";
        const param = statustoRouteNames[name]
        navigate("/dashboard/" + param);
    }
    const statusChangeFunc = async (action: string,isConfirmed:boolean=false) => {
        const response = await APIFunc({
            endpoint: APIEndpoints.statusChange,
            headerProps: {
                token: true,
                ...isConfirmed && {
                    options: {
                        isconfirmed: true
                    }
                }
            },
            body: {
                inquiryId: Number(loanId),
                action
            }
        });
        setModalProps({
            ...modalProps,
            open: false
        })
        if (response.success) {
            message.success("Status Changed");
            // navigate("/dashboard/"+status);
            navigateToTableList();
        }
        else if(response?.errors) {
            dispatch(setLoanApplicationErrors(response.errors));
        }
        else if (response?.type === "userDuplicate") {
            // setOpenModal(true);
            setModalProps({
                open: true,
                message:response?.message
            })
        }
        else {
            message.error(response?.message);
        }
    }

    const SentToCustomer = () => {
        return (
            <Button disabled={loadingOccurence}
                onClick={() => statusChangeFunc("sentToCustomer")}
                className={actionButtonClassName}>Send To Customer</Button>
        )
    }

    const Submit = () => {
        return (
            <Button
                disabled={loadingOccurence}
                onClick={() => statusChangeFunc("submitted")}
                className={actionButtonClassName}>Submit</Button>
        )
    }
    const ApproveRejectOfferAPF = () => {
        return (
            <Space className=''>
                <Button disabled={loadingOccurence} onClick={() => statusChangeFunc("loanRejected")} className='h-[45px]' danger>Reject</Button>
                <Button disabled={loadingOccurence} onClick={() => statusChangeFunc("offerAPF")} className='h-[45px]'>Offer APF</Button>
                <Button disabled={loadingOccurence} onClick={() => statusChangeFunc("customerApproval")} className={actionButtonClassName}>Approve</Button>

            </Space>
        )
    }
    const AcceptReject = () => {
        return (
            <Space>
                <Button disabled={loadingOccurence} onClick={() => statusChangeFunc("customerRejected")} className='h-[45px]' danger>Reject</Button>
                <Button disabled={loadingOccurence} onClick={() => statusChangeFunc("customerAccepted")} className={actionButtonClassName}>Accept</Button>
            </Space>
        )
    }

    const Complete = () => {
        return (
            <Button onClick={() => statusChangeFunc("completed")} disabled={loadingOccurence} className={actionButtonClassName}>Complete</Button>
        )
    }
    const statusToActionComponent: any = {
        application: <SentToCustomer />,
        sentToCustomer: <Submit />,
        submitted: <ApproveRejectOfferAPF />,
        customerApproval: <AcceptReject />,
        // customerApproval:<AcceptReject />,
        customerAccepted: <Complete />,
    }
    const ActionButton = statusToActionComponent[state.status] || <></>
    const actionButtons = isKrediqUser(userDetails.userTypeId) ? krediqActionButtonStatuses : customerActionButtonStatuses;
    const showActionButton = actionButtons.includes(Statuses[state?.status]);

    return (
        <Space>
            <DraftComponent />
            <div className='w-[1px] border border-collapse border-gray-100 h-[45px] bg-black'></div>
            <Button
                className='h-[45px] px-6'
                onClick={navigateToTableList}
            >Exit</Button>
            {showActionButton && ActionButton}
            <Modal
                open={modalProps.open}
                onCancel={() => setModalProps({
                ...modalProps,
                open:false
                })}
                destroyOnClose={true}
                closable={false}
                okButtonProps={{
                    className:"bg-[#4E6ACB]"
                }}
                centered
                onOk={() => statusChangeFunc("sentToCustomer",true)}
            >
                <Space>
                    <Title className='opacity-70' level={5}>{modalProps.message}.Do you want to add anyway?</Title>
                    {/* <Text></Text> */}
                </Space>
            </Modal>
        </Space>
    )
}

// const pageToActionComponents: any = {
//     "new-application": <SentToCustomer />,
//     "sent-to-customer":<Submit />,
//     "submitted": <ApproveRejectOfferAPF />,
//     "completed": ,
//     "customer-approval": "Customer Approval",
//     // "inquiries": "Inquiry"
// }
export default LoanActionElements