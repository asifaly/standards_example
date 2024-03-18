import type { ColumnsType } from 'antd/es/table';


interface DataType {
    key?: React.Key;
    name?: string;
    age?: number;
    next_action?: string;
    status?: any,
    source?: any
}

export const columnsData = [
    {
        name: 'Name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        name: 'Age',
        dataIndex: 'age',
        key: 'age',
        width: '100px'
    },
    {
        name: 'Next_Action',
        dataIndex: 'next_action',
        key: 'next_action 1',
        width: '400px'
    }
];

export const Bodydata: DataType[] = [
    {
        key: '1',
        name: 'John Brown',
        age: 32,
        next_action: '05/July/2023 | 08:00'
       
    },
    {
        key: '2',
        name: 'Jim Green',
        age: 42,
        next_action: '05/July/2023 | 08:00'

    },
    {
        key: '3',
        name: 'Joe Black',
        age: 32,
        next_action: '05/July/2023 | 08:00'

    },
    {
        key: '4',
        name: 'John Brown',
        age: 32,
        next_action: '05/July/2023 | 08:00'
    },
    {
        key: '5',
        name: 'Jim Green',
        age: 42,
        next_action: '05/July/2023 | 08:00'
    },
    {
        key: '6',
        name: 'Joe Black',
        age: 32,
        next_action: '05/July/2023 | 08:00'
    }

];