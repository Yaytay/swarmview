import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

interface ServicesProps {
  baseUrl: string
}
function Services(props: ServicesProps) {

  const [rawData, setRawData] = useState([] as any[])
  const [tasks, setTasks] = useState([] as any[])
  const [services, setServices] = useState([] as any[])

  useEffect(() => {
    fetch(props.baseUrl + 'services')
      .then(r => {
        console.log('Services response: ', r)
        if (r.ok) {
          return r.json();
        }
      })
      .then(j => {
        console.log('Services: ', j)
        setRawData(j)
      })
    fetch(props.baseUrl + 'tasks?filters={"desired-state":["running"]}')
      .then(r => {
        console.log('Tasks response: ', r)
        if (r.ok) {
          return r.json();
        }
      })
      .then(j => {
        console.log('Tasks: ', j)
        setTasks(j)
      })
  }
    , [props.baseUrl])

  useEffect(() => {
    if (rawData.length > 0 && tasks.length > 0) {
      console.log('Matching services and tasks')
      tasks.forEach((t: any) => {
        const svc = rawData.find(s => s.ID = t.ServiceID)
        if (svc) {
          if (svc.tasks) {
            svc.tasks.push(t)
          } else {
            svc.tasks = [t]
          }
        }
      })
      setServices(rawData)
    }
  }, [rawData, tasks])

  return (<>
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
                  (n.tasks ? n.tasks.length : '')
                  + '/'
                  + (n.Spec.Mode.Replicated ? n.Spec.Mode.Replicated.Replicas : 'all')
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