import { customerUsers, krediqUsers } from "../../configs/common"
import { useAppSelector } from "../../redux/store/store";

interface AuthorizationProps{
    userTypes?: number[],
    children: React.ReactNode,
    type?:"customer"|"krediq"
}

export const AuthorizationComp = ({
    userTypes,
    children,
    type="krediq"
}: AuthorizationProps) => {
    const users = type === "krediq" ? krediqUsers : customerUsers;
    const accessUsers = userTypes || users;
    const { userDetails: { userTypeId } } = useAppSelector((state) => state["userDetails"]);
    return <>
        {accessUsers.includes(userTypeId || 0) && children}
    </>
}