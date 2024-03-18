import type { ColumnsType } from 'antd/es/table';
import { statusComponent } from '../../Components/element/statusComponent'
import { Financingtype } from '../element/financingtype';
// import { CustomSelect } from '../element/dropdowncomponent'
import { EditAndDeleteComponent  } from '../../Components/element/editAndDeleteComponent'
interface DataType {
    key: React.Key;
    name: string;
    age: number;
    phoneNumber: number;
    Edit:string[]
}

export const columnsData = [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
        width: '100px'
    },
    
    {
        title: 'Phone Number',
        dataIndex: 'phoneNumber',
        key: 'phoneNumber',
    },    
    {
        title: '',
        dataIndex: 'Edit',
        key: 'Edit',
        isComponent: true,
        Comp: EditAndDeleteComponent
    }
];

export const Bodydata = [
    {
        key: '1',
        GSTNo: '1234567890',
        RegDate: '05/July/2023',
        Address: 'Akshya Nagar 1st Block 1st Cross, Rammurthy nagar, Bangalore-560016',
        FilingStatus:[
            { value: 'new', label: 'New', optionStyle: { background: 'blue', color: 'white' } },
            { value: 'draft', label: 'Draft', optionStyle: { background: 'red', color: 'white' } }
        ],
        link:'',
        isLink:false
    },
    {
        key: '2',
        GSTNo: '1234567890',
        RegDate: '05/July/2023',
        Address: 'Akshya Nagar 1st Block 1st Cross, Rammurthy nagar, Bangalore-560016',
        FilingStatus:[
            { value: 'new', label: 'New', optionStyle: { background: 'blue', color: 'white' } },

            { value: 'draft', label: 'Draft', optionStyle: { background: 'red', color: 'white' } }
        ],
        link:'/',
        isLinked:true
    }
];