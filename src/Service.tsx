import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import JSONPretty from 'react-json-pretty';
import 'react-json-pretty/themes/monikai.css';
import Box from '@mui/material/Box';
import { Service } from './docker-schema';
import ServiceStatusUi from './ServiceStatus';
import Section from './Section'
import { Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';


interface ServiceProps {
  baseUrl: string
  setTitle: (title: string) => void
}
function ServiceUi(props: ServiceProps) {

  const [service, setService] = useState(null as Service | null)
  const [tab, setTab] = useState('details')

  const { id } = useParams();

  useEffect(() => {
    fetch(props.baseUrl + 'services?status=true&filter={%22id%22:%22' + id + '%22}')
      .then(r => {
        console.log('Service response: ', r)
        if (r.ok) {
          return r.json();
        }
      })
      .then(j => {
        console.log('Service: ', j[0])
        setService(j[0])
        props.setTitle('System: ' + j[0].Spec.Name)
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
                  <TableContainer>
                    <Table size="small" aria-label="simple table">
                      <TableBody>
                        <TableRow key='ID' sx={{ border: 0 }} >
                          <TableCell component="th" scope="row">ID</TableCell>
                          <TableCell>{service.ID}</TableCell>
                        </TableRow>
                        <TableRow key='CreatedAt' sx={{ border: 0 }} >
                          <TableCell component="th" scope="row">Created</TableCell>
                          <TableCell>{service.CreatedAt}</TableCell>
                        </TableRow>
                        <TableRow key='UpdatedAt' sx={{ border: 0 }} >
                          <TableCell component="th" scope="row">Updated</TableCell>
                          <TableCell>{service.UpdatedAt}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Section>
                <Section id="service.status" heading="Status" level={2} >
                  <TableContainer>
                    <Table size="small" aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell component="th" scope="row">Running Tasks</TableCell>
                          <TableCell>Desired Tasks</TableCell>
                          <TableCell component="th" scope="row">Completed Tasks</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell>{service.ServiceStatus?.RunningTasks}</TableCell>
                          <TableCell>{service.ServiceStatus?.DesiredTasks}</TableCell>
                          <TableCell>{service.ServiceStatus?.CompletedTasks}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Section>
                <Section id="service.labels" heading="Labels" level={2} >
                  <TableContainer>
                    <Table size="small" aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell component="th" scope="row">Label</TableCell>
                          <TableCell>Value</TableCell>
                          <TableCell component="th" scope="row">Source</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {service.Spec?.Labels && Object.keys(service.Spec.Labels).map(key => (
                          <TableRow key={key}>
                            <TableCell>{key}</TableCell>
                            <TableCell>{service.Spec?.Labels && service.Spec?.Labels[key]}</TableCell>
                            <TableCell>Service</TableCell>
                          </TableRow>
                        ))}
                        {service.Spec?.TaskTemplate?.ContainerSpec?.Labels && Object.keys(service.Spec?.TaskTemplate?.ContainerSpec?.Labels).map(key => (
                          <TableRow key={key}>
                            <TableCell>{key}</TableCell>
                            <TableCell>{service.Spec?.TaskTemplate?.ContainerSpec?.Labels && service.Spec?.TaskTemplate?.ContainerSpec?.Labels[key]}</TableCell>
                            <TableCell>Container</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
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