import { Col, Row } from 'antd'
import Paragraph from 'antd/es/typography/Paragraph'
import React from 'react'
import { TableComponent } from '../../Components/Table/table'
import { columnsData, Bodydata } from '../../Components/Table/tableData'
import LoanApplication from './LoanApplication'
import { fetchData, upsertAtFirestore } from '../../Services/firebase/query'


function NewApplication() {
    let Inquirydata = { headers: columnsData, bodyData: Bodydata }
    // // console.log();
    // upsertAtFirestore(9,{
    // age:"sathish"
    // })

    return (
        // <Row>
        //     {/* <Col className='flex items-center mx-auto w-[86%] mt-10 justify-between '>
        //         <Paragraph className='text-[#101041] text-[22px] font-[400] '>New Application</Paragraph>
        //     </Col> */}
        //     {/* <TableComponents TABLE_JSON={Inquirydata} /> */}
        // </Row>
            <LoanApplication/>

    )
}

export default NewApplication