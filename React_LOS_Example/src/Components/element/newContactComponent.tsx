import { Avatar, Row, Space } from 'antd'
import Paragraph from 'antd/es/typography/Paragraph'
import profileIcon from '../../Assets/images/profileIcon.svg';
import errorIcon from '../../Assets/images/errorIcon.svg';

import closeIcon from '../../Assets/images/closeIcon.svg';

import _ from 'lodash';
import { ErrorItems } from '../../redux/loanApplicationReducer';
import { AuthorizationComp } from '../HOC/Authorization';

interface CompanyUsersIndividualCompProps {
    name: string,
    partyRoleId: number,
    designations: any[],
    isActive: boolean,
    onClick?: () => void,
    onRemoveUser?: () => void,
    hasError: boolean,
    status: string,
}

function CompanyUsersIndividualComp({ name, partyRoleId, designations, isActive, onClick, onRemoveUser, hasError, status }: CompanyUsersIndividualCompProps) {
    const closeCondition = status === 'application' || status === 'sentToCustomer';
    const designation = _.find(designations, {
        value: partyRoleId
    });
    let nameFormat = name || "Not Filled";

    const borderStyleCompute = () => {
        switch (true) {
            // case (isActive && hasError)||hasError:
            //     return "border-[2px] border-[#FF4545] cursor-not-allowed";
            case isActive:
                return "border-[2px] border-[#4E6ACB] cursor-not-allowed";     
            default:
                return "";
        }
    }
    // isActive && "border-[2px] border-[#4E6ACB] cursor-not-allowed"
    return (
        <div className='relative group'>
            {closeCondition ? <AuthorizationComp><div className='relative userCard'>
            <img
                    src={closeIcon}
                    alt='closeIcon'
                    onClick={onRemoveUser}
                    className='hidden cursor-pointer group-hover:block absolute rounded-[50%] right-[-5%] mt-[-10px] border border-blue-500 bg-[#fff] p-2'
                />
            </div></AuthorizationComp> : <></>}
            <div onClick={onClick} className={`flex cursor-pointer rounded-[12px] py-3 px-4 items-center bg-[#FFFFFF] ${borderStyleCompute()}`}>
                <Space  >
                    <Avatar src={hasError?errorIcon:profileIcon} className=' w-[40px] h-[40px]' />
                </Space>
                <Space className='block items-center ml-5 text-left'>
                    <Paragraph className={` !mb-0 text-[#313131] ${name ? "text-[17px] font-[500]" : "text-[13px] font-[400] opacity-60"}`}>
                        {nameFormat}
                    </Paragraph>
                    <Paragraph className=' text-[#9A9A9A] !mb-0 text-[14x] w-50 overflow-hidden overflow-ellipsis whitespace-nowrap' >
                        {designation?.label}
                    </Paragraph>
                </Space>
            </div>
        </div>
    )
}

export default CompanyUsersIndividualComp