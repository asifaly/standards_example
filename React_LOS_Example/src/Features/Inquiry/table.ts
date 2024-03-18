import {  DateConverter, DateFormaterForFiling, DateWithTimeComp, FilingStatusSelector, FormatMonthNumToString } from "../../Components/element/dropdowncomponent";
import  { TypeField,DeleteComponent, AnchorField } from "../../Components/element/DeleteComponent";
// import { CustomSelect } from "../../Components/element/dropdowncomponent";
import { EditAndDeleteComponent } from "../../Components/element/editAndDeleteComponent";
import { Financingtype } from "../../Components/element/financingtype";
import { AntdInputAbstract } from "../../Components/element/inputwithlable";
import { FilingStatus, statusComponent } from "../../Components/element/statusComponent";
import { TableHeadersProps } from "../../Components/Table/table";

let fontStyle = "text-[16px] max-tablet-[14px]";

// export const menuListingTablePropsFunc = (url: string) => {
//         return {}
// }

export const newActionHeaders = [
  {
    title: "Application Date",
    dataIndex: "createdAt",
    key: "createdAt",
  },
  // {
  //         title: 'Source',
  //         dataIndex: 'inquirySource',
  //         key: 'inquirySource',
  //         // width: '100px'
  // },
  {
    title: "PAN No.",
    dataIndex: "partyPanNumber",
    key: "partyPanNumber",
    // isComponent: true,
    // Comp: CustomSelect
  },
  {
    title: "Company Name",
    dataIndex: "partyName",
    key: "partyName",
    // width:"200px"
  },
  {
    title: "Financing Type",
    dataIndex: "financingType",
    key: "financingType",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
  },
  {
    title: "Last Update Date",
    dataIndex: "nextActionDate",
    key: "nextActionDate",
  },
];
// apiKey

export const inquiryHeaders = [
  {
    name: "Inquiry Date",
    dataIndex: "createdAt",
    headerClass: "w-[130px]",
    isComponent: true,
    Comp: DateConverter,
  },
  {
    name: "Source",
    dataIndex: "inquirySource",
    headerClass: "w-[100px]",
    // isComponent: true,
    // Comp: CustomSelect,
  },
  {
    name: "PAN No",
    dataIndex: "partyPanNumber",
    headerClass: "w-[150px] fontStyle",
  },
  {
    name: "Company Name",
    dataIndex: "partyName",
    headerClass: "w-[180px] fontStyle",
  },
  {
    name: "Financing Type",
    dataIndex: "financingType",
    headerClass: "w-[200px] fontStyle",
    // isComponent: true,
    // Comp: Financingtype,
  },
  {
    name: "Status",
    dataIndex: "status",
    headerClass: "w-[180px]",
    isComponent: true,
    Comp: statusComponent,
  },
  {
    name: "Next Action",
    dataIndex: "nextActionDate",
    headerClass: "w-[150px]",
    isComponent: true,
    Comp: DateConverter,
  },
];

export const gstiHeader:TableHeadersProps[] = [
  {
    name: "GST No",
    dataIndex: "id",
    // key: "GSTNo",
    headerClass: "w-[170px]",
  },
  {
    name: "Reg Date",
    dataIndex: "registrationDate",
    // key: "RegDate",
    headerClass: "w-[170px]",
  },
  {
    name: "Address",
    dataIndex: "location",
    // key: "Address",
    headerClass: "w-[300px]",
    // className:'pr-20'
  },
  {
    name: "Filing Response",
    dataIndex: "FilingResponse",
    // key: "FilingResponse",
    headerClass: "w-[170px]",
    isComponent: true,
    Comp: Financingtype,
    className: "pl-14",
  },
  {
    name: "Filing Status",
    dataIndex: "filingStatus",
    // key: "FilingStatus",
    headerClass: "w-[200px]",
    isComponent: true,
    Comp: FilingStatusSelector,
  },
];

export const contactHeader = [
  {
    name: "Name",
    dataIndex: "name",
    key: "name",
    headerClass: "w-[230px] max-tablet:w-[120px]",
  },
  {
    name: "Email",
    dataIndex: "email",
    key: "email",
    headerClass: "w-[250px] max-tablet:w-[160px]",
  },
  {
    name: "Phone Number",
    dataIndex: "phoneNumber",
    key: "phoneNumber",
    headerClass: "w-[300px] max-laptop:w-[300px] max-tablet:w-[150px]",
  },
  {
    name: "Action",
    dataIndex: "Edit",
    key: "Edit",
    isComponent: true,
    Comp: EditAndDeleteComponent,
    headerclass: "w-[200px] max-tablet:w-[30px]",
  },
];

export const contactUsersData = [
  {
    key: "1",
    name: "Jim Green",
    email: "abc@gmail.com",
    phoneNumber: 9898989898,
    Edit: ["Edit", "Detele"],
  },
  {
    key: "2",
    name: "Joe Black",
    email: "abc@gmail.com",
    phoneNumber: 9898989898,
    Edit: ["Edit", "Detele"],
  },
];

export const filingDetailsHeaders: TableHeadersProps[] = [
  {
    name: "Financial Year",
    dataIndex: "period",
    // className: "w-[200px]",
    headerClass:"w-[200px] text-center"
  },
  {
    name: "Tax Period",
    dataIndex: "retprd",
    headerClass: "w-[200px] text-center",
    isComponent: true,
    Comp:FormatMonthNumToString
  },
  {
    name: "Date of Filing",
    dataIndex: "dof",
    headerClass: "w-[200px] text-center",
    isComponent: true,
    Comp:DateFormaterForFiling
  },
  {
    name: "Status",
    dataIndex: "status",
    headerClass: "w-[200px] text-center",
    isComponent: true,
    Comp:FilingStatus
  }
]

// export  const attachmentHeader =[
//   {
//     name: "Type",
//     dataIndex: "name",
//     key: "name",
//     headerClass: "w-[250px] max-tablet:w-[120px]",
//   },
//   {
//     name: "File Name",
//     dataIndex: "FileName",
//     key: "FileName",
//     headerClass: "w-[450px] max-tablet:w-[160px]",
//   },
//   {
//     name: "",
//     dataIndex: "Delete",
//     key: "Delete",
//     headerClass: "",
//     className:'flex justify-evenly self-end pb-0',
//     isComponent: true,
//     Comp: DeleteComponent,
//     // headerclass: "w-[200px] max-tablet:w-[30px]",
//   }

// ]

export const attachmentHeader:TableHeadersProps[] = [
  {
    name: "Type",
    dataIndex: "documentType",
    isComponent:true,
    Comp: TypeField,
    headerClass:"text-center"
  },
  {
    name: "File Name",
    dataIndex: "name",
    headerClass: "text-center",
    isComponent: true,
    Comp:AnchorField
  },
  {
    name: "",
    dataIndex: "",
    isComponent: true,
    Comp: DeleteComponent,
    headerClass: "text-center"
  }
]