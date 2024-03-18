import React, { useEffect, useState } from 'react';
import { Modal, Tabs, Table, Space, Button, ButtonProps, message } from 'antd';
import { TableComponent } from '../Table/table';
import { useApiCall } from '../../Hooks/apicall';
import { filingDetailsHeaders } from '../../Features/Inquiry/table';
import axios from 'axios';
import { thirdPartyServicesAPI } from '../../configs/common';

// const { TabPane } = Tabs;
type FilingTabs = "gstr1" | "gstr3b";

interface tabsProps{
  displayText: string,
  key:FilingTabs
}
interface FilingDetailsProps{
  gstNo:string
}

// const ModalWithTabs = ({ visible, onCancel, tableJson }: ModalProps) => {

//   const [activeTab, setActiveTab] = useState('tab1');

//   const handleTabChange = (key: string) => {
//     setActiveTab(key);
//   };

//   // console.log(tableJson, 'tableJson')
//   return (
//     <Modal open={visible} onCancel={onCancel} footer={null} className='' >
//     <Tabs activeKey={activeTab} onChange={handleTabChange}   type="card" className='w-full tabmodal'>
//         {tableJson.map((item: any, index: number) => (
//           <TabPane key={`tab${index + 1}`} tab={item?.tabName}>
//             {/* {item} */}
//           {/* {item} */}

//             <TableComponent headers={item.headers} bodyData={item.bodyData}  isLoading={false}/>
//           </TabPane>
//         ))}
//       </Tabs>
//     </Modal>
//   );
// };

const FilingDetails = ({gstNo}:FilingDetailsProps) => {
  const [activeTab, setActiveTab] = useState<FilingTabs>("gstr1");
  const [isLoading, setLoading] = useState(false);
  // const { isLoading, APIFunc } = useApiCall({
  //   method: "POST"
  // });

  const [filingData, setFilingData] = useState({
    gstr1: [],
    gstr3b:[]
  });
  // console.log({filingData});

  const bodyData = filingData[activeTab];

  useEffect(() => {
    fetchFilingData();
  }, []);


  const fetchFilingData = async () => {
    setLoading(true);
    const response = await axios.post(thirdPartyServicesAPI + "/get_gst_filing_status", {
      "gst_no":gstNo
    });
    if (response.data?.status !== "success") {
      message.error(response.data?.message)
    }
    else {
      setFilingData({
        gstr1: response.data?.GSTR1,
        gstr3b: response.data?.GSTR3B
      });
    }
    setLoading(false);
  }

  const activeTabStyle = (tab: FilingTabs) => {
    return activeTab === tab ? "bg-[#4E6ACB] text-[fff]" : "text-black bg-[#F3F9FF]"
  }
  const handleTabChange = async (tab: FilingTabs) => {
    // if(activeTab===tab)
    setActiveTab(tab);
  }

  const tabs:tabsProps[] = [
    {
      displayText: "Filing Details for GSTR1",
      key:"gstr1"
    },
    {
      displayText: "Filing Details for GSTR3B",
      key:"gstr3b"
    }
  ]
  return (
    <>
      <Space wrap>
        {
          tabs.map((tab, index) => (
            <Button key={index} disabled={activeTab===tab.key} onClick={() => handleTabChange(tab.key)} type='primary' className={`h-[45px] disabled:bg-[#4E6ACB] disabled:text-[#fff] ${activeTabStyle(tab.key)}`}>
              {
                tab.displayText
              }
      </Button>
          ))
        }
      </Space>
      <div className='h-[80vh] overflow-y-auto mt-2 px-2'>
        <TableComponent
          headers={filingDetailsHeaders}
          bodyData={bodyData}
          isLoading={isLoading}
        />
      </div>
    </>
  )
}

export default FilingDetails;