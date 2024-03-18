import React, { useMemo, useState } from 'react';
import { Table, Pagination, Row } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Link, NavLink, createSearchParams, useNavigate } from 'react-router-dom';
import TableCardData from './TableCardData';
import PaginationComponent from '../element/paginationComponent';
import { routeNames } from '../../Features/Routes/RouteName';
import TableDataLinkComponent from '../element/tableDataLinkComponent';
import TableNavLink from '../element/tableDataLinkComponent';
import './scroolStyle.css'
import { Spin } from 'antd';


export interface TableHeadersProps {
    name: string;
    dataIndex: string;
    isComponent?: boolean;
    Comp?: any,
    headerClass?: string,
    className?: string
}
interface TableProps {
    headers: TableHeadersProps[];
    bodyData: any[];
    indexStyle?: string;
    cellStyle?: string;
    ActionComponent?: any;
    cellActionHeaderStyle?: string;
    cellTableHeaderStyle?: string;
    mobile_CardStyle?: string,
    isLoading?: boolean,
    navFunc?:any
}

interface LoadingOrNoDataConditionCompProps{
    isLoading?: boolean,
    bodyData: any[],
    children:React.ReactNode
}

export const TableComponent = ({
    headers,
    bodyData,
    mobile_CardStyle,
    isLoading,
    navFunc
}: TableProps) => {
    return (
        <Row className='custom-scrollbar overflow-x-auto  max-mobile:!block'>
            <table className=' table-fixed text-left  w-full  items-center border-separate border-spacing-y-4 border-spacing-x-0 max-mobile:hidden'  >
                <thead>
                    <tr className=''>
                        {headers.map(({ name, headerClass }: TableHeadersProps, index: any) => {
                            const classes = `text-[#FFF]  leading-4 p-5 bg-[#101041] border-none outline-none ${headerClass} ${index === 0 ? 'rounded-l-2xl' : index === headers.length - 1 ? 'rounded-r-2xl' : ''}`;
                            return <th className={classes.trim()} key={index}> {name} </th>
                        })}
                    </tr>
                </thead>
                <LoadingOrNoDataConditionComp isLoading={isLoading} bodyData={bodyData}>
                    <tbody>
                            {bodyData.map((val: any, index: number) => {
                                return (
                                    <tr key={index} className={navFunc ? "cursor-pointer" : ' cursor-default'} onClick={() => {
                                        if (navFunc) {
                                            navFunc(val)
                                        }
                                    }}>
                                        {headers.map(({ name, Comp, isComponent, dataIndex, headerClass, className }: TableHeadersProps, index: any) => {
                                            const classes = `text-[#313131] w-auto break-words leading-4 p-5 bg-[#F3F9FF] border-none outline-none ${headerClass} ${className} ${index === 0 ? 'rounded-l-2xl' : index === headers.length - 1 ? 'rounded-r-2xl' : ''}`;
                                            return (
                                                <td key={index} className={classes.trim()}>
                                                    {isComponent ? <Comp data={val[dataIndex]} props={val} /> : val[dataIndex]}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                );
                            })}
                    </tbody>
                </LoadingOrNoDataConditionComp>
            </table>
            <TableCardData head={headers} body={bodyData} mobile_CardStyle={mobile_CardStyle}  isLoading={isLoading}/>
        </Row>
    );
};


export const LoadingOrNoDataConditionComp = ({ isLoading, bodyData, children }: LoadingOrNoDataConditionCompProps) => {
    if (isLoading) {
        return <div className='grid !mx-auto w-[71vw] my-10'><Spin /></div>
    }
    if (!bodyData.length) {
        return (
            <Row className='h-[30vh] w-[70vw] cursor-pointer  flex justify-center text-center items-center mx-auto text-[#686868]'>
                <p className='text-center'>No Records Found</p>
            </Row>
        )
    }
    return <>{children}</>
}

