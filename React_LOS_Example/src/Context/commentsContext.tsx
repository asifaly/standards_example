import _ from "lodash";
import React, { Dispatch, createContext, useContext, useReducer } from "react";
import { DispatchActionProps, ContextProviderProps } from "./inquiryContext";
export interface ReducerStateType {
    [key: string]: any
}

export const commentsCases = {
    SET_COMMENTS: "SET_COMMENTS",
    REFRESH:"REFRESH"
    // // SET_REMARKS:"SET_REMARKS",
    // REFRESH_INTERNAL: "REFRESH_INTERNAL",
    // RERESH_REMARKS:"REFRESH_REMARKS"
}

const commentsReducer = (state: ReducerStateType, action: DispatchActionProps) => {
    switch (action.type) {
        case commentsCases.SET_COMMENTS:
            return {
                ...state,
                ...action.payload
            }
        // case commentsCases.REFRESH:
        //     return {
        //         ...state,
        //         ...fetchInternal: Math.random().toString()
        //     }
        // case commentsCases.REFRESH_INTERNAL:
        //     return {
        //         ...state,
        //         fetchInternal: Math.random().toString()
        //     }
        
        default:
            return state
    }
}

const commentsInitialState = {};
export const CommentsContext = createContext(commentsInitialState);
export const CommentsProviders = ({ children }: ContextProviderProps) => {
    const commentsStore = {
        internalComments: [],
        remarks: [],
        fetchInternal: "",
        fetchRemarks:""
    };
    const [state, dispatch] = useReducer(commentsReducer, commentsStore);
    return (<CommentsContext.Provider value={{ state, dispatch }}>
        {children}
    </CommentsContext.Provider>
    )
}

export const useCommentsDetails = () => {
    return useContext(CommentsContext) as {
        state: ReducerStateType,
        dispatch: Dispatch<DispatchActionProps>
    };
}