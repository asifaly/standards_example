import React, { createContext, useReducer } from "react";
import _ from "lodash";
import { generateRandomHash } from "../Services/helpers/common";

export interface ReducerStateType {
    [key: string]: any
}

export interface ContextProviderProps {
    children: React.ReactNode
}

export interface DispatchActionProps {
    type: string;
    payload?: Partial<ReducerStateType>; // Payload is optional and can be a partial ReducerStateType
}

export const inquiryCases = {
    HANDLE_CHANGE_INQUIRY: "HANDLE_CHANGE_INQUIRY",
    HANDLE_CHANGE_CP: "HANDLE_CHANGE_CP",
    SET_INQUIRY_DETAILS_FROM_BACKEND: "SET_INQUIRY_DETAILS_FROM_BACKEND",
    SET_GST:"SET_GST",
    SET_CP: "SET_CP",
    ADD_CP: "ADD_CP",
    EDIT_CP: "EDIT_CP",
    DELETE_CP: "DELETE_CP",
    SHOW_ADD_COMP: "SHOW_ADD_COMP",
    ADD_COMMENT: "ADD_COMMENT",
    RESET_COMMENT: "RESET_COMMENT",
    SET_INQUIRY_TYPE: "SET_INQUIRY_TYPE",
    GENERATE_COMMENT_KEY:"GENERATE_COMMENT_KEY"
}


const inquiryReducer = (state: ReducerStateType, action: DispatchActionProps) => {
    switch (action.type) {
        case inquiryCases.HANDLE_CHANGE_INQUIRY:
            const { name: nameAttribute, value } = action.payload as { name: string, value: any };
            state.inquiryDetails = {
                ...state.inquiryDetails,
                [nameAttribute]: value
            };
            return {...state};
        case inquiryCases.HANDLE_CHANGE_CP:
            const { name: attribute, value: Value } = action.payload as { name: string, value: any };
            state.newCP = {
                ...state.newCP,
                [attribute]: Value
            };
            return {...state};
        case inquiryCases.SET_INQUIRY_DETAILS_FROM_BACKEND:
            state.inquiryDetails = action.payload?.savedData;
            state.preloadData = action.payload?.loadData
            state.gsts=action.payload?.gstData
            return state;
        case inquiryCases.SET_CP:
            const { id } = action.payload as { id: number };
            const userIndex = _.findIndex(state?.inquiryDetails?.userDetails, {
                id
            });
            if (userIndex === -1) {
                console.log("User Not Found");
                return { ...state };
            }
            const userDetail = state?.inquiryDetails?.userDetails[userIndex];
            return {
                ...state,
                newCP: userDetail,
                action: "EDIT",
                // showAddContact:true
            };
        case inquiryCases.ADD_CP:
            const inquiryDetails = {
                ...state.inquiryDetails,
                userDetails: [action.payload, ...state.inquiryDetails.userDetails],
            };
            return {
                ...state,
                inquiryDetails,
                newCP: {
                    name: "",
                    email: "",
                    phoneNumber: "",
                    id: ""
                },
                action:""
            };
        case inquiryCases.SHOW_ADD_COMP:
            return {
                ...state,
                // showAddContact: action.payload?.value,
                newCP: {
                    name: "",
                    email: "",
                    phoneNumber: "",
                    id: ""
                },
                action: action.payload?.value?"ADD":""
            }
        case inquiryCases.SET_GST:
            state.gsts=action.payload?.gsts
            return state;
        // return {
        //     ...state,
        //     contactPersons: state?.contactPersons ? [action.payload] : state?.contactPersons.push(action.payload)
        // }
        case inquiryCases.EDIT_CP:
            const values = action.payload as { email: string, phoneNumber: number,name:string,id:number };
            const CP = state?.inquiryDetails?.userDetails?.map((cp: any, ind: number) => {
                if (values.id === cp?.id) {
                    return {
                        ...cp,
                        ...values
                    }
                }
                else {
                    return cp
                }
            });
            state.inquiryDetails.userDetails = CP;
            return {
                ...state,
                // showAddContact: true,
                action:""
            };

        case inquiryCases.DELETE_CP:
            const { id: deleteIndex } = action.payload as { id: number };

            const filteredUserDetails = state.inquiryDetails.userDetails.filter((cp: any, index: number) => cp.id !== deleteIndex);

            const newInquiryDetails = {
                ...state.inquiryDetails,
                userDetails: filteredUserDetails,
            };

            return {
                ...state,
                inquiryDetails: newInquiryDetails,
            };
        case inquiryCases.ADD_COMMENT:
            let updatedComments = [action.payload, ...state?.inquiryDetails?.comments];
            state.inquiryDetails.comments = updatedComments;
            return { ...state };
        case inquiryCases.RESET_COMMENT:
            state.inquiryDetails.comments = action.payload;
            return { ...state };
        case inquiryCases.SET_INQUIRY_TYPE:
            state.isNewInquiry = action.payload?.isNewInquiry;
            return { ...state };
        default:
            return state;
    }
}

const initialInquiryState = {};

export const InquiryContext = createContext(initialInquiryState);

// export const InquiryDetailsProvider = ({ children }:ContextProviderProps) => {
//     const [state, dispatch] = useReducer(inquiryReducer, initialInquiryState);
//     return (
//         <InquiryContext.Provider value= {{ state, dispatch }}>
//     { children }
//     </InquiryContext.Provider>
//   );
// };

// export const InquiryContext = createContext({});


export const InquiryDetailsProvider = ({ children }: ContextProviderProps) => {
    const inquiryStore = {
        newCP: {
            name: "",
            email: "",
            phoneNumber: "",
            id:""
        },
        inquiryDetails: {
            userDetails:[]
        },
        preloadData: {},
        // showAddContact: false,
        action: "",
        isNewInquiry: false,
        gsts: []
    };
    const [state, dispatch] = useReducer(inquiryReducer, inquiryStore);
    return (<InquiryContext.Provider value={{ state, dispatch }}>
        {children}
    </InquiryContext.Provider>
    )
}


// export const useInqui

