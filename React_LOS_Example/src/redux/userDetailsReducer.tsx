import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name: "userDetails",
    initialState: {
        userDetails: {
            email: null,
            phoneNumber: null,
            isKrediqUser: false,
            userTypeId: null,
            name: "",
            partys: null
        }
    },
    reducers: {
        setUserDetails: (state, action) => {
            state.userDetails = action.payload;
        },
        resetUserDetails: (state, action) => {
            state.userDetails = {
                email: null,
                phoneNumber: null,
                isKrediqUser: false,
                userTypeId: null,
                name: "",
                partys: null
            }
        }

    }
});

export const { setUserDetails,resetUserDetails } = userSlice.actions
// export const selected_contactData = (state: any) => state.user.contactData

export default userSlice.reducer;