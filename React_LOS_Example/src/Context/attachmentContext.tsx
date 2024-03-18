import _ from "lodash";
import React, { Dispatch, createContext, useContext, useReducer } from "react";
import { DispatchActionProps, ContextProviderProps } from "./inquiryContext";
export interface ReducerStateType {
    [key: string]: any
}

export const attachmentCases = {
    SET_ATTACHMENTS: "SET_ATTACHMENTS",
    REFRESH:"REFRESH"
}

const attachmentsReducer = (state: ReducerStateType, action: DispatchActionProps) => {
    switch (action.type) {
        case attachmentCases.SET_ATTACHMENTS:
            return {
                ...state,
                ...action.payload
            }
        case attachmentCases.REFRESH:
            return {
                ...state,
                fetchString: Math.random().toString()
            }
        default:
            return state
    }
}

const attachmentsInitialState = {};
export const AttachmentsContext = createContext(attachmentsInitialState);
export const AttachmentsProviders = ({ children }: ContextProviderProps) => {
    const attachmentStore = {
        attachments: [],
        documentTypes:[],
        fetchString: ""
    };
    const [state, dispatch] = useReducer(attachmentsReducer, attachmentStore);
    return (<AttachmentsContext.Provider value={{ state, dispatch }}>
        {children}
    </AttachmentsContext.Provider>
    )
}

export const useAttachmentDetails = () => {
    return useContext(AttachmentsContext) as {
        state: ReducerStateType,
        dispatch: Dispatch<DispatchActionProps>
    };
}