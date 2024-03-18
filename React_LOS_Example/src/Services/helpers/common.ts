import moment from "moment";
import * as CryptoJS from "crypto-js";
import { Statuses, customerEditables, customerUsers } from "../../configs/common";
import { Timestamp } from "firebase/firestore";
import reject from "../../Assets/images/failFlashIcon.svg";
import Store from "../../redux/store/store";
import success from "../../Assets/images/successFlashIcon.svg";
import info from "../../Assets/images/infoFlashIcon.svg";
import warn from "../../Assets/images/warnFlashIcon.svg";
import { Errors, loanApplicationErrorTabs, removeErrors } from "../../redux/loanApplicationReducer";
import _ from "lodash";
import { error } from "console";
import { FormInstance, useForm } from "antd/es/form/Form";


interface removeErrorsInLoanStoreProps{
    tabKey: loanApplicationErrorTabs,
    changedValues: Record<string, any>,
    activeMemberIndex?: number,
    errors: Errors,
    form:FormInstance
}

export const formatDate = (dateString: string) => {
    return moment(dateString).format("Do MMM YY")
}

export const filingDateFormat = (dateString: string) => {
    return moment(dateString, "DD-MM-YYYY").format("DD MMM YYYY");
}

export const formatMonthString = (monthNumber: string | number) => {
    return moment(monthNumber, "MM").format("MMMM");
}

export const commentTimeFormat = (dateString: string) => {
    return moment(dateString).format("Do[/]MMM[/]YY | h:mm")
}

export const generateRandomHash = (length: number = 10) => {
    // const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const randomString = CryptoJS.enc.Base64.stringify(CryptoJS.lib.WordArray.random(length));
    return randomString.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

export const convertFirestoreTimestampToDate = (seconds: number, nanoseconds: number) => {
    let firestoreTimestamp = new Timestamp(seconds, nanoseconds);
    return firestoreTimestamp.toDate();
}

export const pageToStatusId:any = {
    "new-application": Statuses.application,
    "sent-to-customer": Statuses.sentToCustomer,
    "submitted": Statuses.submitted,
    "completed": Statuses.completed,
    "customer-approval": Statuses.customerApproval,
    "customer-accepted":Statuses.customerAccepted
}

export const statusToTableHeadings:any = {
    "new-application": "New Application",
    "sent-to-customer": "Sent To Customer",
    "submitted": "Submitted",
    "completed": "Completed",
    "customer-approval": "Customer Approval",
    "inquiries": "Inquiry",
    "customer-accepted":"Customer Accepted"
}

export const statustoRouteNames:any = {
    "application": "new-application",
    "sentToCustomer": "sent-to-customer",
    "submitted": "submitted",
    "completed": "completed",
    "customerApproval": "customer-approval",
    "customerAccepted": "customer-accepted",
    "inquiries": "inquiries"
}

// export const pageToHeadingName:any = {
//     "new-application": "New Application",
//     "sent-to-customer": "Sent To Customer",
//     "submitted": "Submitted",
//     "completed": "Completed",
//     "customer-approval": "Customer Approval",
//     "inquiries":"Inquiry"
// }

export const pageToHeadingName: any = {
    "application": "New Application",
    "sentToCustomer": "Sent To Customer",
    "submitted": "Submitted",
    "completed": "Completed",
    "customerApproval": "Customer Approval",
    "customerAccepted":"Customer Accepted",
    "inquiries": "Inquiry"
}

export const flashMessageColorPickerFromStatus = (status: string) => {
    switch (true) {
        case ["application", "submitted", "customerAccepted","completed"].includes(status):
            return {
                wrapperbg: "bg-[#E1F9F0]",
                bg: "bg-[#34D399]",
                icon:success
            }
        case ["lost", "notQualified", "loanRejected","customerRejected"].includes(status):
            return {
                wrapperbg: "bg-[#FEEAEA]",
                bg: "bg-[#F87171]",
                icon: reject
            }
        case ["sentToCustomer", "customerApproval","offerAPF"].includes(status):
            return {
                wrapperbg: "bg-[#DBEAFE]",
                bg: "bg-[#3B82F6]",
                icon: info
            }
        default:
            return {
                wrapperbg: "bg-[#FEFDEB]",
                bg: "bg-[#ECB632]",
                icon:warn
            }
    }
}

export const phoneNumberValidation = (rule:any, value:string, callback:(err?:string)=>void) => {
    const regex = /^[6-9]\d{9}$/; // Regular expression to match Indian mobile numbers

    if (regex.test(value)) {
        
        callback();

    } else {
        callback('Invalid phone number');
    }
}

export const shareHoldingValidation = (rule: any, value: number, callback: (err?: string) => void) => {
    if (value > 0 && value <= 100) {
        callback(); // Validation succeeded
    } else {
        callback('Value must be greater than 0 and less than or equal to 100'); // Validation failed
    }
}

export const canCustomerEditFields = (status:keyof typeof Statuses) => {
    return customerEditables.includes(status);
}

export const isloanApplicationEditable = (status: keyof typeof Statuses, roleId: number) => {
    const isCustomer = customerUsers.includes(roleId);
    if (isCustomer) {
        return canCustomerEditFields(status);
    }
    else {
        return !canCustomerEditFields(status);
    }
}

export const removeErrorsInLoanStore = ({changedValues,activeMemberIndex,errors,tabKey,form}:removeErrorsInLoanStoreProps) => {
    let [changedKey] = _.keys(changedValues);
    if (!changedKey) return;
    let result;
    if (tabKey === "users") {
        let alteredArr = _.map(errors["users"], (innerArr, index) => {
            if (index === activeMemberIndex) {
                let ref = _.filter(innerArr, (err) => err?.name !== changedKey);
                return ref.length > 0 ? ref : undefined
            }
            else {
                return innerArr;
            }
        });
        result = _.some(alteredArr, (arr) => arr !== undefined) ? alteredArr : [];
    }
    else {
        result = _.filter(errors[tabKey], (err) => err?.name !== changedKey);
    }
    Store.dispatch(removeErrors({
        tabKey,
        errors: result
    }));
    form.setFields([{
        name: changedKey,
        errors: undefined
    }]);
}