import Paragraph from 'antd/es/typography/Paragraph';
import {Typography} from 'antd';

const InternalServerError = () => {
    const { Title } = Typography;
  return (
      <div className='h-[100vh] flex flex-col items-center justify-center'>
          {/* <Typography leve>Something Went Wrong</Typography> */}
          <Title level={3}>Something Went Wrong</Title>
          <Paragraph>Internal Server Error</Paragraph>
    </div>
  )
}

export default InternalServerError;