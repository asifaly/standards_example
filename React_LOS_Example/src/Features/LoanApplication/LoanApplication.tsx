import { Button, Col, Row, Space, Tabs, TabsProps } from 'antd'
import TabPane from 'antd/es/tabs/TabPane'
import Paragraph from 'antd/es/typography/Paragraph'
import React, { useEffect, useState } from 'react'
import CompanyDetails from './CompanyDetails'
import Promotor from './PromotersAndDirectors'
import BuyerSuppliers from './BuyerSupplier'
import DiscardSaveEditComponent from '../../Components/element/discardSaveEditComponent'
import Attachment from './Attachment'
import { createSearchParams, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { documentFormat } from '../../Services/firebase/query'
import { AttachmentsProviders } from '../../Context/attachmentContext'
import { InternalComments, Remarks } from './Comments'
import { CommentsProviders } from '../../Context/commentsContext'
import LoanActionElements from '../../Components/element/LoanActionElements'
import FlashMessage from '../../Components/FlashMessage';
import { useAppDispatch, useAppSelector } from '../../redux/store/store'
import { loanApplicationErrorTabs, resetLoanApplicationErrors, setDisabledStatus } from '../../redux/loanApplicationReducer'
import { pageToHeadingName } from '../../Services/helpers/common'
import CreditAppraisal from './CreditAppraisal'
import { loanCases, useLoanDetails } from '../../Context/loanContext'
import { Statuses } from '../../configs/common'
import { AuthorizationComp } from '../../Components/HOC/Authorization'
import { useApiCall } from '../../Hooks/apicall'
import { APIEndpoints } from '../../Services/backend/functions'
import Loader from '../../Components/element/loader'
import { arraySpreading, disabledStatusChecker, isKrediqUser } from '../../Services/helpers/loanApplication'
import { createSelector } from '@reduxjs/toolkit'

interface TabNameTextRenderProps {
    name: string,
    key?: loanApplicationErrorTabs
}

function LoanApplication() {
    const params = useParams();
    const [searchParams] = useSearchParams();
    const { isLoading, APIFunc } = useApiCall({
        method: "GET"
    });
    const dispatch = useAppDispatch();
    const reduxState = createSelector(
        [(state) => state.loanDetails, (state) => state.userDetails["userDetails"]],
        (loanDetails, userDetails) => [loanDetails?.errors, userDetails] || {} // Ensure that 'errors' is always defined
    );
    const selector = useAppSelector(reduxState);
    const [errors, userDetails] = selector;
    const { userTypeId } = userDetails;
    // const [{ errors },{userDetails:{userTypeId}}] = useAppSelector(({ loanDetails,userDetails }) => [loanDetails,userDetails]);
    const navigate = useNavigate();
    const { state, dispatch: contextDispatch } = useLoanDetails();

    const loanId = searchParams.get("id");
    // const status = searchParams.get("status") || "";

    const isErrorOcurred = errors.users.length || errors.party.length || errors['credit-appraisal'].length;
    const tabNameComp = ({ name, key }: TabNameTextRenderProps) => {
        const isKeyPresent = key && errors[key].length;
        return <p className={`text-[16px] ${isKeyPresent ? "text-[#FF4545]" : ""}`}>{name}</p>
    }
    const [isActiveTabHasError, setIsActiveTabHasError] = useState(false);

    useEffect(() => {
        activeTabErrorChecker(params?.id || "")
    }, [isErrorOcurred]);

    useEffect(() => {
        fetchLoanApplicationDetails()
        return () => {
            dispatch(resetLoanApplicationErrors({}));
        }
    }, []);

    const fetchLoanApplicationDetails = async () => {
        const { success, data } = await APIFunc({
            endpoint: APIEndpoints.loanApplicationBasicDetails,
            headerProps: {
                token: true
            },
            query: {
                inquiryId: Number(loanId)
            }
        });
        if (success) {
            contextDispatch({
                type: loanCases.SET_LOAN_DETAILS,
                payload: data
            });
            const statusText: keyof typeof Statuses = data?.status || "application"
            dispatch(setDisabledStatus(disabledStatusChecker(Statuses[statusText], userDetails.userTypeId)))
        }
    }

    const statusId = Statuses[state?.status];
    const showCreditApparisalComp = isKrediqUser(userDetails?.userTypeId) ? statusId >= 8 : statusId >= 9
    // const applicationStatus = state?.status.length ? Statuses[state?.status]:false
    // const hasError=use


    const items = [
        {
            key: "company-details",
            label: tabNameComp({
                name: "Company Details",
                key: "party"
            }),
            children: <CompanyDetails />,
            order: 0
        },
        {
            key: "promoters",
            label: tabNameComp({
                name: "Promoters/Directors",
                key: "users"
            }),
            children: <Promotor />,
            order: 1
        },
        {
            key: "buyers-suppliers",
            label: tabNameComp({
                name: "Buyer/Supplier"
            }),
            children: <BuyerSuppliers />,
            order: 2
        },
        {
            key: "attachments",
            label: tabNameComp({
                name: 'Attachment'
            }),
            children: <AttachmentsProviders><Attachment /></AttachmentsProviders>,
            order: 3
        },
        ...showCreditApparisalComp ? [{
            key: "credit-appraisal",
            label: tabNameComp({
                name: "Credit Appraisal",
                key: "credit-appraisal"
            }),
            children: <AttachmentsProviders><CreditAppraisal /></AttachmentsProviders>,
            order: (Statuses[state.status] >= 11) ? -1 : 4
        }] : [],
        ...arraySpreading({
            key: "internal-comments",
            label: tabNameComp({
                name: 'Internal Comments'
            }),
            children: <CommentsProviders><InternalComments /></CommentsProviders>,
            order: 5
        }, isKrediqUser(userTypeId)),
        {
            key: "remarks",
            label: tabNameComp({
                name: 'Remarks'
            }),
            children: <CommentsProviders><Remarks /></CommentsProviders>,
            order: 6
        },
    ];
    const activeTabErrorChecker = (key: string) => {
        let condition = false;
        switch (key) {
            case "promoters":
                condition = errors.users.length > 0;
                break;
            case "company-details":
                condition = errors.party.length > 0;
                break;
            default:
                condition = false;
                break;
        }
        setIsActiveTabHasError(condition)
    }
    const onChange = (key: string) => {
        activeTabErrorChecker(key);
        navigate({
            pathname: "/dashboard/loan-application/" + key,
            ...loanId && {
                search: createSearchParams({
                    id: loanId,
                    // status
                }).toString()
            }
        });
    };

    return (
        <Loader isLoading={isLoading}>
            <Row className='block items-center w-full'>
                <Paragraph className=' text-[#101041] text-[22px] font-[500] text-left'>{pageToHeadingName[state?.status]}</Paragraph>
                <Row className='sticky top-0 z-[1] py-4 bg-[#fff] flex justify-between'>
                    <Col >
                        <Paragraph className='text-[#313131] text-[16px] font-[500] !mb-0'>Loan Application No</Paragraph>
                        <Paragraph className=' text-[#4E6ACB] text-[18px] font-[500] !mb-3 text-left'>{documentFormat(Number(loanId) || 0)}</Paragraph>
                    </Col>
                    <Col className=' flex items-center  justify-end mb-2'>
                        {/* <DiscardSaveEditComponent /> */}
                        <LoanActionElements />
                    </Col>
                </Row>
                <AuthorizationComp><FlashMessage /></AuthorizationComp>
                <Tabs
                    className={`${isActiveTabHasError ? "tabError" : ""}`}
                    defaultActiveKey={params?.id || items[0]["key"]}
                    activeKey={params?.id || items[0]["key"]}
                    items={items.sort((a, b) => a.order - b.order)}
                    onChange={onChange}
                    destroyInactiveTabPane={true}
                />
            </Row>
        </Loader>
    )
}

export default LoanApplication