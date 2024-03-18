import { createSlice } from "@reduxjs/toolkit";
import { message } from "antd";
import _ from "lodash";

export type ErrorItems = { name: any; errors: any[] }[];
export type Errors = {
    users: ErrorItems[];
    "credit-appraisal": ErrorItems;
    party: ErrorItems;
};

export type loanFormDisabled = {
    party: boolean,
    users: boolean,
    "credit-appraisal": boolean,
    buyerSellers?: boolean,
    attachments?:boolean
}
interface State {
    errors: Errors,
    disabled: loanFormDisabled,
    formState:"saved"|"draft"
}

export type loanApplicationErrorTabs = "users" | "party" | "credit-appraisal"

const initialState: State = {
    // loanDetails: {},
    errors: {
        users: [],
        "credit-appraisal": [],
        party: []
    },
    disabled: {
        party: false,
        users: false,
        "credit-appraisal":false
    },
    formState:"saved"
}

export const loanSlice = createSlice({
    name: "loanApplication",
    initialState,
    reducers: {
        setLoanApplicationErrors: (state, action) => {
            let errors = action.payload;
            let finalErrors: Errors = {
                users: [],
                "credit-appraisal": [],
                party: []
            };
            for (let error of errors) {
                errorParser(error.keyword, error, finalErrors);
            }
            state.errors = finalErrors;
        },
        resetLoanApplicationErrors: (state, action) => {
            state.errors = {
                users: [],
                "credit-appraisal": [],
                party: []
            }
        },
        removeErrors: (state, action) => {
            let { errors, tabKey } = action.payload as {
                tabKey: loanApplicationErrorTabs,
                errors:any
            };
            state.errors[tabKey] = errors;
        },
        setDisabledStatus: (state, action) => {
            state.disabled = action.payload;
        },
        setFormState: (state, action) => {
            state.formState=action.payload
        }

    }
});

const errorParser = (keyword:string,error:Record<string,any>,finalErrors:Errors) => {
    switch (keyword) {
        case "required":
            requiredErrorParser(error, finalErrors);
            break;
    
        default:
            typeErrorParser(error, finalErrors);
            break;
    }
}

const requiredErrorParser = (error: Record<string, any>, finalErrors: Errors) => {
    let splittedInstancePath = error?.instancePath?.split("/");
    let tabKey: loanApplicationErrorTabs = splittedInstancePath[1];
    if (!tabKey) {
        return message.error(tabKeyNotPresentHandler(error))
    }
    let errorKey = error?.params?.missingProperty;
    if (tabKey === "users") {
        let index = Number(splittedInstancePath[splittedInstancePath.length - 1]);
        if (finalErrors[tabKey] && finalErrors[tabKey][index]) {
            finalErrors[tabKey][index].push({
                name: errorKey,
                errors: ["Required"]
            });
        }
        else {
            finalErrors[tabKey][index] = [{
                name: errorKey,
                errors: ["Required"]
            }]
        }
    }
    else {
        finalErrors[tabKey].push({
            name: errorKey,
            errors: ["Required"]
        });
    }

}
 
const tabKeyNotPresentHandler = (error: any) => {
    switch (error?.params?.missingProperty) {
        case "users":
            return "Add Promoters/Directors Details"
        case "party":
            return "Add Company Details"
        case "credit-appraisal":
            return "Add Credit Appraisal Details"
        default:
            return "Invalid Data"
    }
}

const typeErrorParser = (error: Record<string, any>, finalErrors: Errors) => {
    let splittedInstancePath = error?.instancePath?.split("/");
    let tabKey: loanApplicationErrorTabs = splittedInstancePath[1];
    let errorKey = splittedInstancePath[splittedInstancePath.length - 1];
    if (tabKey === "users") {
        let index = Number(splittedInstancePath[splittedInstancePath.length - 2]);
        if (finalErrors[tabKey] && finalErrors[tabKey][index]) {
            finalErrors[tabKey][index].push({
                name: errorKey,
                errors: [error?.message],
            });
        }
        else {
            finalErrors[tabKey][index] = [{
                name: errorKey,
                errors: [error?.message]
            }]
        }
    }
    else {
        finalErrors[tabKey].push({
            name: errorKey,
            errors: [error?.message]
        });
    }
}

export const { setLoanApplicationErrors, resetLoanApplicationErrors,removeErrors,setDisabledStatus,setFormState } = loanSlice.actions
// export const selected_contactData = (state: any) => state.user.contactData

export default loanSlice.reducer;