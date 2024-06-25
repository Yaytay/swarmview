import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import JSONPretty from 'react-json-pretty';
import 'react-json-pretty/themes/monikai.css';
import Box from '@mui/material/Box';
import { Service } from './docker-schema';
import ServiceStatusUi from './ServiceStatus';
import Section from './Section'
import { Typography } from '@mui/material';

interface ServiceProps {
  baseUrl: string
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
      })
  }
    , [props.baseUrl])

  if (!service) {
    return <></>
  } else {
    return (
      <div>
        <h1>{service.Spec && service.Spec.Name}</h1>
        <div className='tabBar'>
          <div className={'tab' + (tab === 'details' ? ' active' : '')} onClick={() => setTab('details')}>Details</div>
          <div className={'tab' + (tab === 'raw' ? ' active' : '')} onClick={() => setTab('raw')}>Raw</div>
        </div>
        {tab === 'details' &&
          <div className='details' >
            <Section id="service.overview" heading="Overview" level={2}>
              <Box sx={{ 
                display: 'grid'
                , width: '100%'
                , gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))'
              }}>
                <Box sx={{ display:'flex' }}>
                  <Typography sx={{width: '140px'}}>ID:</Typography>
                  <Typography sx={{width: '290px'}}>{service.ID}</Typography>
                </Box>
                <Box sx={{ display:'flex' }}>
                  <Typography sx={{width: '140px'}}>Date Created:</Typography>
                  <Typography sx={{width: '290px'}}>{service.CreatedAt}</Typography>
                </Box>
                <Box sx={{ display:'flex' }}>
                  <Typography sx={{width: '140px'}}>Date Updated:</Typography>
                  <Typography sx={{width: '290px'}}>{service.UpdatedAt}</Typography>
                </Box>
              </Box>
            </Section>
            <Section id='service.spec' heading="Spec" level={2}>
              <div className='item'>
                <div className='label'>ID</div>
                <div className='value'>{service.ID}</div>
              </div>
              <Section id='service.spec.task' heading="Task" level={3}>
                <div/>
              </Section>
            </Section>
            <div className='item'>
              <div className='label'>Dates</div>
              <div className='value'>
                <table className='primary'>
                  <thead>
                    <tr>
                      <th>Created</th>
                      <th>Updated</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{service.CreatedAt}</td>
                      <td>{service.UpdatedAt}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className='item'>
              <div className='label'>Service Labels</div>
              <div className='value'>
                <table className='primary'>
                  <thead>
                    <tr>
                    <th>Label</th>
                    <th>Value</th>
                    <th>Type</th>
                    </tr>
                  </thead>
                  <tbody>
                  {service.Spec?.Labels && Object.keys(service.Spec.Labels).map(key => (
                      <tr key={key}>
                        <td>{key}</td>
                        <td>{service.Spec?.Labels && service.Spec?.Labels[key]}</td>
                        <td>Service</td>
                      </tr>
                    ))}
                    {service.Spec?.TaskTemplate?.ContainerSpec?.Labels && Object.keys(service.Spec?.TaskTemplate?.ContainerSpec?.Labels).map(key => (
                      <tr key={key}>
                        <td>{key}</td>
                        <td>{service.Spec?.TaskTemplate?.ContainerSpec?.Labels && service.Spec?.TaskTemplate?.ContainerSpec?.Labels[key]}</td>
                        <td>Container</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className='item'>
              <div className='label'>Service status</div>
              <div className='value'>
                { service.ServiceStatus && <ServiceStatusUi status={service.ServiceStatus} />}
              </div>
            </div>
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