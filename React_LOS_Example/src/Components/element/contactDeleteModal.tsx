import React, { useState } from 'react';
import { Modal, Button, Col, Row } from 'antd';
import deleteIcon from '../../Assets/images/deleteIcon.svg'
import Paragraph from 'antd/es/typography/Paragraph';


interface ModalProps {
    visible?: boolean,
    onCancel: any,

}

function MyModal({ visible, onCancel }: ModalProps) {
    const [isModalVisible, setIsModalVisible] = useState(visible);

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <Modal
            visible={visible}
            // className=' bg-[#F7F7F7] rounded-lg w-[400px]'
            centered
            okType='default'
            onOk={handleOk}
            onCancel={onCancel}
            className="flex !bg-[#F7F7F7] rounded-lg w-[400px] mx-auto items-center text-center"
            footer={[
                <div className='flex mx-auto justify-center mb-4'>
                    <Button key="cancel" onClick={onCancel} className='w-[103px] h-[40px]'>
                        Cancel
                    </Button>,
                    <Button key="ok" type="default" onClick={handleOk} className='bg-[#4E6ACB] text-[#fff] w-[103px] h-[40px]'>
                        Yes
                    </Button>
                </div>
            ]}
        >
            <Row className=' flex mx-auto items-center'>
                <Col className='mx-auto' >
                    <img src={deleteIcon} alt="Modal Image" className=' mx-auto' />
                </Col>
                <Col className='mx-auto' >
                    <p className=' text-[22px] font-[400] text-[#313131] '>Are you sure to delete the contact details ?</p>
                </Col>
            </Row>
        </Modal>
    );
}

export default MyModal;
