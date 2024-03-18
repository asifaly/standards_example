import { Dispatch, useContext } from "react"
import { DispatchActionProps, ReducerStateType } from "../Context/inquiryContext"
import { ConfigurationsContext } from "../Context/configurationsContext";

export const useConfigurations = () => {
    return useContext(ConfigurationsContext) as {
        state: ReducerStateType,
        dispatch: Dispatch<DispatchActionProps>
    };
}