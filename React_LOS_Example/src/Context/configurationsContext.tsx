import { createContext, useReducer } from "react";
import { ContextProviderProps, DispatchActionProps, ReducerStateType } from "./inquiryContext";
import _ from "lodash";

const initialUsersState = {};

export const configurationCases = {
    fetchConfigurations: "FETCH_CONFIGURATIONS",
    refresh:"REFRESH"
}

const configurationReducer = (state: ReducerStateType, action: DispatchActionProps) => { 
    switch (action.type) {
        case configurationCases.fetchConfigurations:
            const transformedConfigurationObject = _.reduce(
                action.payload,
                (result: any, item: any) => {
                    result[item.name] = item.values;
                    return result;
                },
                {}
            );
            return {
                ...state,
                configurations: action.payload,
                objectConfigurations:transformedConfigurationObject
            }
        case configurationCases.refresh:
            return {
                ...state,
                fetchString:  Math.random().toString()
            }
        default:
            return state;
    }
}
export const ConfigurationsContext = createContext(initialUsersState);
export const ConfigurationsProviders = ({ children }: ContextProviderProps) => {
    const configurationStore = {
        configurations: [],
        fetchString: "",
        objectConfigurations:{}
    };
    const [state, dispatch] = useReducer(configurationReducer, configurationStore);
    return (<ConfigurationsContext.Provider value={{ state, dispatch }}>
        {children}
    </ConfigurationsContext.Provider>
    )
}