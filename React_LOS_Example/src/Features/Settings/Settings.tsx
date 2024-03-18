import { Row, Tabs,Typography,Button, TabsProps } from 'antd'
import Profile from './Profile';
import Users from './Users';
import Configurations from './Configurations';
import { UsersProviders } from '../../Context/usersContext';
import { useNavigate, useParams } from 'react-router-dom';
import { ConfigurationsProviders } from '../../Context/configurationsContext';
import { useAppSelector } from '../../redux/store/store';
import { arraySpreading } from '../../Services/helpers/loanApplication';
import { userTypes } from '../../configs/common';

const Settings = () => {
    const { Title } = Typography;
    const navigate = useNavigate();
    const { userDetails } = useAppSelector((state) => state["userDetails"]);
    const params:any = useParams();
    const items: TabsProps['items'] = [
        {
            key: 'profile',
            label: 'My Profile',
            children: <Profile />

        },
        ...arraySpreading([{
            key: 'users',
            label: 'Users',
            children: <UsersProviders><Users /></UsersProviders>,
        },
            {
                key: 'configurations',
                label: 'Configurations',
                children: <Configurations />,
            }],userDetails.userTypeId===userTypes.admin)
    ];
    const handleTabChange = (key: string) => {
        navigate(`/settings/${key}`);        
    }

  return (
      <div className='py-2 text-left w-full'>
          <Row className='flex justify-between'>
              <Title className='text-[#101041]' level={4}>Settings</Title>
              {/* {
                  ["", "profile"].includes(params?.page) && <Button className={"bg-[#4E6ACB]"} type='primary'>Save</Button>
              } */}
          </Row>
          <Tabs className=' '
              defaultActiveKey={params?.page}
              activeKey={params?.page}
              items={items}
              onChange={handleTabChange}
          />
      </div>

  )
}

export default Settings