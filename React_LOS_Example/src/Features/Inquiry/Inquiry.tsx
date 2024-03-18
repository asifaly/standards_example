import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { TableComponent } from '../../Components/Table/table';
import { useNavigate, NavLink, createSearchParams, useParams } from 'react-router-dom';
import { Col, Row } from 'antd';
import { useApiCall } from '../../Hooks/apicall';
import { APIEndpoints } from '../../Services/backend/functions';
import { inquiryHeaders } from './table';
import { routeNames } from '../Routes/RouteName';
import PaginationComponent from '../../Components/element/paginationComponent';
import { generateRandomHash, pageToStatusId, statusToTableHeadings } from '../../Services/helpers/common';
import { useAppSelector } from '../../redux/store/store';
import { AuthorizationComp } from '../../Components/HOC/Authorization';


function Inquiry() {
  const navigate = useNavigate();
  const params: any = useParams();
  const { userDetails: { isKrediqUser } } = useAppSelector((state) => state["userDetails"])
  const onlyInquiries = ["inquiries"];
  const isInquiry = onlyInquiries.includes(params?.page);


  const { isLoading, APIFunc } = useApiCall({
    method: "GET"
  });

  const [inquiryDetails, setInquiryDetails] = useState({
    data: [],
    totalCount: 0,
    currentPage: 1,
    limit: 10,
  });

  // Memoized function for fetching inquiry details
  const fetchInquiryDetails = useCallback(async () => {
    const inquiryResponse = await APIFunc({
      endpoint: APIEndpoints.fetchInquiries,
      headerProps: {
        token: true,
      },
      query: {
        onlyInquiries: isInquiry,
        offset: inquiryDetails.currentPage,
        limit: inquiryDetails.limit,
        ...!isInquiry && {
          statusId: pageToStatusId[params?.page],
        },
      },
    });

    if (inquiryResponse.success) {
      setInquiryDetails((prevDetails) => ({
        ...prevDetails,
        data: inquiryResponse.data,
        totalCount: inquiryResponse.count,
      }));
    }
  }, [inquiryDetails.currentPage, inquiryDetails.limit, params?.page]);

  // Effect to fetch inquiry details on mount and whenever dependencies change
  useEffect(() => {
    fetchInquiryDetails();
  }, [fetchInquiryDetails]);

  // Effect to reset currentPage to 1 when route URL changes
  useEffect(() => {
    setInquiryDetails((prevDetails) => ({
      ...prevDetails,
      currentPage: 1,
    }));
  }, [params?.page]);

  // Memoized inquiryDetails object to use in your component
  const memoizedInquiryDetails = useMemo(() => inquiryDetails, [inquiryDetails]);

  const handlePageChange = (pageNumber: number) => {
    setInquiryDetails({
      ...inquiryDetails,
      currentPage: pageNumber
    })
  }

  const handleClickRow = (rowValue: any) => {
    let pathName = "";
    const inquiryURL = `/dashboard/inquiry/company-details`;
    const loanApplicationURL = "/dashboard/loan-application/"
    switch (true) {
      case !isKrediqUser || !isInquiry:
        pathName = loanApplicationURL
        break;
      default:
        pathName = inquiryURL;
        break;
    }
    // console.log({rowValue});
    // if()

    // const pathName = isInquiry ? `/dashboard/inquiry/company-details` :"/dashboard/loan-application/company-details"
    navigate({
      pathname: pathName,
      search: createSearchParams({
        id: rowValue?.id,
        // ...!isInquiry && {
        //   status:params?.page
        // }
      }).toString()
    })
  }

  const handleLimitChange = (limitValue: number) => {
    let pageNum;
    if ((memoizedInquiryDetails.currentPage * limitValue) > memoizedInquiryDetails.totalCount) {
      pageNum = Math.ceil(memoizedInquiryDetails.totalCount / limitValue);
    }
    else {
      pageNum = memoizedInquiryDetails.currentPage;
    }
    setInquiryDetails({
      ...memoizedInquiryDetails,
      limit: limitValue,
      currentPage: pageNum
    });
  }

  const newInquiryAction = (event: any) => {
    // event.preventDefault();
    localStorage.setItem("inquiryKey", generateRandomHash());
  }

  return (
    <Row className='block'>
      <Col className='sticky top-0 z-[1] bg-[#fff] flex items-center mx-auto py-4  justify-between '>
        <p className='text-[#101041] mb-0 text-[22px] font-[500] '>{statusToTableHeadings[params?.page]}</p>
        {isInquiry &&
          <AuthorizationComp
            children={<NavLink onClick={newInquiryAction} to={routeNames.newInquiry}
              className='bg-[#4E6ACB] text-[#fff] text-[15px] font-[400] items-center flex py-2 px-4 rounded-[9px]'>New Inquiry </NavLink>
            }
          />
        }
      </Col>
      <Col className=' '>
        <TableComponent
          headers={inquiryHeaders}
          bodyData={memoizedInquiryDetails.data}
          mobile_CardStyle=' grid-cols-2 text-left'
          isLoading={isLoading}
          // isNavigatable={true}
          navFunc={handleClickRow}
        />
      </Col>
      <Col className=' w-full items-center'>
        <PaginationComponent
          totalRowCount={memoizedInquiryDetails.totalCount}
          current={memoizedInquiryDetails.currentPage}
          onChange={handlePageChange}
          limit={memoizedInquiryDetails.limit}
          defaultCurrent={1}
          currentResultCount={memoizedInquiryDetails.data.length}
          handleLimitChange={handleLimitChange}
        />
      </Col>
    </Row>
  )
}

export default Inquiry