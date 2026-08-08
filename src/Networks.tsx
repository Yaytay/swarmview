import { useState, useEffect } from 'react';
import type { DockerApi } from './DockerApi';
import NetworksTable, { createNetworkDetails, type NetworkDetails } from './tables/NetworksTable';
import type { Dimensions } from './app-types';
import type { SetTitle } from './App';

interface NetworksProps {
  baseUrl: string
  setTitle: SetTitle
  docker: DockerApi
  refresh: Date
  maxSize?: Dimensions
}
function Networks(props: NetworksProps) {

  const [networkDetails, setNetworkDetails] = useState<NetworkDetails[]>([])

  useEffect(() => {
    props.setTitle('Networks')
    Promise.all([
      props.docker.networks()
    ]).then(value => {
      const networks = value[0]

      setNetworkDetails(
        networks?.reduce((result, current) => {
          result.push(
            createNetworkDetails(current)
          )
          return result;
        }, [] as NetworkDetails[])
      )
    })
  }, [props])

  return (
    <NetworksTable id="networks" networks={networkDetails} border={true} maxSize={props.maxSize} />
  )


}

export default Networks;

