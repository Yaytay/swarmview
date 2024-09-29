import { useState, useEffect } from 'react';
import { DockerApi } from './DockerApi';
import { Dimensions } from './app-types';
import SecretsTable, { buildServicesBySecret, SecretDetails, createSecretDetails } from './tables/SecretsTable';

interface SecretsProps {
  baseUrl: string
  setTitle: (title: string) => void
  docker: DockerApi
  refresh: Date
  maxSize: Dimensions
}
function Secrets(props: SecretsProps) {

  const [secrets, setSecrets] = useState<SecretDetails[]>([])

  useEffect(() => {
    props.setTitle('Secrets')

    Promise.all([
      props.docker.secrets()
      , props.docker.services()
    ]).then(value => {
      const secrets = value[0]
      const services = value[1]

      const servicesBySecret = buildServicesBySecret(services)
      const nowMs = Date.now()

      setSecrets(
        secrets.reduce((result, current) => {
          if (current.ID) {
            result.push(createSecretDetails(current, servicesBySecret, nowMs))
          }
          return result
        }
          , [] as SecretDetails[])
      )
    })
  }, [props.refresh])

  return (
    <SecretsTable id="secrets" secrets={secrets} border={true} maxSize={props.maxSize} />
  )
}

export default Secrets;