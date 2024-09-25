import { useState, useEffect } from 'react';
import { DockerApi } from './DockerApi';
import ServicesTable, { createServiceDetails, ServiceDetails } from './tables/ServicesTable';
import { Dimensions } from './app-types';

interface ServicesProps {
  baseUrl: string
  setTitle: (title: string) => void
  docker: DockerApi
  refresh: Date
  maxSize?: Dimensions
}
function Services(props: ServicesProps) {

  const [serviceDetails, setServiceDetails] = useState<ServiceDetails[]>([])

  useEffect(() => {
    props.setTitle('Services')
    Promise.all([
      props.docker.services()
      , props.docker.exposedPorts()
    ]).then(value => {
      const services = value[0]
      const exposedPorts = value[1]

      setServiceDetails(
        services?.reduce((result, current) => {
          result.push(
            createServiceDetails(current, exposedPorts)
          )
          return result;
        }, [] as ServiceDetails[])
      )
    })
  }, [props])

  return (<>
    <ServicesTable id="services" services={serviceDetails} border={true} maxSize={props.maxSize} />
  </>)


}

export default Services;

