import React, { useEffect, useState } from 'react'
import { useApiCall } from '../../Hooks/apicall';
import { APIEndpoints } from '../../Services/backend/functions';
import { inquiryHeaders } from '../../Features/Inquiry/table';
import { useParams } from 'react-router-dom';
import { Col } from 'antd';
import { TableComponent } from './table';

const MenuListing = () => {
    const [tableData, seTableData] = useState([]);
    const params = useParams();
    // console.log({params});

    const { isLoading, APIFunc } = useApiCall({
        method: "GET"
    });

    useEffect(() => {
        fetchInquiryDetails();
    }, [])

    const fetchInquiryDetails = async () => {
        const inquiryResponse = await APIFunc({
            endpoint: APIEndpoints.fetchInquiries,
            headerProps: {
                token: true
            },
            query: {
                onlyInquiries: true
            }
        });
        if (inquiryResponse.success) {
            seTableData(inquiryResponse.data);
        }
    }
    const headers = inquiryHeaders;

    let Inquirydata = { headers: inquiryHeaders, bodyData: tableData }
 
  return (
      <Col >
          {/* <TableComponent
            //   headers={headers}
              mobile_CardStyle=' grid-cols-2 text-left'
          /> */}
      </Col>
  )
}

export default MenuListing