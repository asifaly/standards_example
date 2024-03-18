import { Dispatch, useContext } from "react"
import { DispatchActionProps, ReducerStateType } from "../Context/inquiryContext"
import { UsersContext } from "../Context/usersContext";

export const useUsers = () => {
    return useContext(UsersContext) as {
        state: ReducerStateType,
        dispatch: Dispatch<DispatchActionProps>
    };
}