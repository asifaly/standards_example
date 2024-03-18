import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';
import Inquiry from '../../Features/Inquiry/Inquiry'
import NewInquiry from '../../Features/Inquiry/InquiryDetails';
import { Col, Row, Input, Avatar } from 'antd'

import Dashboard from '../Layout/layout'
import NewApplication from '../../Features/LoanApplication/NewApplication';
import { InquiryDetailsProvider } from '../../Context/inquiryContext';
import Settings from '../../Features/Settings/Settings';
import LoanApplication from '../../Features/LoanApplication/LoanApplication';
import { LoanProviders } from '../../Context/loanContext';
import PageNotFound from '../../Features/ErrorPages/PageNotFound';

// import LayoutPage from '../../Features/Layout/layout'
function RightSideScreen() {
    const params = useParams();
    const routeName: any = params;

    const screens: any = {
        'inquiries': <Inquiry /> ,
        'inquiry': <InquiryDetailsProvider><NewInquiry /></InquiryDetailsProvider>,
        'customer-approval': <Inquiry />,
        'customer-accepted': <Inquiry />,
        'new-application':<Inquiry />,
        'sent-to-customer': <Inquiry />,
        'submitted': <Inquiry />,
        'completed': <Inquiry />,
        "settings": <Settings />,
        "loan-application": <LoanProviders><LoanApplication /></LoanProviders>
    }

    // useEffect(()=>{
    // console.log('screens[routeName] ', screens[routeName.page], routeName.page in screens, routeName.page )

    // },[])
    
    return (
        <Row className="w-full p-8 top-[100px]  pb-10 text-[#000]">
            {screens[routeName?.id] || screens[routeName?.page] || screens[routeName?.dashboard] || <PageNotFound />}
        {/* <AddCourse /> */}
        
      </Row>
    )
}

export default RightSideScreen