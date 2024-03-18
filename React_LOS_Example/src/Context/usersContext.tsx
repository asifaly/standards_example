import _ from "lodash";
import React, { createContext, useReducer } from "react";
import { DispatchActionProps, ContextProviderProps } from "./inquiryContext";
import { APIEndpoints, FetchAction } from "../Services/backend/functions";
export interface ReducerStateType {
    [key: string]: any
}
export const usersCases = {
    setUsers: "SET_USERS",
    updateUser: "UPDATE_USER",
    addUser: "ADD_USER",
    fetchUsers: 'FETCH_USERS',
    refreshFetch:"REFRESH"
}

const userReducer = (state: ReducerStateType, action: DispatchActionProps) => {
    switch (action.type) {
        case usersCases.setUsers:
            return { ...state, users: action.payload };
        case usersCases.refreshFetch:
            return {
                ...state,
                fetchString:Math.random().toString()
            }
        case usersCases.updateUser:
            const updatedUsers = state.users.map((user:any) => {
                if (user.uid === action.payload?.uid) {
                    return {
                        ...user,
                        ...action.payload?.user,
                    };
                } else {
                    return user;
                }
            });
            return { ...state, users: updatedUsers };
        case usersCases.addUser:
            return {
                ...state,
                users:[action.payload,...state.users]
            }
        // case usersCases.fetchUsers:
        //     FetchAction({
        //         endpoint: APIEndpoints.usersOfParty,
        //         headerProps: {
        //             token: true
        //         }
        //     }).then((data) => {
        //         return {
        //             ...state,
        //             users:data?.data?.users
        //         }
        //     })
        default:
            return state
    }
}

const initialUsersState = {};
export const UsersContext = createContext(initialUsersState);
export const UsersProviders = ({ children }: ContextProviderProps) => {
    const userStore = {
        users: [],
        fetchString:""
    };
    const [state, dispatch] = useReducer(userReducer, userStore);
    return (<UsersContext.Provider value={{ state, dispatch }}>
        {children}
    </UsersContext.Provider>
    )
}


// export const useInqui

