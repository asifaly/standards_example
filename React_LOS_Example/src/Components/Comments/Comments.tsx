import { Row, Layout, Card, List, Col, Divider, Upload, Typography, Space, message } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { AntdInputAbstract } from '../element/inputwithlable';
import { commentTimeFormat, formatDate, generateRandomHash } from '../../Services/helpers/common';
import UploadInputComponent from '../element/UploadInputComponent';
import attachFileIcon from '../../Assets/images/attachFileIcon.svg'
import sendIcon from '../../Assets/images/sendIcon.svg'
import { deleteFile, uploadFile } from '../../Services/firebase/query';
import closeIcon from "../../Assets/images/closeIcon.svg"
import { useParams, useSearchParams } from 'react-router-dom';
import { useApiCall } from '../../Hooks/apicall';
import { APIEndpoints } from '../../Services/backend/functions';
import { useInquiryDetails } from '../../Hooks/inquiryDetails';
import { inquiryCases } from '../../Context/inquiryContext';
import { commentsCases, useCommentsDetails } from '../../Context/commentsContext';
import Loader from '../element/loader';
import { useAppSelector } from '../../redux/store/store';

interface commentsComponentProps {
    comments: any[],
    isLoading?: boolean
}

interface fileInterface { url: string; name: string; key: string };

const Comments = ({ comments, isLoading }: commentsComponentProps) => {
    const listRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        if (listRef.current) {
            // Scroll to the bottom of the list by setting scrollTop to scrollHeight
            listRef.current.scrollTop = listRef.current.scrollHeight;
        }
    }, [comments])
    return (
        <Card className='w-[65%] max-tablet:w-[100%] max-mobile:w-[50%]'>
            <div
                className='max-h-[300px]  overflow-y-auto'
                ref={listRef}

            >
                <Loader isLoading={isLoading}>
                    <List
                        dataSource={comments}
                        renderItem={(comment: any) => (
                            <List.Item>
                                <Row className='block'>
                                    <Row wrap className=' flex items-center'>
                                        <Col className='text-[#000000] text-[18px] font-[500] mr-4 '>
                                            {comment?.userDetail?.name}
                                        </Col>
                                        <Col className='text-[#4E6ACB] bg-[#F3F9FF] rounded-[16px] text-[12px] mb-0 px-4  py-1'>
                                            {commentTimeFormat(comment?.createdAt)}
                                        </Col>
                                    </Row>
                                    <Col className=' text-left text-[#313131] text-[15px] font-[400] '>
                                        {comment?.description}
                                    </Col>
                                    <Col className='mt-2 flex  '>
                                        <AttachmentsComponent
                                            attachments={comment?.attachments}
                                        />
                                        {/* {comment?.attachments?.map((item: fileInterface) => <p className=' py-1 px-4  text-left flex bg-[#EEEEEE] text-[#637381] gap-3 mr-5 rounded'>{item}</p>)} */}
                                    </Col>
                                </Row>
                            </List.Item>
                        )}
                    />
                </Loader>
            </div>
            <CommentInputComponent />
        </Card>
    )
}

const CommentInputComponent = () => {
    const params: any = useParams();
    const { userDetails }: any = useAppSelector((state) => state.userDetails)
    const isLoanPage = ["loan-application"].includes(params?.page);
    const isInternal = ["activities", "internal-comments"].includes(params?.id)
    const [uploadedFileList, setUploadFileList] = useState<fileInterface[]>([]);
    const [commentMessage, SetCommentMessage] = useState("");
    const { dispatch, state } = useInquiryDetails();
    const { dispatch: commentsDispatch } = useCommentsDetails();
    const [isLoading, setIsLoading] = useState(false);
    const { APIFunc } = useApiCall({
        method: "POST"
    })
    const { APIFunc: fetchCommentsFunc } = useApiCall({
        method: "GET"
    });
    const [searchParams] = useSearchParams();
    const inquiryId = searchParams.get("id");
    const { Paragraph } = Typography;
    // console.log(userDetails?.partys[0]?.id, "hi",userDetails);
    const isCommentKeyPresent = Boolean(localStorage.getItem("inquiryKey"));
    const isNewInquiryAndCommentKeyPresent = isCommentKeyPresent && state?.isNewInquiry;
    const sendComment = async () => {
        if (isLoading) return;
        const body = {
            ...!state?.isNewInquiry && {
                inquiryId: Number(inquiryId)
            },
            description: commentMessage,
            attachments: uploadedFileList,
            ...isNewInquiryAndCommentKeyPresent && {
                key: localStorage.getItem("inquiryKey"),
                userDetailsId: userDetails?.partys[0]?.id
            }
        }
        setIsLoading(true);
        const { success, message: errorMessage } = await APIFunc({
            endpoint: isInternal ? APIEndpoints?.internalComments : APIEndpoints?.customerComments,
            headerProps: {
                token: true
            },
            body
        });
        if (success) {
            await updateCommentsBasedOnPageType();
            SetCommentMessage("");
            setUploadFileList([]);
        }
        else {
            message.error(errorMessage);
        }
        setIsLoading(false);
    }

    const updateCommentsBasedOnPageType = async () => {
        switch (true) {
            case isLoanPage:
                commentsDispatch({
                    type: commentsCases.SET_COMMENTS,
                    payload: {
                        [isInternal ? "fetchInternal" : "fetchRemarks"]: Math.random().toString()
                    }
                })
                break;

            default:
                updateCommentsForInquirySection();
        }
    }

    const updateCommentsForInquirySection = async () => {
        const { data } = await fetchCommentsFunc({
            endpoint: APIEndpoints.internalComments,
            headerProps: {
                token: true
            },
            query: {
                ...state.isNewInquiry ? {
                    key: localStorage.getItem("inquiryKey")
                } : {
                    inquiryId
                }
            }
        });
        dispatch({
            type: inquiryCases.RESET_COMMENT,
            payload: data
        });
    }
    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        SetCommentMessage(event.target.value);
    }
    const handleFileUpload = async ({ file }: any) => {
        if (isLoading) return;
        setIsLoading(true)
        const fileKey = generateRandomHash(20);
        const fileUrl = await uploadFile(fileKey, file);
        setUploadFileList((prevState) => [
            ...prevState,
            {
                url: fileUrl,
                name: file.name,
                key: fileKey,
            },
        ]);
        setIsLoading(false);
    }
    const removeFile = async (file: fileInterface) => {
        if (isLoading) return
        setIsLoading(true);
        await deleteFile(file.key);
        let filteredList = uploadedFileList.filter((fl) => fl.key !== file.key);
        setUploadFileList(filteredList);
        setIsLoading(false);
    }

    return (
        <Row className={`w-full mt-3 py-4 border rounded-[4px] border-[#DFDFDF] ${isLoading && "bg-[#EEEEEE]"}`}>
            <div
                className="w-[87%] px-2"

            >
                <AntdInputAbstract
                    type='textarea'
                    FormItemsProps={{
                    }}
                    ElementProps={{
                        placeholder: "Enter Your Comment",
                        className: "!outline-none !border-none !shadow-none !py-1",
                        autoSize: {
                            minRows: 1
                        },
                        value: commentMessage,
                        onChange: handleChange,
                        disabled: isLoading
                    }}
                />
                <Space wrap >
                    {
                        uploadedFileList.map((file, index) => (
                            <Space key={index} className='bg-[#EEEEEE] rounded-[3px] px-2 py-1'>
                                <Paragraph className='text-left !mb-0'>{file.name}</Paragraph>
                                <img
                                    alt='closeIcon'
                                    src={closeIcon}
                                    className={`${!isLoading && "cursor-pointer"}`}
                                    onClick={() => removeFile(file)}
                                />
                            </Space>
                        ))
                    }
                </Space>
            </div>
            {/* </Col> */}
            {/* <Col className='flex items-center'> */}
            <>
                <Upload
                    className='flex items-center'
                    customRequest={handleFileUpload}
                    disabled={isLoading}
                    // onChange={handleFileUpload}
                    // onChange={(event) => {
                    //     console.log({event});
                    // }}
                    multiple={true}
                    showUploadList={false}
                >
                    <img
                        alt='attachIcon'
                        src={attachFileIcon}
                        className={`${!isLoading && "cursor-pointer"} object-cover`}

                    />
                </Upload>
                <img
                    alt='attachIcon'
                    src={sendIcon}
                    onClick={sendComment}
                    className={`${!isLoading && "cursor-pointer"} ml-2`}
                />
            </>
            {/* </Col> */}
        </Row>
    )
}

const AttachmentsComponent = ({ attachments }: {
    attachments: fileInterface[]
}) => {
    return (
        <Space>
            {
                attachments.map((fl, index) => (
                    <a target='_blank' className='bg-[#EEEEEE] text-[12px] px-2 py-1 rounded-[3px]' href={fl.url} title={fl.name} rel='noreferrer' key={index}>
                        {fl.name}
                    </a>
                ))
            }
        </Space>
    )
}

export default Comments