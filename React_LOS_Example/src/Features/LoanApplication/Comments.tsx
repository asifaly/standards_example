import { useEffect, useState } from 'react'
import { useApiCall } from '../../Hooks/apicall'
import { APIEndpoints } from '../../Services/backend/functions';
import { useSearchParams } from 'react-router-dom';
import Comments from '../../Components/Comments/Comments';
import Loader from '../../Components/element/loader';
import { AntdInputAbstract } from '../../Components/element/inputwithlable';
import { Form } from 'antd';
import { commentsCases, useCommentsDetails } from '../../Context/commentsContext';
import dayjs from 'dayjs';
import { debounceAndSaveToFirestore } from '../../Services/firebase/query';
import { Timestamp } from 'firebase/firestore';
import { convertFirestoreTimestampToDate } from '../../Services/helpers/common';
interface formValuesState{
    nextActionDate:null|string
}

export const InternalComments = () => {
    const { isLoading, APIFunc } = useApiCall({
        method: "GET"
    });
    const [formValues, setFormValues] = useState<formValuesState>({
        nextActionDate:null
    }) 
    const { state, dispatch } = useCommentsDetails();
    const [searchParams] = useSearchParams();
    const loanId = searchParams.get("id");

    useEffect(() => {
        fetchInternal();
    }, [state.fetchInternal]);

    const fetchInternal = async () => {
        const { success, data } = await APIFunc({
            endpoint: APIEndpoints.loanApplicationInternalCommentsByInquiryId,
            headerProps: {
                token: true
            },
            query: {
                inquiryId: Number(loanId)
            }
        });
        if (success) {
            dispatch({
                type: commentsCases.SET_COMMENTS,
                payload: {
                    internalComments: data?.comments
                }
            });
            const { isDraft, _seconds, _nanoseconds } = data;
            setFormValues({
                ...formValues,
                nextActionDate: isDraft ? convertFirestoreTimestampToDate(_seconds, _nanoseconds): data.nextActionDate
            });
        }
    }
    const handleValuesChange = (changedValues: Record<string, any>, allValues: Record<string, any>) => {
        let formattedDate = allValues["nextActionDate"] ? dayjs(changedValues["nextActionDate"]).toDate() : allValues["nextActionDate"];
        allValues = {
            ...allValues,
            nextActionDate: formattedDate
        };
        changedValues = {
            ...changedValues,
            nextActionDate: formattedDate
        };
        // console.log({allValues});
        setFormValues({
            ...formValues,
            ...allValues
        });
        debounceAndSaveToFirestore({
            inquiryId: Number(loanId),
            data: {
                ...formValues,
                ...allValues
            }
        });

    }
    return (
        <>
            <Form
                layout='vertical'
                fields={[
                    {
                        name: "nextActionDate",
                        value: formValues.nextActionDate ? dayjs(new Date(formValues.nextActionDate).getTime()):null
                        // activeMember.dob ? dayjs(new Date(activeMember.dob).getTime()) : null
                    }
                ]}
                onValuesChange={handleValuesChange}
            >
                <AntdInputAbstract
                    type='date'
                    ElementProps={{
                        className: "w-4/12",
                        onChange: (date: any, dateString: string) => {
                            // setNextActionDate(dateString ? dateString : null)
                            setFormValues({
                                ...formValues,
                                nextActionDate: dateString ? dateString : null
                            })
                        },
                    }}
                    FormItemsProps={{
                        label: "Next Action Date",
                        name: "nextActionDate"
                    }}

                />
            </Form>
            {/* <Loader isLoading={isLoading}> */}
                <Comments
                    comments={state?.internalComments}
                    isLoading={isLoading}
                />
            {/* </Loader> */}
        </>
    )
}
export const Remarks = () => {
    const { isLoading, APIFunc } = useApiCall({
        method: "GET"
    });
    const { state, dispatch } = useCommentsDetails();
    const [searchParams] = useSearchParams();
    const loanId = searchParams.get("id");
    useEffect(() => {
        fetchRemarks();
    }, [state?.fetchRemarks])
    const fetchRemarks = async () => {
        const { success, data } = await APIFunc({
            endpoint: APIEndpoints.customerComments,
            headerProps: {
                token: true
            },
            query: {
                inquiryId: Number(loanId)
            }
        });
        if (success) {
            dispatch({
                type: commentsCases.SET_COMMENTS,
                payload: {
                    remarks: data
                }
            });
        }
    }
    return (
        <>
            <Comments
                comments={state.remarks}
                isLoading={isLoading}
            />
        </>
    )
}