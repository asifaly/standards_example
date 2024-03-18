import { Button, Upload } from 'antd'
import React from 'react'
import { UploadOutlined, SendOutlined } from '@ant-design/icons';
import attachFileIcon from '../../Assets/images/attachFileIcon.svg'
import type { UploadProps } from 'antd';

function UploadInputComponent(props:any) {

  const uploadProps = {
    // name: 'file', // This is the name of the file field in the request
    // action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    // headers: {
    //     authorization: 'authorization-text',
    //   },
    onChange(info: any) {
        if (info.file.status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
            console.log(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
            console.error(`${info.file.name} file upload failed.`);
        }
    },
};

  return (
    <Upload {...uploadProps} className='item-center flex'>
      <img src={props.icon} className=' w-20 p-0' />
    </Upload>
  )
}

export default UploadInputComponent