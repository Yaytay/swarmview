import { useState, useEffect } from 'react';
import { useParams } from 'react-router';

interface ServiceProps {
  baseUrl: string
}
function Service(props: ServiceProps) {

  const [service, setService] = useState(null as any | null)

  const { id } = useParams();

  useEffect(() => {
    fetch(props.baseUrl + 'services/' + id)
      .then(r => {
        console.log('Service response: ', r)
        if (r.ok) {
          return r.json();
        }
      })
      .then(j => {
        console.log('Service: ', j)
        setService(j)
      })
  }
    , [props.baseUrl])

  if (!service) {
    return <></>
  } else {
    return (
      <div>
        ID:&nbsp;{service.ID}
        <br />
        Name:&nbsp;{service.Spec.Name}
        <br />
        Dates:
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
        <br />
        Labels:
        <table className='primary'>
          <thead>
          </thead>
          <tbody>
            {Object.entries(service.Spec.Labels).map(([key, value]) => (
              <tr>
                <td>{key}</td>
                <td>{String(value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

}

export default Service;