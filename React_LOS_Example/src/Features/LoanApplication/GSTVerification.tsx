import React, { useEffect, useState } from 'react';
import { Typography, message } from 'antd';
import { TableComponent } from '../../Components/Table/table';
import { GSTVerificationTableHeaders, Bodydata } from '../../Context/comapanyData';
import { useApiCall } from '../../Hooks/apicall';
import { APIEndpoints } from '../../Services/backend/functions';
import { useSearchParams } from 'react-router-dom';

const GSTVerification = () => {
  const { Paragraph } = Typography;
  const { APIFunc, isLoading } = useApiCall({
    method: "GET"
  });
  const [searchParams] = useSearchParams();
  const loanId = searchParams.get("id");
  const [gstData, setGstData] = useState([]);
  useEffect(() => {
    fetchGstVerificationData();
  }, []);

  const fetchGstVerificationData = async () => {
    const backendResponse = await APIFunc({
      endpoint: APIEndpoints.fetchGstVerificationData,
      headerProps: {
        token: true
      },
      query: {
        inquiryId: Number(loanId)
      }
    });
    if (!backendResponse?.success) {
      return message.error(backendResponse?.message);
    }
    setGstData(backendResponse?.data);
  }
  return (
    <div className='mt-6'>
      <Paragraph className=" text-left text-[#4E6ACB] text-[18px] !mb-0 font-[500]">GSTIN</Paragraph>
      <TableComponent
        headers={GSTVerificationTableHeaders}
        bodyData={gstData}
        mobile_CardStyle=' text-left'
        isLoading={isLoading}
      />
    </div>
  )
}

export default GSTVerification