import React, { useEffect, useState } from 'react'
import { useApiCall } from '../../Hooks/apicall'
import { APIEndpoints } from '../../Services/backend/functions';
import { TableComponent } from '../../Components/Table/table';
import { ConfigurablesHeaders } from './settingsJSON';
import { useConfigurations } from '../../Hooks/configurations';
import { configurationCases } from '../../Context/configurationsContext';
import { configurationsUnEditable } from '../../configs/common';

const Configurations = () => {
    // const { APIFunc } = useApiCall({
    //     method: "GET"
    // });
    const { state, dispatch } = useConfigurations();

    // const fetchConfigurables = async () => {
    //     const { success, data } = await APIFunc({
    //         endpoint: APIEndpoints.fetchConfigurables,
    //         headerProps: {
    //             token: true
    //         }
    //     });
    //     if (success) {
    //         dispatch({
    //             type: configurationCases.fetchConfigurations,
    //             payload:data
    //         })
    //     }
    // }
    // useEffect(() => {
    //     fetchConfigurables()
  // }, [state?.fetchString]);
  // console.log(state.configurations);
  const filteredConfigurations=state?.configurations.filter((c:any)=>!configurationsUnEditable.includes(c.name))
    return (
    //   <></>
      <TableComponent
          headers={ConfigurablesHeaders}
            bodyData={filteredConfigurations ||[]}
            // isLoading={true}
      />
  )
}

export default Configurations