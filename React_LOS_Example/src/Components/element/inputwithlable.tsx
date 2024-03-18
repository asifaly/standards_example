import React, { DetailedHTMLProps, ImgHTMLAttributes } from 'react';
import { Form, Input, Select, DatePicker, InputNumber, Button, Space, Col, Row, InputProps, SelectProps, DatePickerProps, InputNumberProps, ButtonProps, Radio, RadioProps, RadioGroupProps, FormProps, Upload, UploadProps } from 'antd';
// import ModalWithTabs from './modalWithTabs';
import { FormItemProps } from 'antd';
// import Item from 'antd/es/list/Item';
import _ from 'lodash';
import { TextAreaProps } from 'antd/es/input';
import { RadioButtonProps } from 'antd/es/radio/radioButton';
import uploadIcon from "../../Assets/images/uplaodIcon.svg";
import Loader from './loader';
const { TextArea } = Input;

// type AntdElement = typeof Input | typeof Select | typeof DatePicker | typeof InputNumber | typeof Button | typeof TextArea | typeof PhoneNumberComponent;

type ElementTypes = InputProps | SelectProps | DatePickerProps | InputNumberProps | ButtonProps | TextAreaProps |PhoneNumberComponentProps|UploadAttachmentWithIconProps|RadioButtonComponentProps|InputWithButtonCompactCompProps;
interface AntdInputAbstractProps {
  ElementProps?: ElementTypes,
  FormItemsProps?: FormItemProps,
  type: "text" | 'select' | 'date' | 'number' | 'button' | 'textarea' | "phoneNumber" | "upload" | "radio" |"compactInputWithButton"
}

interface UploadAttachmentWithIconProps {
  // icon: string,
  // handleClick: () => void,
  // inputProps: InputProps
  children?:React.ReactNode,
  inProgress:boolean,
  uploadProps?:UploadProps
  iconProps?: DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>

}

type RadioButtonComponentProps = RadioGroupProps & { options: Record<string, any>[] }

interface PhoneNumberComponentProps {
  selectProps?: SelectProps,
  inputProps?: InputProps,
  getFieldDecorator?: any
}


interface InputWithButtonCompactCompProps{
  inputProps?: InputProps,
  buttonProps?: ButtonProps,
  buttonText:string
}

const PhoneNumberComponent = ({ selectProps, inputProps, getFieldDecorator }: PhoneNumberComponentProps) => { 
  return (
    <Input
      // formatter={formatter}
      addonBefore={
        <Select
          style={{
          width:70
        }}
          {...selectProps}
        />
      }
      {
      ...inputProps
      }
    />
  )
}

const UploadAttachmentWithIcon = ({
  iconProps,
  uploadProps,
  inProgress,
  children
}: UploadAttachmentWithIconProps) => {
  return (
    <div className='border-2 flex justify-between rounded-[4px] p-2 w-full'>
      <div className='w-11/12 text-left overflow-hidden text-ellipsis mr-2'>{children}</div>
      <Upload
        className='w-1/12 justify-center flex items-center'
        disabled={inProgress}
        {
        ...uploadProps
        }
      >
        <Loader isLoading={inProgress}>
          <img
            alt='uploadIcon'
            title='upload'
            // className='w-[25px] h-[25px]'
            src={iconProps?.src || uploadIcon}
            {...iconProps}
          />
        </Loader>
      </Upload>
    </div>
  )
}

const InputWithButtonCompactComp = ({inputProps,buttonProps,buttonText}:InputWithButtonCompactCompProps) => {
  return (
    <Space>
      <Space.Compact>
        <Input {...inputProps} />
        <Button type="primary" {...buttonProps}>{buttonText}</Button>
      </Space.Compact>
    </Space>
  )
}

const RadioButtonComponent = ({options,...rest}:RadioButtonComponentProps) => {
  return (
    <Radio.Group {...rest}>
      {
        options.map((opt: any, index: number) => (
          <Radio key={index} value={opt?.value}>{opt?.label}</Radio>
        ))
      }
    </Radio.Group>
  )
}
// const filterOptions = (inputValue: string, option: any) => option.label.toLowerCase().includes(inputValue.toLowerCase())
const SelectCustomized = (props:SelectProps) => {
  return <Select
    showSearch
    filterOption={(inputValue: string, option: any) => option.label.toLowerCase().includes(inputValue.toLowerCase())}
    {...props}
  />
}

export const AntdInputAbstract = ({ FormItemsProps, type, ElementProps }: AntdInputAbstractProps) => {

  const AntdElements = {
    text: Input,
    select: SelectCustomized,
    date: DatePicker,
    number: InputNumber,
    button: Button,
    textarea: TextArea,
    phoneNumber: PhoneNumberComponent,
    upload: UploadAttachmentWithIcon,
    radio: RadioButtonComponent,
    compactInputWithButton:InputWithButtonCompactComp
  };
  let InputElement: any = AntdElements[type] || Input;
  return (
    <Form.Item {...FormItemsProps} >
        <InputElement {...ElementProps} />
      </Form.Item> 
  );
}

// export const AntdInputWithLabel = (props: any, FormItemProps: FormItemProps = {}) => {
//   const { type, ...inputProps } = props;
//   // console.log({value});
//   let inputElement;
//   // console.log(inputProps, 'inputprps')
//   const handleClick = (props: any) => {
//     // <ModalWithTabs />
//     // console.log('dataaaa')
//   }
//   const handleAddonClick = () => {
//     // Your custom click handler logic here
//     alert('Addon clicked!');
//   };
      

//   switch (type) {
//     case 'text':
//       inputElement = <Input {...inputProps} />;
//       break;
//     case 'select':
//       inputElement = <Select {...inputProps} showSearch >{props?.children}</Select>;
//       break;
//     case 'date':
//       inputElement = <DatePicker {...inputProps} />;
//       break;
//     case 'number':
//       inputElement = <InputNumber {...inputProps} />;
//       break;
//     case 'button':
//       inputElement = <Button  {...inputProps} onClick={handleClick} type='default' className={`bg-[#4E6ACB] text-[#fff] ${props.className}`} >{props.placeholder} </Button>
//       break;
//     case 'textarea':
//       inputElement = <TextArea {...inputProps} rows="auto" className={inputProps?.className} />;
//       break;
//     case 'phonenumber':
//       inputElement = <Space className='' >
//         <Space.Compact className=' item-center  '>
//           <Select defaultValue="+91" options={inputProps?.options} className='!w-[110px]' />
//           <Input {...inputProps} className='' />
//         </Space.Compact>
//       </Space>
//       break
//     case 'inputWithuploadAddonAfter':
//       inputElement = <Input {...inputProps} className='groupaddon' addonAfter={
//         <img
//           src={inputProps?.icon} // Replace with the actual image URL
//           alt="Clickable_Image"
//           className=' cursor-pointer  "'
//           onClick={handleAddonClick}
//         />
//       } />

//       break
//     default:
//       inputElement = <Input {...inputProps} />;
//   }


//   if (!_.isString(type)) {
//     // console.error(`Invalid type prop: ${type}`);
//     return null;
//   }
//   return (
//     // <Form layout="vertical" >
//     <Form.Item label={props.label} name={props.name} >
//       {inputElement}
//     </Form.Item>
//     // </Form>
//   );
// };