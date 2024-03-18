import { Col, Row, Spin } from 'antd'
import React from 'react'
import { Card } from 'antd';
import Paragraph from 'antd/es/typography/Paragraph';

function TableCardData(props: any) {
    let { head, body, mobile_CardStyle, isLoading } = props
    return (
        <div className='max-monitor:hidden max-mobile:!block'>
            {isLoading ? <div className=' my-10 grid !mx-auto w-[71vw]'><Spin /></div> :
                <Row className=' w-full max-monitor:hidden max-mobile:!block '>
                    <Col className='w-[100%] '>
                        {body.map((item: any,index:number) => {
                            // console.log(head, 'item')
                            return <Card key={index} className='cardStyle bg-[#F3F9FF] my-2 w-[100%]'>
                                <div className={`w-[100%] grid ${mobile_CardStyle}`}>
                                    {head.map((keyitem: any) => (
                                        <div key={keyitem.name} className={keyitem.dataIndex == 'Address' ? `col-span-2` : ''}>
                                            <Paragraph className='text-[#595959] text-[18px] font-[400]'>
                                                {keyitem.name}
                                            </Paragraph>
                                            <Paragraph className='text-[#313131] text-[20px] font-[400]'>
                                                {keyitem?.isComponent ? (
                                                    <keyitem.Comp data={item[keyitem.dataIndex]} props={item} />
                                                ) : (
                                                    item[keyitem.dataIndex]
                                                )}
                                            </Paragraph>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        })}
                    </Col>
                </Row>}

        </div>

    )
}

export default TableCardData