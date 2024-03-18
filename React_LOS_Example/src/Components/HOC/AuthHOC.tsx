import React, { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/store/store';
import _ from "lodash";
import { useApiCall } from '../../Hooks/apicall';
import { APIEndpoints } from '../../Services/backend/functions';
import { setUserDetails } from '../../redux/userDetailsReducer';
import { Space, Spin } from 'antd';
import { krediqUsers } from '../../configs/common';
import { createSelector } from '@reduxjs/toolkit';

interface AuthHOCProps{
    children:React.ReactElement
}

const AuthHOC = ({
    children
}: AuthHOCProps) => {
    const userDetailsMemo = createSelector(
        [(state) => state.userDetails],
        (userDetails) => userDetails?.userDetails || {} // Ensure that 'errors' is always defined
    );
    const userDetails = useAppSelector(userDetailsMemo);
    // const {userDetails} = useAppSelector((state:any) => state.userDetails);
    const dispatch = useAppDispatch();
    const { isLoading,APIFunc } = useApiCall({
        method: "GET"
    });

    const fetchUserDetails = async () => {
        if (_.isEmpty(userDetails?.email)) {
            const { success, data } = await APIFunc({
                endpoint: APIEndpoints.fetchUserDetails,
                headerProps: {
                    token:true
                }
            });
            if (success) {
                dispatch(setUserDetails({
                    ...data,
                    isKrediqUser:krediqUsers.includes(data?.userTypeId)
                }));
            }
        }
    };

    useEffect(() => {
        fetchUserDetails();
    }, []);
    
    if (isLoading || _.isEmpty(userDetails)) {
        return <Space direction='vertical' className='w-100 h-[100vh] flex items-center justify-center'>
            <Spin size="large">
            </Spin>
        </Space>
    }

    return children;

}

export default AuthHOC