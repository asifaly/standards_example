import { message } from "antd";
import { deleteFile, uploadFile } from "../firebase/query";
import { generateRandomHash } from "../helpers/common";
import axiosClient from "./axios";
type ObjectType = { [key: string]: any };
type headerProps = {
    token: boolean,
    options?: any
}
type endpoint = string;

interface FetchActionProps {
    endpoint: endpoint,
    headerProps?: headerProps,
    query?: ObjectType,
    body?: ObjectType
}

interface PostActionProps {
    endpoint: endpoint,
    headerProps?: headerProps,
    query?: ObjectType,
    body?: ObjectType
}

interface fileInterface { url: string; name: string; key: string };

interface uploadAttachmentsAndSaveToDBProps {
    file: File
}

export type APIFuncType = FetchActionProps | PostActionProps


function getTokenFromClientStorage(headerProps: headerProps) {
    return headerProps.token ? { authorization: "Bearer " + localStorage.getItem("accessToken") || "" } : {};
}

export const FetchAction = async ({ endpoint, headerProps, query }: FetchActionProps) => {
    return await axiosClient.get(endpoint, {
        ...headerProps && {
            headers: {
                ...getTokenFromClientStorage(headerProps),
                ...headerProps.options
            }
        },
        params: { ...query }
    }).then((res: any) => Promise.resolve(res?.data));
}

export const PostAction = async ({ endpoint, headerProps, body }: PostActionProps) => {
    return await axiosClient.post(endpoint, body, {
        ...headerProps && {
            headers: {
                ...getTokenFromClientStorage(headerProps),
                ...headerProps.options
            }
        },
    }).then((res: any) => Promise.resolve(res?.data));
}

export const PutAction = async ({ endpoint, body, headerProps }: PostActionProps) => {
    return await axiosClient.put(endpoint, body, {
        ...headerProps && {
            headers: {
                ...getTokenFromClientStorage(headerProps),
                ...headerProps.options
            }
        },
    }).then((res: any) => Promise.resolve(res?.data));
}

export const DeleteAction = async ({ endpoint, query, headerProps }: FetchActionProps) => {
    return await axiosClient.delete(endpoint, {
        ...headerProps && {
            headers: {
                ...getTokenFromClientStorage(headerProps),
                ...headerProps.options
            }
        },
        params: { ...query }
    }).then((res: any) => Promise.resolve(res?.data));
}

export const uploadAttachmentsAndSaveToDB = async ({ file }: uploadAttachmentsAndSaveToDBProps) => {
    const fileKey = generateRandomHash();
    const fileUrl = await uploadFile(fileKey, file);
    const fileData = {
        name: file?.name,
        url: fileUrl,
        key: fileKey
    }
    const { success, data } = await PostAction({
        endpoint: APIEndpoints.attachments,
        headerProps: {
            token: true
        },
        body: {
            attachments: [fileData]
        }
    });
    if (success) {
        return {
            ...fileData,
            id: data[0].id
        };
    }
    else {
        message.error("Upload Failed");
        return false
    }
}

export const deleteFileInStorageAndDB = async (fileKey: string) => {
    const { success } = await DeleteAction({
        endpoint: APIEndpoints.attachments,
        headerProps: {
            token: true
        },
        query: {
            key: fileKey
        }
    });
    if (success) {
        await deleteFile(fileKey);
    }
}


export const APIFunctions = {
    GET: FetchAction,
    POST: PostAction,
    PUT: PutAction,
    "DELETE": DeleteAction
}
export const APIEndpoints = {
    sendOtp: `/user/send-otp`,
    verifyOTP: "/user/verify-otp",
    fetchUserDetails: "/user",
    fetchInquiries: "/inquiry",
    fetchInquiryDetailsById: "/inquiry/id",
    usersOfParty: "/user/all",
    fetchUserDetail: "/user",
    fetchConfigurables: "/types/configurables",
    types: "/types",
    internalComments: "/comments/internal",
    customerComments: "/comments/",
    deleteCP: "/inquiry/cp",
    updateInquiry: "/inquiry",
    createInquiryFromOwnSource:"/inquiry/own",
    loanPartyDetailsById: "/application/party",
    loanMembersOfPartyById: "/application/users",
    attachments: "/attachments",
    loanAttachmentsByInquiryId: "/application/attachments",
    loanApplicationInternalCommentsByInquiryId: "/application/comments/internal",
    loanApplicationRemarksByInquiryId: "application/remarks",
    getFlashMessage: "/inquiry/flash-message",
    statusChange: "/application/status",
    loanApplicationCreditAppraisal: "/application/credit-appraisal",
    logout: "/user/logout",
    loanApplicationBasicDetails: "/application/",
    fetchGSTDataOfParty: "/services/gst-by-pan",
    updateFilingStatus: "/services/file-gst",
    fetchGstVerificationData: "/services/filed-gsts",
    verifyGST: "/services/verify-gst",
    // buyerSellerAddEdit: "/application/invoices",
    buyerSellerList: "/application/invoices",
}
