import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import JSONPretty from 'react-json-pretty';
import 'react-json-pretty/themes/monikai.css';
import Box from '@mui/material/Box';
import { Service } from './docker-schema';
import Section from './Section'
import Grid from '@mui/material/Grid';
import DataTable, { DataTablePropsEntry } from './DataTable';


interface ServiceProps {
  baseUrl: string
  setTitle: (title: string) => void
}
function ServiceUi(props: ServiceProps) {

  const [service, setService] = useState<Service | null>(null)
  const [tab, setTab] = useState('details')

  const { id } = useParams();

  const [labels, setLabels] = useState<(string | number | DataTablePropsEntry)[][]>([])

  useEffect(() => {
    fetch(props.baseUrl + 'services?status=true&filter={%22id%22:%22' + id + '%22}')
      .then(r => {
        console.log('Service response: ', r)
        if (r.ok) {
          return r.json();
        }
      })
      .then(j => {
        const buildService = j[0] as Service
        setService(buildService)
        props.setTitle('Service: ' + j[0].Spec.Name)
        var buildLabels = [] as (string | number | DataTablePropsEntry)[][]
        if (buildService?.Spec?.Labels) {
          const record = buildService?.Spec?.Labels
          Object.keys(record).forEach(key => {
            if (record[key]) {
              buildLabels.push([key, record[key], 'Service'])
            }
          })
        }
        if (buildService?.Spec?.TaskTemplate?.ContainerSpec?.Labels) {
          const record = buildService?.Spec?.TaskTemplate?.ContainerSpec?.Labels
          Object.keys(record).forEach(key => {
            if (record[key]) {
              buildLabels.push([key, record[key], 'Container'])
            }
          })
        }
        setLabels(buildLabels)
      })
  }
    , [props.baseUrl])

  if (!service) {
    return <></>
  } else {
    return (
      <div>
        <div className='tabBar'>
          <div className={'tab' + (tab === 'details' ? ' active' : '')} onClick={() => setTab('details')}>Details</div>
          <div className={'tab' + (tab === 'raw' ? ' active' : '')} onClick={() => setTab('raw')}>Raw</div>
        </div>
        {tab === 'details' &&
          <div className='details' >
            <Box sx={{ flexGrow: 1 }}>
              <Grid container spacing={2}>
              <Section id="service.overview" heading="Overview" level={2} >
                  <DataTable id="service.overview.table" rows={
                    [
                      ['ID', service.ID || '']
                      , ['Image', service?.Spec?.TaskTemplate?.ContainerSpec?.Image?.replace(/@.*/, '') || ' ']
                      , ['Hash', service?.Spec?.TaskTemplate?.ContainerSpec?.Image?.replace(/.*@/, '') || ' ']
                      , ['Created', service.CreatedAt || '']
                      , ['Updated', service.UpdatedAt || '']
                    ]
                  }>
                  </DataTable>
                </Section>
                <Section id="service.execution" heading="Execution" level={2} >
                  <DataTable id="service.execution.table" kvTable={true} rows={
                    [
                      ['Command', service?.Spec?.TaskTemplate?.ContainerSpec?.Command]
                      , ['Arguments', service?.Spec?.TaskTemplate?.ContainerSpec?.Args]
                      , ['Environment', service?.Spec?.TaskTemplate?.ContainerSpec?.Env]
                      , ['Dir', service?.Spec?.TaskTemplate?.ContainerSpec?.Dir]
                      , ['User', service?.Spec?.TaskTemplate?.ContainerSpec?.User]
                      , ['Groups', service?.Spec?.TaskTemplate?.ContainerSpec?.Groups]
                      , ['Hostname', service?.Spec?.TaskTemplate?.ContainerSpec?.Hostname]
                    ]
                  }>
                  </DataTable>
                </Section>
                <Section id="service.status" heading="Status" level={2} >
                  <DataTable id="service.status.table" headers={
                    [
                      'Running Tasks'
                      , 'Desired Tasks'
                      , 'Completed Tasks'
                    ]
                  }
                    rows={
                      [
                        [
                          service.ServiceStatus?.RunningTasks || ''
                          , service.ServiceStatus?.RunningTasks || ''
                          , service.ServiceStatus?.RunningTasks || ''
                        ]
                      ]
                    }>
                  </DataTable>
                </Section>
                <Section id="service.labels" heading="Labels" level={2} >
                  <DataTable id="service.labels.table" headers={
                    [
                      'Label'
                      , 'Value'
                      , 'Source'
                    ]
                  } rows={labels}
                  >
                  </DataTable>
                </Section>
              </Grid>
            </Box>
          </div>
        }
        {tab === 'raw' &&
          <div className='raw' >
            <JSONPretty data={service} />
          </div>
        }
      </div>
    )
  }

}

export default ServiceUi;