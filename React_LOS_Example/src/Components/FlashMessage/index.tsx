import { Col, Row, Skeleton, Typography } from 'antd'
import React, { useEffect, useState } from 'react';
import reject from "../../Assets/images/failFlashIcon.svg";
import success from "../../Assets/images/successFlashIcon.svg";
import info from "../../Assets/images/infoFlashIcon.svg";
import warn from "../../Assets/images/warnFlashIcon.svg";
import closeIcon from "../../Assets/images/closeOutline.svg";
import { useApiCall } from '../../Hooks/apicall';
import { APIEndpoints } from '../../Services/backend/functions';
import { useSearchParams } from 'react-router-dom';
import { flashMessageColorPickerFromStatus } from '../../Services/helpers/common';
import { loanCases, useLoanDetails } from '../../Context/loanContext';

const FlashMessage = () => {
    const [showFlashMsg, setShowFlashMsg] = useState(true);
    const { state: { status, flashMessage }, dispatch } = useLoanDetails();
    const flashMessageVisible = showFlashMsg && flashMessage;
    const UIPropsByStatus = flashMessageColorPickerFromStatus(status);
    const handleCloseAction = () => {
        setShowFlashMsg(!showFlashMsg);
    }

    return (
        <div className=' my-3'>
            {
                flashMessageVisible &&
                    <Row className={`${UIPropsByStatus.wrapperbg} relative w-full space-x-4`}>
                        <span className={`w-[6px] ${UIPropsByStatus.bg}`}></span>
                        <div className='flex items-center py-4 space-x-4 w-[97%]'>
                            <img
                                alt='infoIcon'
                                src={UIPropsByStatus.icon}
                                className='h-[35px] w-[35px]'
                            />
                            <div className='flex flex-col text-left space-y-1 w-[97%]'>
                                <h3 className='mb-0 font-[600] capitalize text-[20px]'>{status}</h3>
                                <p className='text-[#485B6C]'>{flashMessage}</p>
                            </div>
                            <div className='flex justify-center w-1/12'>
                                <img
                                    alt='closeIcon'
                                    src={closeIcon}
                                    className='h-[20px] w-[20px] object-cover cursor-pointer'
                                    onClick={handleCloseAction}
                                />
                            </div>
                        </div>
                    </Row>
            }
        </div>
    //   <Row>
    //       <Col></Col>
    //       <Col>
    //           <img
    //               alt='infoIcon'
    //               src={success}
    //           />
    //       </Col>
    //       <Col>
    //           <Title level={3}>{flashHighlightMessage}</Title>
    //       </Col>
    // </Row>
  )
}

export default FlashMessage