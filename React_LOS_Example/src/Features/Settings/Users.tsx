import React, { useCallback, useEffect, useState } from 'react'
import { useApiCall } from '../../Hooks/apicall'
import { APIEndpoints } from '../../Services/backend/functions'
import { TableComponent } from '../../Components/Table/table';
import { UsersHeaders } from './settingsJSON';
import { useAppDispatch } from '../../redux/store/store';
import { setConfigurations } from '../../redux/configurablesReducer';
import { useUsers } from '../../Hooks/users';
import { usersCases } from '../../Context/usersContext';
import { Button,Modal } from 'antd';
import { UserFormComponent } from '../../Components/element/editAndDeleteComponent';
import closeIconOutline from "../../Assets/images/closeIcon.svg";

const Users = () => {
    const { isLoading, APIFunc } = useApiCall({
        method: "GET"
    });

    const [modelFor, SetModalOperFor] = useState("");

    const dispatch = useAppDispatch();
    const { state, dispatch: userDispatch } = useUsers();
    const fetchUsersOfParty = async () => {
        const { success, data, message } = await APIFunc({
            endpoint: APIEndpoints.usersOfParty,
            headerProps: {
                token: true
            }
        });
        if (success) {
            userDispatch({
                type: usersCases.setUsers,
                payload:data?.users
            })
            dispatch(setConfigurations({
                userTypes:data?.roles
            }))
        }
    }

    useEffect(() => {
        fetchUsersOfParty();
    }, [state?.fetchString]);
    
    return (
        <>
            <div className='flex justify-end'>
                <Button onClick={() => SetModalOperFor("edit")}>Add User</Button>
            </div>
            <TableComponent
                headers={UsersHeaders}
                isLoading={isLoading}
                bodyData={state?.users||[]}
            />
            <Modal
                // title="addUserForm"
                open={["edit"].includes(modelFor)}
                footer={null}
                centered
                closeIcon={<img className='object-cover' alt='closeIcon' src={closeIconOutline} />}
                onCancel={() => SetModalOperFor("")}
                width={"60%"}
                destroyOnClose={true}
                // bodyStyle={{
                //     backgroundColor: "#F7F7F7",
                //     padding: 0,
                //     margin:0
                // }}
                // style={{
                //     backgroundColor:"#F7F7F7"
                // }}
            >
                {
                        <UserFormComponent
                            data={{
                                name: "",
                                email: "",
                                role: 2,
                            status: "InActive",
                                phoneNumber:''
                            }}
                            modelFor={modelFor}
                            closeModal={SetModalOperFor}
                            isEdit={false}
                            // setModelOpenFor={SetModalOperFor}
                            cancelAction={()=>SetModalOperFor("")}
                        />
                }
            </Modal>
        </>
    )
}

export default Users