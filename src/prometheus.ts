
export interface PrometheusResults{
  data: {
    result: Metric[]
    resultType: string
  }
  status: string
}

export interface Metric {
  metric: {
    __name__: string;
    [key: string]: string;
  };
  values: [number, string][]
}

export interface ChartData {
  timestamp: number;
  [key: string]: number | null;
}

export function metricName(metric : Metric) {
  return metric.metric['ctr_label_com_docker_swarm_task_name'] || metric.metric['ctr_name']
}

export function transformData(data: Metric[], scale: number | undefined): ChartData[] {
  const timestampMap: { [key: number]: ChartData } = {};

  data.forEach(metric => {
    metric.values.forEach(([timestamp, value]) => {
      if (!timestampMap[timestamp]) {
        timestampMap[timestamp] = { timestamp };
      }
      timestampMap[timestamp][metricName(metric)] = parseFloat(value) / (scale || 1)
    });
  });

  // Ensure all metrics are present in each data point
  const metricNames = data.map(metric => metricName(metric));
  const result = Object.values(timestampMap).map(dataPoint => {
    metricNames.forEach(name => {
      if (dataPoint[name] === undefined) {
        dataPoint[name] = null; 
      }
    });
    return dataPoint;
  });

  // Sort by timestamp
  return result.sort((a, b) => a.timestamp - b.timestamp)
}