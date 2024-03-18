import { Modal, ModalProps } from 'antd'
import React from 'react';
import closeIcon from "../../Assets/images/closeIcon.svg"
import { CancelAndSaveButton } from './editAndDeleteComponent';

type ModalAbstractProps = ModalProps & {
    formId?:string
}

const ModalAbstract = (modalProps: ModalAbstractProps) => {
  return (
      <Modal
          closeIcon={<img src={closeIcon} alt='closeIcon' />}
          destroyOnClose={true}
          centered
          footer={<CancelAndSaveButton
              cancelAction={modalProps.onCancel}
              formId={modalProps.formId}
              confirmAction={modalProps.onOk}
              okText={modalProps.okText||"Save"}
              cancelText={modalProps.cancelText||"Cancel"}
          />}
          {...modalProps}
      />
  )
}

export default ModalAbstract