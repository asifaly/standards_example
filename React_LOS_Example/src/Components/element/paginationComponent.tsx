import { Col, Pagination, PaginationProps, Row } from 'antd'
import Paragraph from 'antd/es/typography/Paragraph'
import React, { useState } from 'react';
import { Select } from 'antd';

const { Option } = Select;

// interface paginationProps{
//   totalRowCount?:number
// }

type paginationProps = {
  totalRowCount: number,
  limit?: number,
  currentResultCount: number
  handleLimitChange?:(e:number)=>void
} & PaginationProps

function PaginationComponent(paginationProps: paginationProps ) {
  const { totalRowCount, limit, currentResultCount,handleLimitChange,...antdPaginationProps } = paginationProps;
  const itemsPerPageOptions = [10, 20, 30, 50].filter((options) => options <= totalRowCount);// Define your options here
  const currentPage = antdPaginationProps.current || 0;
  const itemsPerPage = limit || 10;
  const beginingCount = currentResultCount?((currentPage - 1) * itemsPerPage) + 1:0;
  const endCount = ((currentPage-1) * itemsPerPage)+ currentResultCount;
  return (
    <Row className='bg-[#F3F9FF] py-3  w-full flex items-center justify-between mx-auto px-5 max-mobile:px-0  rounded-xl mt-6  max-mobile:bg-[#fff] max-mobile:rounded-none '>
      <Col className='flex items-center '>
        <Paragraph className=' !mb-0 text-[#000000] text-[14px] font-[400] ' > Showing</Paragraph>
        <Select
          value={itemsPerPage}
          onChange={handleLimitChange}
          className='w-[67px] h-[40px] rounded-2xl mx-2 items-center p-1 pageselector'
          disabled={itemsPerPageOptions.length===0}
        >
          {itemsPerPageOptions.map((option) => (
            <Select.Option key={option} value={option}>
              {option}
            </Select.Option>
          ))}
        </Select>
        <Paragraph className=' !mb-0 text-[#000000] text-[14px] font-[400]' >Per Page</Paragraph>
        <Paragraph className='!mb-0 ml-5 text-[#000000] text-[14px] max-laptop:mx-2' ><span className='font-[600]'>{beginingCount}-{endCount}</span> of  <span className='font-[600] mr-1'>{totalRowCount}</span> results </Paragraph>
      </Col>
      <Col className='circle-pagination max-tablet:mt-4 max-mobile:mt-5'>
        <Pagination
          className='items-center flex justify-center align-middle max-mobile:mt-3  '
          // defaultCurrent={currentPage}
          pageSize={limit}
          total={totalRowCount}
          responsive={true}
          showSizeChanger={false}
          // onChange={handelPageNumber}
          {
          ...antdPaginationProps
          }
        /> 
      </Col>
   </Row>
  )
}

export default PaginationComponent