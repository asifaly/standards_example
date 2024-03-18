import { Form, Row, message } from 'antd';
import { useForm } from 'antd/es/form/Form'
import React, { useEffect, useState } from 'react';
import { AntdInputAbstract } from '../../Components/element/inputwithlable';
import { useApiCall } from '../../Hooks/apicall';
import { APIEndpoints } from '../../Services/backend/functions';
import { useSearchParams } from 'react-router-dom';
import { debounceAndSaveToFirestore } from '../../Services/firebase/query';
import Attachment from './Attachment';
import Title from 'antd/es/typography/Title';
import Loader from '../../Components/element/loader';
import { removeErrorsInLoanStore } from '../../Services/helpers/common';
import { useAppSelector } from '../../redux/store/store';
import _ from 'lodash';

const CreditAppraisal = () => {
    const [form] = useForm();
    const { isLoading, APIFunc } = useApiCall({
        method: "GET"
    });
    const { errors,disabled } = useAppSelector((state) => state["loanDetails"]);

    useEffect(() => {
        form.setFields(errors['credit-appraisal'])
    },[errors['credit-appraisal']])

    const [searchParams] = useSearchParams();
    const loanId=searchParams.get("id")
    const [creditAppraisalDetails, setCreditAppraisalDetails] = useState<any>({
        limitSanctioned: 0,
        creditDecision: null,
        processingFee: 0,
        status: null,
        paymentProcessingFeeType: "Disbursement",
        id:null
    });
    const [configs, setConfigs] = useState({
        statuses: [],
        processingFeeTypes: []
    });
    const fetchCreditAppraisal = async () => {
        const { success, data, message:errMessage } = await APIFunc({
            endpoint: APIEndpoints.loanApplicationCreditAppraisal,
            headerProps: {
                token: true
            },
            query: {
                inquiryId: Number(loanId)
            }
        });
        if (!success) {
            message.error(errMessage);
        }
        else {
            if (data?.creditAppraisalData) {
                const { limitSanctioned, paymentProcessingFeeType, processingFee, status, id } = data?.creditAppraisalData;
                setCreditAppraisalDetails({
                    ...creditAppraisalDetails,
                    limitSanctioned,
                    paymentProcessingFeeType,
                    status,
                    processingFee,
                    id: Number(id)
                });
            }
            setConfigs({
                // ...configs,
                statuses: data?.statuses?.map((s:string)=>({label:s,value:s})),
                processingFeeTypes: data?.processingFeeTypes.map((s: string) => ({ label: s, value: s }))
            });
        }
    }
    useEffect(() => {
        fetchCreditAppraisal();
    }, []);
    
    const handleValuesChange = (changedValues: any, allValues: any) => {
        removeErrorsInLoanStore({
            form,
            changedValues,
            tabKey: "credit-appraisal",
            errors
        });
        const updatedValue = {
            ...creditAppraisalDetails,
            ...allValues
        };
        setCreditAppraisalDetails(_.omitBy(updatedValue,_.isUndefined));
        debounceAndSaveToFirestore({
            inquiryId: Number(loanId),
            data: {
                "credit-appraisal": _.omitBy(updatedValue, _.isUndefined)
            }
        })
    }
  return (
      <Loader isLoading={isLoading}>
          <div className='py-2'>
              <Form
                  form={form}
                  layout='vertical'
                  disabled={disabled['credit-appraisal']}
                  onValuesChange={handleValuesChange}
                  fields={[
                      {
                          name: "creditDecision",
                          value: creditAppraisalDetails?.creditDecision
                      },
                      {
                          name: "limitSanctioned",
                          value: creditAppraisalDetails.limitSanctioned
                      },
                      {
                          name: "status",
                          value: creditAppraisalDetails.status
                      },
                      {
                          name: "paymentProcessingFeeType",
                          value: creditAppraisalDetails.paymentProcessingFeeType
                      },
                      {
                          name: "processingFee",
                          value: creditAppraisalDetails.processingFee
                      }
                  ]}
              >
                  <Row className='grid grid-cols-3 gap-7'>
                      <AntdInputAbstract
                          type={"select"}
                          FormItemsProps={{
                              label: "Credit Decision",
                              name: "creditDecision"
                          }}
                          ElementProps={{
                              disabled: true
                          }}
                      />
                      <AntdInputAbstract
                          type={"number"}
                          FormItemsProps={{
                              label: "Limit Amount Sanctioned",
                              name: "limitSanctioned"
                          }}
                          ElementProps={{
                              className: "w-full"
                          }}
                      />
                      <AntdInputAbstract
                          type={"number"}
                          FormItemsProps={{
                              label: "Processing Fee",
                              name: "processingFee"
                          }}
                          ElementProps={{
                              className: "w-full"
                          }}
                      />
                  </Row>
                  <Row className='grid grid-cols-3 gap-7'>
                      <AntdInputAbstract
                          type={"select"}
                          FormItemsProps={{
                              label: "Payment Processing Fee",
                              name: "paymentProcessingFeeType"
                          }}
                          ElementProps={{
                              options: configs.processingFeeTypes,
                              placeholder: "Select processFeeTypes",
                              className: "text-left",
                            //   disabled:true
                          }}
                      />
                      <AntdInputAbstract
                          type={"select"}
                          FormItemsProps={{
                              label: "Status",
                              name: "status",
                          }}
                          ElementProps={{
                              options: configs.statuses,
                              placeholder: "Select status",
                              className: "text-left"
                          }}
                      />
                      {/* <AntdInputAbstract
                      type={"text"}
                      FormItemsProps={{
                          label: "Processing Fee"
                      }}
                  /> */}
                  </Row>
              </Form>
              {
                  creditAppraisalDetails.id ?<>
                  <Title className='!text-[#4E6ACB] text-left mt-8 !mb-6' level={5}>Upload Documents</Title>
                  <Attachment creditAppraisalId={creditAppraisalDetails.id} />
              </>:<></>}
          </div>
      </Loader>
  )
}

export default CreditAppraisal