import { useState, useEffect } from 'react';
import { DockerApi } from './DockerApi';
import { Dimensions } from './app-types';
import ConfigsTable, { buildServicesByConfig, ConfigDetails, createConfigDetails } from './tables/ConfigsTable';

interface ConfigsProps {
  baseUrl: string
  setTitle: (title: string) => void
  docker: DockerApi
  refresh: Date
  maxSize: Dimensions
}
function Configs(props: ConfigsProps) {

  const [configs, setConfigs] = useState<ConfigDetails[]>([])

  useEffect(() => {
    props.setTitle('Configs')

    Promise.all([
      props.docker.configs()
      , props.docker.services()
    ]).then(value => {
      const configs = value[0]
      const services = value[1]

      const servicesByConfig = buildServicesByConfig(services)
      const nowMs = Date.now()

      setConfigs(
        configs.reduce((result, current) => {
          if (current.ID) {
            result.push(createConfigDetails(current, servicesByConfig, nowMs))
          }
          return result
        }
          , [] as ConfigDetails[])
      )
    })
  }, [props.refresh])

  return (
    <ConfigsTable id="configs" configs={configs} border={true} maxSize={props.maxSize} />
  )
}

export default Configs;