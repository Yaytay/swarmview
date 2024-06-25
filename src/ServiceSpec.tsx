import { ServiceSpec } from './docker-schema';

interface ServiceSpecProps {
  service: ServiceSpec
}
function ServiceSpecUi(props: ServiceSpecProps) {

  return (
    <table className='primary'>
      <thead>
        <tr>
        <th>Running Tasks</th>
        <th>Desired Tasks</th>
        <th>Completed Tasks</th>
        </tr>
      </thead>
      <tbody>
        <tr>
        <td>{props.mode?.Global}</td>
        <td>{props.mode?.Replicated?.Replicas}</td>
        <td>{props.mode?.GlobalJob}</td>
        </tr>
      </tbody>
    </table>
  )

}

export default ServiceSpecUi;