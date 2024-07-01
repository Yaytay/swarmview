import { useState, useEffect } from 'react';
import DataTable, { DataTablePropsEntry } from './DataTable';
import { Service } from './docker-schema'

interface ServicesProps {
  baseUrl: string
  setTitle: (title: string) => void
}
function Services(props: ServicesProps) {

  const [data, setData] = useState<(string|DataTablePropsEntry)[][]>()
  const [headers, _] = useState(['ID', 'NAME', 'MODE', 'REPLICAS', 'IMAGE', 'PORTS'])

  useEffect(() => {
    fetch(props.baseUrl + 'services?status=true')
      .then(r => {
        if (r.ok) {
          return r.json();
        }
      })
      .catch(reason => {
        console.log('Failed to get services:', reason)
      })
      .then(j => {
        props.setTitle('Services')
        var newData = [] as (string|DataTablePropsEntry)[][]
        j.forEach((svc: Service) => {
          newData.push(
            [
              svc.ID ? {link: '/service/' + svc.ID, value: svc.ID} : ''
              , svc.Spec?.Name || ''
              , Object.keys(svc.Spec?.Mode||[''])[0]
              , svc.ServiceStatus?.RunningTasks + ' / ' + svc.ServiceStatus?.DesiredTasks
              , svc.Spec?.TaskTemplate?.ContainerSpec?.Image?.replace(/@.*/, '')||''
              , svc.Endpoint?.Ports?.map((p: any) => {
                  return p.TargetPort + ':' + p.PublishedPort
                }).join(', ')||''
            ]
          )
        });
        setData(newData)
      })
  }
    , [props.baseUrl])

  return (<>
    <DataTable id="services" headers={headers} rows={data}>
    </DataTable>
  </>)


}

export default Services;