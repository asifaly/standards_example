import React, { useState } from 'react'
import fileIcon from '../../Assets/images/FileIcon.svg'
import ModalWithTabs from './modalWithTabs'
import {columnsData, Bodydata} from '../../Context/modaldata1'
import { Modal } from 'antd'
import FilingDetails from './modalWithTabs'

export const Financingtype = (val: any) => {
  const [openModal, setOpenModal] = useState(false);
  const handleClick = () => {
    setOpenModal(!openModal)
  }
  return (
    <div className='w-full'>
      <img src={fileIcon} className='cursor-pointer' onClick={handleClick} alt='icon' />
      <Modal className='!w-9/12' centered destroyOnClose={true} open={openModal} footer={null} onCancel={handleClick}>
        <FilingDetails gstNo={val.props?.id} />
      </Modal>
    </div>
  )
}