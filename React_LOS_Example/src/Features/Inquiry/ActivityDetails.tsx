import { Col, Divider, Form, Row, Select } from 'antd'
import { AntdInputAbstract } from '../../Components/element/inputwithlable'
import { useInquiryDetails } from '../../Hooks/inquiryDetails';

import { Layout, Menu, Card, List } from 'antd';
import Paragraph from 'antd/es/typography/Paragraph';
import { formatDate } from '../../Services/helpers/common';
import Comments from '../../Components/Comments/Comments';
import { useConfigurations } from '../../Hooks/configurations';
import _ from 'lodash';
import dayjs from "dayjs";

import moment from 'moment';
import { FormInstance, useForm } from 'antd/es/form/Form';
import { inquiryCases } from '../../Context/inquiryContext';
import { activityStatuses } from '../../configs/common';

const { Header, Content, Sider } = Layout;

type activityDetailsType = {
    inquiryForm: FormInstance
}

function ActivityDetails({inquiryForm}: activityDetailsType) {
    const { state: { inquiryDetails,isNewInquiry },dispatch } = useInquiryDetails();
    const { state } = useConfigurations();
    const [form] = useForm();
    const { comments } = inquiryDetails;
    // console.log({state});
    const statusTypes = state?.objectConfigurations?.Status?.filter((s: any) => activityStatuses.includes(s?.value));
    const selectHandleChange = (value: any, name: string) => {
        dispatch({
            type: inquiryCases.HANDLE_CHANGE_INQUIRY,
            payload: {
                name,
                value
            }
        })
    }
    const filterOptions = (inputValue: string, option: any) => option.label.toLowerCase().includes(inputValue.toLowerCase())
    return (
        <Form
            layout='vertical'
            form={inquiryForm}
            id='inquiryDetailsSubmit'
            fields={[
                {
                    name: ["inquiryStatus"],
                    value: inquiryDetails?.status
                },
                {
                    name: "nextActionDate",
                    value: inquiryDetails?.nextActionDate ? dayjs(new Date(inquiryDetails?.nextActionDate).getTime()) : null
                },
            ]}
            
        >           
         <Row className=' grid grid-cols-3 gap-x-7 max-tablet:grid-cols-2 max-mobile:grid-cols-1 '>
                <Col>
                    <AntdInputAbstract
                        FormItemsProps={{
                            label: "Inquiry Status",
                            name: "inquiryStatus",
                            rules: [
                                {
                                    required: true,
                                    message: "Please select inquiry Status field "
                                }
                            ],
                        }}
                        type='select'
                        ElementProps={{
                            // defaultValue: "sathish",
                            className: "text-left grid",
                            showSearch: true,
                            // children: optionElements(countries)
                            filterOption:filterOptions,
                            options: statusTypes || [],
                            onChange: (value: number) => selectHandleChange(value, "status"),
                            placeholder:"Select Status of Inquiry"

                        }}
                    />
                </Col>
                <Col>
                    <AntdInputAbstract
                        FormItemsProps={{
                            label: "Next Action Date",
                            name: "nextActionDate",
                            rules: [
                                {
                                    required: true,
                                    message: "Please select Next Action Date"
                                }
                            ],
                        }}
                        type='date'
                        ElementProps={{
                            className: "text-left w-full",
                            picker: "date",
                            onChange: (date: any, dateString: string) => {
                                selectHandleChange(dateString?dateString:null,"nextActionDate")
                            },
                            placeholder: "Select Next Action Date",
                            disabledDate: (current) => {
                                return current && current < moment().endOf('day').subtract(1,"day");
                            },
                        }}
                    />
                </Col>
            </Row>
            {/* {!isNewInquiry && */}
                <>
                <Paragraph
                    className='mt-5 text-left text-[22px] font-[500] text-[#313131] '
                >Internal Comments</Paragraph>
                <Comments
                    comments={comments}
                />
                </>
            {/* } */}
        </Form>
    )
}

export default ActivityDetails