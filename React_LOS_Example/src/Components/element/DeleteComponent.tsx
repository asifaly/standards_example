import React, { useState } from 'react'
import { Button, Modal, message } from 'antd'
import { UserDeleteConfirm } from './editAndDeleteComponent';
import { useApiCall } from '../../Hooks/apicall';
import { APIEndpoints } from '../../Services/backend/functions';
import { attachmentCases, useAttachmentDetails } from '../../Context/attachmentContext';
import { deleteFile } from '../../Services/firebase/query';

export const DeleteComponent = (rowValues: any) => {
    const [openModal, setOpenModal] = useState(false);
    const { APIFunc } = useApiCall({
        method: "DELETE"
    });
    const {dispatch} = useAttachmentDetails();
    const handleModalOpenState = () => {
        setOpenModal(!openModal);
    }
    const confirmDelete = async () => {
        const { success,message:erroMessage } = await APIFunc({
            endpoint: APIEndpoints.attachments,
            headerProps: {
                token: true
            },
            query: {
                key: rowValues?.props?.key
            }
        });
        if (success) {
            message.success("Attachment deleted");
            await deleteFile(rowValues?.props?.key);
            dispatch({
                type: attachmentCases.REFRESH
            });
        }
        else {
            message.error(erroMessage);
        }
        handleModalOpenState();
    }
    return (
        <>
            <Button
                type='primary'
                onClick={handleModalOpenState}
                danger>Delete</Button>
            <Modal
                footer={null}
                closable={false}
                onCancel={handleModalOpenState}
                destroyOnClose={true}
                centered
                open={openModal}>
                <UserDeleteConfirm
                    cancelAction={handleModalOpenState}
                    data={{}}
                    confirmAction={confirmDelete}
                />
            </Modal>
        </>
    )
}

export const TypeField = (rowValues: Record<string, any>) => {
    return (
        <span>
            {
                rowValues?.data?.type
            }
        </span>
    )
}


export const AnchorField = ({data,props}: Record<string, any>) => {
    // console.log({rowValues});
    return (
        <a target='_blank' rel='noreferrer' href={props?.url}>{data}</a>
    )
}
// export default DeleteComponent