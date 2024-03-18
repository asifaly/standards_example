import { createSlice } from "@reduxjs/toolkit";

export const configurablesSlice = createSlice({
    name: "userDetails",
    initialState: {
        configurations: {
            userTypes: []
        }
    },
    reducers: {
        setConfigurations: (state, action) => {
            state.configurations = {
                ...state.configurations,
                ...action.payload
            }
        }

    }
});

export const { setConfigurations } = configurablesSlice.actions
// export const selected_contactData = (state: any) => state.user.contactData

export default configurablesSlice.reducer;