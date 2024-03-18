import React, { useState } from 'react';
import { Input, Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { TextArea } = Input;

const CommentForm = ({ onSendMessage }: any) => {
    const [message, setMessage] = useState('');
    const [fileList, setFileList] = useState([]);
  
    const handleMessageChange = (e:any) => {
      setMessage(e.target.value);
    };
  
    const handleFileChange = (info:any) => {
      setFileList(info.fileList);
    };
  
    const handleSendMessage = () => {
      if (message.trim() !== '' || fileList.length > 0) {
        onSendMessage({ message, fileList });
        setMessage('');
        setFileList([]);
      }
    };
  return (
    <div>
       <TextArea
        placeholder="Type your message..."
        rows={3}
        value={message}
        onChange={handleMessageChange}
      />
      <Upload
        fileList={fileList}
        onChange={handleFileChange}
        beforeUpload={() => false}
        multiple
      >
        <Button icon={<UploadOutlined />}>Upload File</Button>
      </Upload>
      <Button type="primary" onClick={handleSendMessage}>
        Send
      </Button>
    </div>
  );
};

export default CommentForm;
