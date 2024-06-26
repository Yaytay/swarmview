import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

interface ServicesProps {
  baseUrl: string
  setTitle: (title: string) => void
}
function Services(props: ServicesProps) {

  const [services, setServices] = useState([] as any[])

  props.setTitle('Systems')

  useEffect(() => {
    fetch(props.baseUrl + 'services?status=true')
      .then(r => {
        console.log('Services response: ', r)
        if (r.ok) {
          return r.json();
        }
      })
      .then(j => {
        console.log('Services: ', j)
        setServices(j)
      })
  }
    , [props.baseUrl])

  return (<>
    <h1>Services</h1>
    <table className='primary'>
      <thead>
        <tr>
          <th>ID</th>
          <th>NAME</th>
          <th>MODE</th>
          <th>REPLICAS</th>
          <th>IMAGE</th>
          <th>PORTS</th>
        </tr>
      </thead>
      <tbody>
        {
          services.map((n: any) => {
            return (
              <tr id={n.ID}>
                <td><Link to={'/service/' + n.ID }>{n.ID}</Link></td>
                <td>{n.Spec.Name}</td>
                <td>{Object.keys(n.Spec.Mode)[0]}</td>
                <td>{
                  n.ServiceStatus.RunningTasks + ' / ' + n.ServiceStatus.DesiredTasks
                }</td>
                <td>{n.Spec.TaskTemplate.ContainerSpec.Image.replace(/@.*/, '')}</td>
                <td>{n.Endpoint.Ports.map((p: any) => {
                  return p.TargetPort + ':' + p.PublishedPort
                }).join(', ')}</td>
              </tr>
            )
          })
        }
      </tbody>
    </table>
  </>)


}

export default Services;