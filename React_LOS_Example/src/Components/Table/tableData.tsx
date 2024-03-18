import type { ColumnsType } from 'antd/es/table';
import { statusComponent } from '../../Components/element/statusComponent'
import { Financingtype } from '../element/financingtype';
// import { CustomSelect } from '../element/dropdowncomponent'

interface DataType {
    key: React.Key;
    name: string;
    age: number;
    next_action: string;
    status: any,
    source?: any
}



export const columnsData = [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        width: "150px"

    },
    {
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
        width: '100px'
    },
    {
        title: 'Source',
        dataIndex: 'source',
        key: 'source',
        isComponent: true,
        // Comp: CustomSelect,
        width: "200px"

    },
    {
        title: 'Filing Response',
        dataIndex: 'filingResponse',
        key: 'financingtype',
        isComponent: true,
        Comp: Financingtype,
        width: "300px"
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        width: '100px',
        isComponent: true,
        Comp: statusComponent
    },
    {
        title: 'Next_Action',
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
        next_action: '05/July/2023 | 08:00',
        status: 'Draft',
        source: [
            { value: 'new', label: 'New', optionStyle: { background: 'blue', color: 'white' } },

            { value: 'draft', label: 'Draft', optionStyle: { background: 'red', color: 'white' } }
        ]
    },
    {
        key: '2',
        name: 'Jim Green',
        age: 42,
        next_action: '05/July/2023 | 08:00',
        status: 'New',
        source: []

    },
    {
        key: '3',
        name: 'Joe Black',
        age: 32,
        next_action: '05/July/2023 | 08:00',
        status: 'Draft',
        source: []

    },
    {
        key: '4',
        name: 'John Brown',
        age: 32,
        next_action: '05/July/2023 | 08:00',
        status: 'New',
        source: []
    },
    {
        key: '5',
        name: 'Jim Green',
        age: 42,
        next_action: '05/July/2023 | 08:00',
        status: 'New',
        source: []


    },
    {
        key: '6',
        name: 'Joe Black',
        age: 32,
        next_action: '05/July/2023 | 08:00',
        status: 'Draft',
        source: []


    },
    // {
    //     key: '7',
    //     name: 'John Brown',
    //     age: 32,
    //     next_action: '05/July/2023 | 08:00',
    // },
    // {
    //     key: '8',
    //     name: 'Jim Green',
    //     age: 42,
    //     next_action: '05/July/2023 | 08:00',
    // },
    // {
    //     key: '9',
    //     name: 'Joe Black',
    //     age: 32,
    //     next_action: '05/July/2023 | 08:00',
    // },
    // {
    //     key: '10',
    //     name: 'John Brown',
    //     age: 32,
    //     next_action: '05/July/2023 | 08:00',
    // },
    // {
    //     key: '11',
    //     name: 'Jim Green',
    //     age: 42,
    //     next_action: '05/July/2023 | 08:00',
    // },
    // {
    //     key: '12',
    //     name: 'Joe Black',
    //     age: 32,
    //     next_action: '05/July/2023 | 08:00',
    // },
    // {
    //     key: '13',
    //     name: 'John Brown',
    //     age: 32,
    //     next_action: '05/July/2023 | 08:00',
    // },
    // {
    //     key: '14',
    //     name: 'Jim Green',
    //     age: 42,
    //     next_action: '05/July/2023 | 08:00',
    // },
    // {
    //     key: '15',
    //     name: 'Joe Black',
    //     age: 32,
    //     next_action: '05/July/2023 | 08:00',
    // },
];