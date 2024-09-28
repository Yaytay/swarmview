import { useState, useEffect } from 'react';
import { DockerApi } from './DockerApi';
import StacksTable, { StackDetails } from './tables/StacksTable';
import { Dimensions } from './app-types';

interface StacksProps {
  baseUrl: string
  setTitle: (title: string) => void
  docker: DockerApi
  refresh: Date
  maxSize: Dimensions
}
function Stacks(props: StacksProps) {

  const [stacks, setStacks] = useState<StackDetails[]>([])

  useEffect(() => {
    props.setTitle('Stacks')

    Promise.all([
      props.docker.services()
      , props.docker.networks()
    ]).then(value => {
      const services = value[0]
      const networks = value[1]

      const stks1 = services.reduce((result, current) => {
        const labels = current.Spec?.Labels
        if (labels) {
          const namespace = labels['com.docker.stack.namespace']
          if (namespace) {
            const sd = result.get(namespace)
            if (sd) {
              sd.services++
            } else {
              result.set(namespace, {name: namespace, services: 1, networks: 0})
            }
          }
        }        
        return result
      }, new Map<string, StackDetails>())

      const stks2 = networks.reduce((result, current) => {
        const labels = current.Labels
        if (labels) {
          const namespace = labels['com.docker.stack.namespace']
          if (namespace) {
            const sd = result.get(namespace)
            if (sd) {
              sd.networks++
            } else {
              result.set(namespace, {name: namespace, services: 0, networks: 1})
            }
          }
        }        
        return result
      }, stks1)

      setStacks(Array.from(stks2.values()))
    })
  }, [props])

  return (
    <StacksTable id="stacks" stacks={stacks} border={true} maxSize={props.maxSize} />
  )

}

export default Stacks;