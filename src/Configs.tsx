import { useState, useEffect } from 'react';
import type { DockerApi } from './DockerApi';
import type { Dimensions } from './app-types';
import ConfigsTable, { buildServicesByConfig, type ConfigDetails, createConfigDetails } from './tables/ConfigsTable';
import type { SetTitle } from './App';

interface ConfigsProps {
  baseUrl: string
  setTitle: SetTitle
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
  }, [props])

  return (
    <ConfigsTable id="configs" configs={configs} border={true} maxSize={props.maxSize} />
  )
}

export default Configs;