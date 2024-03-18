import React, { useEffect, useState } from 'react'
import { Col, Modal, Row, Space, message } from 'antd'
import addContactIcon from '../../Assets/images/addContactIcon.svg';
import ModalAbstract from '../../Components/element/ModalAbstract';
// import BuyerSupplierCardComp from '../../Components/BuyerSeller/buyerCardComponet'
import { BuyerSupplierCardComp,AddEditBuyerSellerComponent } from '../../Components/BuyerSeller/buyerAddComponent'
import { AuthorizationComp } from '../../Components/HOC/Authorization'
import { CancelAndSaveButton } from '../../Components/element/editAndDeleteComponent'
import { useApiCall } from '../../Hooks/apicall';
import { APIEndpoints, DeleteAction } from '../../Services/backend/functions';
import { useSearchParams } from 'react-router-dom';
import Loader from '../../Components/element/loader';
import _ from 'lodash';
import { filterNonExistingGstIds } from '../../Services/helpers/loanApplication';


export interface BuyerSellerInterface{
  gstId: null|string,
  limit: number,
  isEdit: boolean,
  id?:number
}

const sample = [
  {
    label: "APOLLO (27AALCA0748D1ZU)",
    value: "27AALCA0748D1ZU"
  },
  {
    label: "INDIAN OIL (33AAXFB9295P1Z9)",
    value: "33AAXFB9295P1Z9"
  }
]

function BuyerSupplier() {

  const [existingBuyerSellerData, setExistingBuyerSellerData] = useState([{ gstId: 'Buyer', limit: 10000, id: 1 }]);
  const [totalBuyerSupplierList, setTotalBuyerSupplierList] = useState(sample);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchParams] = useSearchParams();
  const loanId = searchParams.get("id");
  const [randomFetcher, setRandomFetcher] = useState("");
  const {isLoading,APIFunc} = useApiCall({
    method: "GET"
  });
  const [formValues, setFormValues] = useState<BuyerSellerInterface>({
    gstId: null,
    limit: 0,
    isEdit: false,
    id:0
  });

  useEffect(() => {
    fetchBuyerSeller();
  }, [randomFetcher]);

  const fetchBuyerSeller = async () => {
    const buyerSellerResponse = await APIFunc({
      endpoint: APIEndpoints.buyerSellerList,
      headerProps: {
        token: true
      },
      query: {
        inquiryId: Number(loanId)
      }
    });
    if (!buyerSellerResponse.success) {
      return message.error(buyerSellerResponse.message)
    }
    setExistingBuyerSellerData(buyerSellerResponse?.data?.addedBuyerSellerData);
    setTotalBuyerSupplierList(buyerSellerResponse?.data?.gstInvoiceData)
  }

  const filteredBSList = filterNonExistingGstIds(existingBuyerSellerData, totalBuyerSupplierList);

  const handleAddBuyerCard = () => {
    setFormValues({
      gstId: null,
      limit: 0,
      isEdit: false
    });
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const handleEditBtnClick = (index: number) => {
    setIsModalVisible(true);
    // setExistingBuyerSellerData()
    setFormValues({
      gstId: existingBuyerSellerData[index].gstId,
      limit: existingBuyerSellerData[index].limit,
      id:existingBuyerSellerData[index].id,
      isEdit: true
    });
  }

  const deleteAction = async(index: number) => {
    const bs = existingBuyerSellerData[index];
    const deleteResponse = await DeleteAction({
      endpoint: APIEndpoints.buyerSellerList,
      headerProps: {
        token: true
      },
      query: {
        id: bs.id
      }
    });
    if (!deleteResponse?.success) {
      return message.error(deleteResponse?.message)
    }
    message.success(deleteResponse?.message);
    const filteredBuyerSellers = existingBuyerSellerData.filter((bs, i) => i !== index);
    setExistingBuyerSellerData(filteredBuyerSellers);
  }

  return (
    <Loader isLoading={isLoading}>
      <Row wrap className='mt-0 flex max-mobile:mt-2'>
        <Space size={20} wrap>
          {existingBuyerSellerData.map((buyerCard, index) => (
            <BuyerSupplierCardComp
              name={buyerCard.gstId}
              limit={buyerCard.limit}
              key={index}
              editBtnClick={() => handleEditBtnClick(index)}
              id={buyerCard.id}
              deleteBtnClick={()=>deleteAction(index)}
            />
          ))}
        </Space>
        {/* <AuthorizationComp> */}
          <>
            <Col
              className='flex cursor-pointer w-[250px] py-10 ml-5 max-mobile:w-[300px] max-mobile:mx-auto bg-[#fff] border-dashed border-2 rounded-2xl border-[#4E6ACB]'
              onClick={handleAddBuyerCard}
            >
              <img
                src={addContactIcon}
                className='w-[50px] align-middle mx-auto items-center justify-center'
                alt='icon'
              />
            </Col>
          </>
        {/* </AuthorizationComp> */}
        <ModalAbstract
          open={isModalVisible}
          onCancel={handleModalClose}
          formId={"buyerSellerForm"}
        >
          <AddEditBuyerSellerComponent
            closeModal={handleModalClose}
            formValues={formValues}
            buyerSellersList={filteredBSList}
            setRandomFetcher={setRandomFetcher}
          />
        </ModalAbstract>
      </Row>
    </Loader>
  );
};

export default BuyerSupplier;