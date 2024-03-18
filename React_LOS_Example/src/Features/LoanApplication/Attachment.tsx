import { Button, Col, Form, Row, message } from 'antd'
import React, { useEffect, useState } from 'react'
import { AntdInputAbstract } from '../../Components/element/inputwithlable'
import uploadIcon from '../../Assets/images/uplaodIcon.svg'
import { TableComponent } from '../../Components/Table/table'
import { attachmentHeader } from '../Inquiry/table'
import { useApiCall } from '../../Hooks/apicall'
import { APIEndpoints } from '../../Services/backend/functions'
import { useParams, useSearchParams } from 'react-router-dom'
import { attachmentCases, useAttachmentDetails } from '../../Context/attachmentContext'
import _ from 'lodash'
import { generateRandomHash } from '../../Services/helpers/common'
import { uploadFile } from '../../Services/firebase/query'
import { useForm } from 'antd/es/form/Form'

interface AttachmentProps{
  creditAppraisalId?:number
}

function Attachment({ creditAppraisalId }: AttachmentProps) {
  const [form] = useForm();
  const [searchParams] = useSearchParams();
  const params = useParams();
  const isCreditAppraisalPage = params?.id === "credit-appraisal";
  const loanId = searchParams.get("id");
  const { state: { attachments, documentTypes, fetchString }, dispatch } = useAttachmentDetails();
  // console.log({attachments,documentTypes});
  const filterDocumentTypes = _.filter(documentTypes, (doc) => {
    return !_.find(attachments, (ath) => doc?.value === ath?.documentType?.id)
  });
  // console.log({filterDocumentTypes});
  const { isLoading,APIFunc } = useApiCall({
    method: "GET"
  });
  const { isLoading: addingAttachment, APIFunc: addAttachmentFunc } = useApiCall({
    method: "POST"
  });

  useEffect(() => {
    fetchAttachmentDetails();
  }, [fetchString]);
  const [attachment, setAttachment] = useState({
    type: null,
    file: {
      name: "",
      key: "",
      url: ""
    }
  });
  const [fileUploadProgress, setFileUploadProgress] = useState(false);

  const fetchAttachmentDetails = async () => {
    const { success, data } = await APIFunc({
      endpoint: APIEndpoints.loanAttachmentsByInquiryId,
      headerProps: {
        token:true
      },
      query: {
        inquiryId: Number(loanId),
        ...isCreditAppraisalPage && {
          creditAppraisalId
        } 
      }
    });
    if (success) {
      dispatch({
        type: attachmentCases.SET_ATTACHMENTS,
        payload: data
      });
    }
  }
  const handleFileUpload = async({ file }: any) => {
    setFileUploadProgress(true);
    const fileKey = generateRandomHash();
    const fileURL = await uploadFile(fileKey, file);
    setAttachment({
      ...attachment,
      file: {
        name: file.name,
        key: fileKey,
        url:fileURL
      }
    })
    setFileUploadProgress(false);
  }
  // console.log({attachment});

  const handleValueChange = (changedValues:Record<string,any>,allValues:Record<string,any>) => {
    setAttachment({
      ...attachment,
      ...changedValues
    });
  }
  const handleSubmit = async(values:any) => {
    const { success } = await addAttachmentFunc({
      endpoint: APIEndpoints.attachments,
      headerProps: {
        token: true
      },
      body: {
        attachments: [
          {
            name: attachment.file.name,
            url: attachment.file.url,
            documentTypeId: attachment.type,
            key: attachment.file.key,
            inquiryId: Number(loanId),
            ...isCreditAppraisalPage && {
              creditAppraisalId
            }
          }
        ]
      }
    });
    if (success) {
      dispatch({
        type: attachmentCases.REFRESH
      });
      message.success("Attachment added successfully");
      setAttachment({
        type:null,
        file: {
          name: "",
          key: "",
          url: ""
        }
      })
    }
  }

  return (
    <Form
      layout='vertical'
      form={form}
      fields={[
        {
          name: "type",
          value:attachment.type
        },
        {
          name: "file",
          value:attachment.file.name
        }
      ]}
      onValuesChange={handleValueChange}
      onFinish={handleSubmit}
    >
      <Row className='grid grid-cols-4 gap-3 items-center'>
        <Col>
          <AntdInputAbstract
            FormItemsProps={{
              label: "Type",
              name: "type",
              rules: [
                {
                  required: true,
                  message: "Please Fill Type field "
                }
              ],
            }}
            type='select'
            ElementProps={{
              className: "text-left ",
              options: filterDocumentTypes,
              placeholder: "Select Document Type"
            }}
          />
        </Col>
        <Col>
          <AntdInputAbstract
            FormItemsProps={{
              label: "Upload File",
              name: "file",
              rules: [
                {
                  required: true,
                  message: "Attach File"
                }
              ],
            }}
            type='upload'
            ElementProps={{
              className: "text-left",
              icon: uploadIcon,
              uploadProps: {
                customRequest: handleFileUpload,
                showUploadList:false
              },
              inProgress: fileUploadProgress,
              ...attachment.file.name.length && {
                children: <p >{attachment.file.name}</p>
              }

            }}
          />
        </Col>
        <Col className='' >
          <Button htmlType='submit' type='primary' className='bg-[#4E6ACB] text-[#fff]'>Add</Button>
        </Col>
      </Row>
      <TableComponent
        headers={attachmentHeader}
        bodyData={attachments}
        isLoading={isLoading}
      />
    </Form>
  )
}

export default Attachment