import React from 'react'
import { Statuses } from '../../configs/common'
// import _ from 'lodash';

export const statusComponent = (val: any) => {
  // console.log({val});

  const rejectedStatuses = [Statuses.loanRejected, Statuses.lost, Statuses.notQualified, Statuses.customerRejected]
  const successStatuses = [Statuses.completed];
  const infoStatuses = [Statuses.new]
  // const interimStatuses = _.filter(Object.values(Statuses), (status) =>
  //   !rejectedStatuses.includes(status) && !successStatuses.includes(status) && !infoStatuses.includes(status)
  // );

  const colorCalculation = () => {
    const statusId = val?.props?.statusId;
    switch (true) {
      case successStatuses.includes(statusId):
        return "text-[#34D399] bg-[#E1F9F0]"
      case rejectedStatuses.includes(statusId):
        return "bg-[#FEEAEA] text-[#F87171]"
      case infoStatuses.includes(statusId):
        return "text-[#3056D3] bg-[#fff]"
      default:
        return "text-[#FBBF24] bg-[#FFF6DE]"
    }
  }


  return (
    <p className={`rounded-[14px] inline px-4 py-1 text-[10px] ${colorCalculation()}`}>{val.data}</p>
  )
}


export const UsersTableStatusComp = (rowValues: Record<string, any>) => {
  return (
    <p className={`rounded-[14px] inline text-center py-1 px-6 ${rowValues?.data === "Active" ? "text-[#1BB77E] bg-[#CCF1EB]" :"text-[#FFB800] bg-[#F4EDD3]"}`}>{rowValues?.data}</p>
  )
}

export const FilingStatus = (rowValues: Record<string, any>) => {
  return (
    <p className='capitalize inline text-[12px] text-[#4E6ACB] px-4 py-1 bg-[#fff] rounded-[14px]'>{rowValues?.data}</p>
  )
}