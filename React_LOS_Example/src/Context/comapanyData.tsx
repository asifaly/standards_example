import type { ColumnsType } from 'antd/es/table';
import buttonComponent from '../Components/element/VerifyGstButton';
import { TableHeadersProps } from '../Components/Table/table';
import VerifyGstButton from '../Components/element/VerifyGstButton';


interface DataType {
    key: React.Key;
    name: string;
    age: number;
    address: string;
    Verify?:any
}

export const GSTVerificationTableHeaders:TableHeadersProps[] = [
    {
        name: 'GST No',
        dataIndex: 'gstId',
        headerClass: 'w-[150px]'

    },
    {
        name: 'Reg Date',
        dataIndex: 'registrationDate',
        headerClass: 'w-[150px]'
    },
    {
        name: 'Address',
        dataIndex: 'location',
        headerClass: 'w-[500px]'
    },
    {
        name: 'Verify',
        dataIndex: 'isGstVerified',
        headerClass: 'w-[150px] ',
        isComponent:true,
        Comp:VerifyGstButton
    }
];

export const Bodydata: DataType[] = [
    {
        key: '1',
        name: 'John Brown',
        age: 32,
        address: 'Akshya Nagar 1st Block 1st Cross, Rammurthy nagar, Bangalore-560016',
        Verify:'Verify GST'
    },
    {
        key: '2',
        name: 'Jim Green',
        age: 42,
        address: 'Akshya Nagar 1st Block 1st Cross, Rammurthy nagar, Bangalore-560016',
        Verify:'Verify GST'
        

    },
    {
        key: '3',
        name: 'Joe Black',
        age: 32,
        address: 'Akshya Nagar 1st Block 1st Cross, Rammurthy nagar, Bangalore-560016',
        Verify:'Verified'
    },
    {
        key: '4',
        name: 'John Brown',
        age: 32,
        address: 'Akshya Nagar 1st Block 1st Cross, Rammurthy nagar, Bangalore-560016',
        Verify:'Verified'
    },
    {
        key: '5',
        name: 'Jim Green',
        age: 42,
        address: 'Akshya Nagar 1st Block 1st Cross, Rammurthy nagar, Bangalore-560016',
        Verify:'Verified'
        },
    {
        key: '6',
        name: 'Joe Black',
        age: 32,
        address: 'Akshya Nagar 1st Block 1st Cross, Rammurthy nagar, Bangalore-560016',
        Verify:'Verified'
    }
];