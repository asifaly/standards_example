import { TableHeadersProps } from "../../Components/Table/table";
import { EditAndDeleteComponent, EditButton, EditDeleteComp } from "../../Components/element/editAndDeleteComponent";
import ListComponent from "../../Components/element/listCompent";
import { UsersTableStatusComp } from "../../Components/element/statusComponent";

export const UsersHeaders:TableHeadersProps[] = [
    {
        name: "Name",
        dataIndex: "name",
        headerClass: "w-[150px]",

        // key: "name",
        // headerClass: "w-[200px] fontStyle",
    },
    // {
    //     name: "Email",
    //     dataIndex: "email",
    //     // key: "email",
    //     headerClass: "w-[200px]",
    // },
    {
        name: "Mobile Number",
        dataIndex: "phoneNumber",
        headerClass: "w-[160px]",

        // key: "phoneNumber",
        // headerClass: "w-[200px] fontStyle",
    },
    // {
    //     name: "Company Name",
    //     dataIndex: "partyName",
    //     headerClass: "w-[160px]",

    //     // key: "partyName",
    //     // headerClass: "w-[200px] fontStyle",
    // },
    {
        name: "Role",
        dataIndex: "role",
        headerClass: "w-[160px]"

        // key: "role",
        // headerClass: "w-[200px] fontStyle",
    },
    {
        name: "Status",
        dataIndex: "status",
        // key: "status",
        headerClass: "w-[150px]",
        isComponent: true,
        Comp: UsersTableStatusComp
        // headerClass: "w-[200px] fontStyle",
    },
    {
        name: "",
        dataIndex: "",
        isComponent: true,
        Comp: EditDeleteComp,
        headerClass: "w-[200px] ",
    },

]

export const ConfigurablesHeaders: TableHeadersProps[] = [
    {
        name: "Configuration",
        dataIndex: "name"
    },
    {
        name: "Values",
        dataIndex: "values",
        isComponent: true,
        Comp:ListComponent
    },
    {
        name: "",
        dataIndex: "",
        isComponent: true,
        Comp: EditButton,
        // className:"flex justify-center w-full"
    }
]