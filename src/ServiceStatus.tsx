import { Service } from './docker-schema';

interface ServiceStatusProps {
  status: Service['ServiceStatus']
}
function ServiceStatusUi(props: ServiceStatusProps) {

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
        <td>{props.status?.RunningTasks}</td>
        <td>{props.status?.DesiredTasks}</td>
        <td>{props.status?.CompletedTasks}</td>
        </tr>
      </tbody>
    </table>
  )

}

export default ServiceStatusUi;