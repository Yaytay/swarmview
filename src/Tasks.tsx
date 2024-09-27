import { useState, useEffect } from 'react';
import { DockerApi } from './DockerApi';
import { Dimensions } from './app-types';
import TasksTable, { createTaskDetails, processTaskDetailsSubRows, TaskDetails } from './tables/TasksTable';

interface TasksProps {
  baseUrl: string
  setTitle: (title: string) => void
  docker: DockerApi
  refresh: Date
  maxSize: Dimensions
}
function Tasks(props: TasksProps) {

  const [taskDetails, setTaskDetails] = useState<TaskDetails[]>([])

  useEffect(() => {
    props.setTitle('Tasks')

    Promise.all([
      props.docker.exposedPorts()
      , props.docker.tasks()
      , props.docker.servicesById()
    ]).then(value => {
      const nowMs = Date.now()
      const exposedPorts = value[0]
      const tasks = value[1]
      const servicesById = value[2]

      const tsks = tasks.reduce((result, current) => {
        if (current.ID) {
          result.push(
            createTaskDetails(current, servicesById, exposedPorts, nowMs)
          )
        }        
        return result
      }, [] as TaskDetails[])
      setTaskDetails(processTaskDetailsSubRows(tsks))
    })
  }, [props])

  return (
    <TasksTable id="tasks" tasks={taskDetails} border={true} maxSize={props.maxSize} />
  )

}

export default Tasks;