import { Dispatch, useContext } from "react"
import { DispatchActionProps, InquiryContext, ReducerStateType } from "../Context/inquiryContext"

export const useInquiryDetails = () => {
    return useContext(InquiryContext) as {
        state: ReducerStateType,
        dispatch: Dispatch<DispatchActionProps>
    };
}