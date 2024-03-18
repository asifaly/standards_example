import { configureStore } from '@reduxjs/toolkit'
import userDetailsReducer from "../userDetailsReducer";
import configurationsReducer from "../configurablesReducer";
import loanApplicationReducer from "../loanApplicationReducer";


import {TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

export const Store = configureStore({
    reducer: {
        // user: useReducer,
        userDetails: userDetailsReducer,
        configurations: configurationsReducer,
        loanDetails: loanApplicationReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
});

type State = ReturnType<typeof Store.getState>;
type Dispatch = typeof Store.dispatch;


export const useAppDispatch: () => Dispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<State> = useSelector;
export default Store; 