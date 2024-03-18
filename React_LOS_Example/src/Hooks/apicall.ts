// import { useState } from "react";
import { APIFuncType, APIFunctions } from "../Services/backend/functions";
// import { ObjectType } from "typescript";
import {useState} from 'react'
interface useApiCallProps{
    method: "GET" | "POST" | "PUT" | "DELETE",
    // APIFunc: keyof typeof APIFunctions
}

export const useApiCall = ({method}:useApiCallProps) => {
    const [isLoading, setLoading] = useState(false);

    const APIFunc = async (config: APIFuncType) => {
        // * generic type match have to do
        setLoading(true);
        const response = await APIFunctions[method](config);
        setLoading(false);
        return response as Promise<{
            success?: boolean |undefined,
            message?: string,
            data?: any,
            errors?:Record<string,any>[]
        } & { [key: string]: any }>;
    }
    
    return { isLoading,APIFunc };
}


