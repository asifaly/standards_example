import { Spin } from 'antd';
import { SpinClassProps } from 'antd/es/spin';
import React from 'react'
interface LoaderProps{
    isLoading?: boolean,
    children: React.ReactNode,
    loaderProps?:SpinClassProps
}
const Loader = ({
    isLoading=false
    , children
}: LoaderProps) => {
  return (
      <>
          {
              isLoading?<Spin className='mx-auto' />:children
          }
      </>
  )
}

export default Loader;