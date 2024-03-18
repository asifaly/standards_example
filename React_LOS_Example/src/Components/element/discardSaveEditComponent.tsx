import { Button, Row } from 'antd'
import Paragraph from 'antd/es/typography/Paragraph'
import React from 'react'

function DiscardSaveEditComponent() {
  return (
    <Row className=' flex items-center  justify-end max-mobile:mb-5 '>
      <Paragraph className='text-[#4E6ACB] text-[16px] font-400 mr-5 mt-5 self-center cursor-pointer max-mobile:hidden ' >Discard Changes</Paragraph>
      <Button className=' w-[85px] h-[35px] border-[#4E6ACB] rounded-lg text-[#4E6ACB] text-[16px] mr-5' >Edit</Button>
      <Button className=' w-[85px] h-[35px] bg-[#4E6ACB] rounded-lg text-[#fff] text-[16px] pr-5' >Save</Button>
    </Row>
  )
}

export default DiscardSaveEditComponent