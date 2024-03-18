import _ from "lodash";
import React, { Dispatch, createContext, useContext, useReducer } from "react";
import { DispatchActionProps, ContextProviderProps } from "./inquiryContext";
import { Statuses } from "../configs/common";
export interface ReducerStateType {
    status: keyof typeof Statuses,
    [key: string]: any
}

interface loanStoreProps{
    status: keyof typeof Statuses,
    partyId:number
}

export const loanCases = {
    SET_LOAN_DETAILS:"SET_LOAN_DETAILS"
}

const loanReducer = (state: ReducerStateType, action: DispatchActionProps) => {
    switch (action.type) {
        case loanCases.SET_LOAN_DETAILS:
            return {
                ...state,
                ...action.payload
            }
        default:
            return state
    }
}

const loanInitialState = {};
export const LoanContext = createContext(loanInitialState);
export const LoanProviders = ({ children }: ContextProviderProps) => {
    const loanStore:loanStoreProps = {
        status: "application",
        partyId:0
    };
    const [state, dispatch] = useReducer(loanReducer, loanStore);
    return (<LoanContext.Provider value={{ state, dispatch }}>
        {children}
    </LoanContext.Provider>
    )
}

export const useLoanDetails = () => {
    return useContext(LoanContext) as {
        state: ReducerStateType,
        dispatch: Dispatch<DispatchActionProps>
    };
}