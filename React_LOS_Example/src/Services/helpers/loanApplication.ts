import axios from "axios";
import { Statuses, krediqUsers, thirdPartyServicesAPI } from "../../configs/common";
import { loanApplicationErrorTabs, loanFormDisabled } from "../../redux/loanApplicationReducer";
import { FormInstance, message } from "antd";
import _ from "lodash";

export const tabRestrictorAndOrderingFunc = (statusId: number, userTypeId: number, items: any[]) => {
    const isKrediqUser = krediqUsers.includes(userTypeId);
    let tabs = [];
    switch (true) {
        case isKrediqUser && statusId === Statuses.application:
            tabs = ["company-details", "promoters", "buyers-suppliers", "attachments"]
            break;

        default:
            break;
    }
}

export const isKrediqUser = (userTypeId: number | null) => {
    return krediqUsers.includes(userTypeId || 0);
}

export const arraySpreading = (child: any, condition: boolean) => {
    const result = _.isArray(child)?child:[child];
    return condition ? result : []
}

export const disabledStatusChecker = (statusId: number, userTypeId: number) => {
    const isKrediq = isKrediqUser(userTypeId);
    const partyStatuses = isKrediq ? [Statuses.application] : [Statuses.sentToCustomer];
    const userStatuses = isKrediq ? [Statuses.application] : [Statuses.sentToCustomer];
    const creditApprovalStatuses = isKrediq ? [Statuses.submitted] : [];
    // ![Statuses.application, Statuses.sentToCustomer].includes(statusId)
    const loanDisabledObj: loanFormDisabled = {
        party: !partyStatuses.includes(statusId),
        users: !userStatuses.includes(statusId),
        "credit-appraisal": !creditApprovalStatuses.includes(statusId)
    }
    return loanDisabledObj;
    // loanDisabledObj = 
}

export const sendOTPToAadharUser = async (aadhaar_id: string | null) => {
    const response = await axios.post(thirdPartyServicesAPI + "/verifyaadhaar_genotp", { aadhaar_id });
    if (response?.data?.status !== "success") {
        message.error(response?.data?.data?.status?.toUpperCase());
        return false;
    }
    message.success(response?.data?.message?.message)
    return response?.data?.message?.data;
    // return true
}

interface verifyAadharProps {
    otp: string,
    client_id: string
}
export const verifyAadhar = async (verifyData: verifyAadharProps) => {
    const response = await axios.post(thirdPartyServicesAPI + "/verifyaadhaar_submitotp", verifyData);
    if (response?.data?.status !== "success") {
        return false;
    }
    return response?.data?.message?.data
    // return ;
    // return true;
}
export const sendOTPToPanUser = async (pan_no: string | null) => {
    const { data } = await axios.post(thirdPartyServicesAPI + "/verifypan", { pan_no });
    if (data?.status === "failure") {
        message.error(data?.message || "Invalid PAN");
        return false;
    }
    message.success("PAN Verified Successfully");
    return data?.status === "success";
}

export const checkShareHoldingPercentage = (formValues:any[]) => {
    const totalSum = _.reduce(formValues, (result, obj) => {
        return result + (obj?.shareHolding || 0);
    },0);
    if (totalSum > 100) {
        return Promise.reject(new Error("The overall percentage should not be above 100"));
    }
    return Promise.resolve();
}

export const checkUniqueEmailOrPhoneNumber = (value:string,formValues:any[],type:"email"|"phone number",activeIndex:number) => {
    const unqiue = new Set();
    _.forEach(formValues, (obj,index) => {
        if (index !== activeIndex) {
            unqiue.add(obj.email)
            unqiue.add(obj.phoneNumber)
        }
    })
    if (unqiue.has(value)) {
        return Promise.reject(new Error(type + " already exists"))
    }
    // const regex = /^[6-9]\d{9}$/; // Regular expression to match Indian mobile numbers

    // if ((!regex.test(value)) && type==="phone number" && value?.length) {

    //     return Promise.reject(new Error("Invalid Phone Number"))
    // }

    return Promise.resolve();
}

export const filterNonExistingGstIds = (existing: any[], total: any[]) => {
    const existingGstsIds = new Set(_.map(existing, "gstId"));
    return _.filter(total, item2 => !existingGstsIds.has(item2.value));
}

export const validateLimitOfBuyerSellerInput = (a: any, value: number) => {
    if (value < 1) {
        return Promise.reject(new Error('Limit must be at least 1'));
    }
    return Promise.resolve();
}