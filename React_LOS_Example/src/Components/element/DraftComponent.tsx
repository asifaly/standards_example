import React from 'react'
import { useAppSelector } from '../../redux/store/store'
import { Space } from 'antd';
import success from "../../Assets/images/successFlashIcon.svg";
// import info from "../../Assets/images/infoFlashIcon.svg";
import warn from "../../Assets/images/warnFlashIcon.svg";

const DraftComponent = () => {
    const formState = useAppSelector((state) => state.loanDetails.formState);
    // console.log({formState});
    const stateBasedOnFormState=() => {
        switch (formState) {
            case "draft":
                return {text:"Saving...",icon:warn}
            default:
                return {text:"Auto Saved",icon:success};
        }
    }

    const { text, icon } = stateBasedOnFormState();

    // const iconBasedOnFormState = () => {
    //     switch (key) {
    //         case value:
                
    //             break;
        
    //         default:
    //             break;
    //     }
    // }

  return (
      <Space size={3}>
          <p className='opacity-[60%]'>{text}</p>
          <img
              alt='stateIcon'
              src={icon}
              className='h-[16px] w-[16px]'
          />
    </Space>
  )
}

export default DraftComponent