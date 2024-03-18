import { Select, message } from 'antd';
import { commentTimeFormat, filingDateFormat, formatDate, formatMonthString } from '../../Services/helpers/common';
import { useApiCall } from '../../Hooks/apicall';
import { APIEndpoints } from '../../Services/backend/functions';
import { useInquiryDetails } from '../../Hooks/inquiryDetails';
import { inquiryCases } from '../../Context/inquiryContext';
import Loader from './loader';
import { useState } from 'react';
export const FilingStatusSelector = ({ data, props }: any) => {
  const options = [
    {
      label: "Filed",
      value:"filed"
    },
    {
      label: "UnFiled",
      value: "unFiled" 
    }
  ]
  const { state, dispatch } = useInquiryDetails();
  const { inquiryDetails, isNewInquiry, gsts } = state;
  const { isLoading, APIFunc: updateFilingStatus } = useApiCall({
    method: "POST"
  });
  const [status, setStatus] = useState(data);

  const handleChange = async(statusValue:string) => {
    const filingResponse = await updateFilingStatus({
      endpoint: APIEndpoints.updateFilingStatus,
      headerProps: {
        token: true
      },
      body: {
        status: statusValue,
        gstNo: props?.id,
        ...isNewInquiry ? {
          inquiryKey: localStorage.getItem("inquiryKey"),
          isNewInquiry:true
        } : {
            inquiryId: inquiryDetails?.id
        }
      }
    });
    if (!filingResponse?.success) {
      return message.error(filingResponse?.message);
    }
    message.success(filingResponse?.message + ` for ${props?.id}`);
    setStatus(statusValue);
  }
  return (
    <Loader isLoading={isLoading}>
      <Select
        options={options}
        className='w-10/12'
        onChange={handleChange}
        value={status}
        placeholder="Select Filing Status"
      />
    </Loader>
  )
}


export const DateConverter = ({data}:any) => {
  return <span>
    {
      formatDate(data)
    }
  </span>
}

export const DateWithTimeComp = ({ data }: any) => {
  return <span>
    {
      commentTimeFormat(data)
    }
  </span>
}

export const DateFormaterForFiling = ({ data }: { data: string }) => {
  return <span>
    {
      filingDateFormat(data)
    }
  </span>
}

export const FormatMonthNumToString = ({ data }: { data: string }) => {
  const monthNum = data.slice(0,2);
  return <span>
    {
      formatMonthString(monthNum)
    }
  </span>
}