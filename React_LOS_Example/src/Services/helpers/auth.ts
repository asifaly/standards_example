import Store from "../../redux/store/store";
import { resetUserDetails } from "../../redux/userDetailsReducer";

export const userLogoutSetups = () => {
    localStorage.removeItem("accessToken");
    Store.dispatch(resetUserDetails({}));
}