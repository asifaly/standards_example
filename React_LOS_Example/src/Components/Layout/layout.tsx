import React, { useEffect, useState } from 'react';
import { Layout, Space, Menu, Button, theme } from 'antd';
        import SideNavBar from '../../Features/SideNavbar/SideNavbar'
import logo from '../../Assets/images/logo.svg'
import smallLogo from '../../Assets/images/smalllogo.png'
import HeaderPage from '../Header/Header';
import RightSideScreen from '../RightSideScreen/RightSideScreen';
import { useApiCall } from '../../Hooks/apicall';
import { useConfigurations } from '../../Hooks/configurations';
import { APIEndpoints } from '../../Services/backend/functions';
import { ConfigurationsProviders, configurationCases } from '../../Context/configurationsContext';

const Dashboard = () => {
    const { Header, Sider, Content } = Layout;
    const [collapsed, setCollapsed] = useState(false);
    const { APIFunc } = useApiCall({
        method: "GET"
    });
    const { state, dispatch } = useConfigurations();

    const fetchConfigurables = async () => {
        const { success, data } = await APIFunc({
            endpoint: APIEndpoints.fetchConfigurables,
            headerProps: {
                token: true
            }
        });
        if (success) {
            dispatch({
                type: configurationCases.fetchConfigurations,
                payload: data
            })
        }
    }
    useEffect(() => {
        fetchConfigurables()
    }, [state?.fetchString]);

    return (
        <Space direction="vertical" style={{ width: '100%' }} >
            <Layout className=''>
                <Header className=' sticky  h-24 p-0 flex items-center justify-between pr-10 text-[#fff] bg-[#F3F9FF]' >
                    {collapsed ? <img className='m-5 w-[35px] h-[35px] ease-in-out' src={smallLogo} alt='logo' onClick={() => setCollapsed(!collapsed)} /> : <img className='m-5 w-[140px] h-[50px] ease-in-out' src={logo} alt='logo' onClick={() => setCollapsed(!collapsed)} />}
                    <HeaderPage />
                </Header>
                <Layout className='sticky max-monitor:h-[89vh]  max-desktop:h-[84vh] '>
                    <Sider className={`text-center  !bg-[#F3F9FF] text-[#fff] max-mobile:${collapsed ? 'hidden' : 'block'}  `} width={collapsed ? '80px' : '250px'} trigger={null} collapsible collapsed={collapsed}>
                        <SideNavBar />
                    </Sider>
                    <Content className=' text-center bg-[#FFFF] text-[#fff] overflow-y-scroll' >
                        <RightSideScreen />
                    </Content>
                </Layout>
            </Layout>
        </Space>
    )
}

export const ConfigurationProviderComp = () => {
    return <ConfigurationsProviders>
        <Dashboard />
    </ConfigurationsProviders>
}
export default ConfigurationProviderComp