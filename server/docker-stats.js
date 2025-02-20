var staticStats = {}

function build(obj, key, type, help) {
  obj[key] = [
    '# HELP ' + key + ' ' + help
    , '# TYPE ' + key + ' ' + type
  ]
}

build(staticStats, 'ctr_blkio_stats_io_service_bytes_recursive_read', 'counter', 'count of bytes read by the container')
build(staticStats, 'ctr_blkio_stats_io_service_bytes_recursive_write', 'counter', 'count of bytes written by the container')
build(staticStats, 'ctr_blkio_stats_io_service_bytes_recursive_sync', 'counter', 'count of bytes read or written by the container synchronously')
build(staticStats, 'ctr_blkio_stats_io_service_bytes_recursive_async', 'counter', 'count of bytes read or written by the container asynchronously')
build(staticStats, 'ctr_blkio_stats_io_service_bytes_recursive_discard', 'counter', 'count of I/O bytes discarded by the container')
build(staticStats, 'ctr_blkio_stats_io_service_bytes_recursive_total', 'counter', 'count of I/O bytes by the container')
build(staticStats, 'ctr_blkio_stats_io_service_recursive_read', 'counter', 'count of reads by the container')
build(staticStats, 'ctr_blkio_stats_io_service_recursive_write', 'counter', 'count of writes by the container')
build(staticStats, 'ctr_blkio_stats_io_service_recursive_sync', 'counter', 'count of synchronous I/O operations by the container')
build(staticStats, 'ctr_blkio_stats_io_service_recursive_async', 'counter', 'count of asynchronous I/O operations by the container')
build(staticStats, 'ctr_blkio_stats_io_service_recursive_discard', 'counter', 'count of I/O operations by the container that were discarded')
build(staticStats, 'ctr_blkio_stats_io_service_recursive_total', 'counter', 'count of I/O operations by the container')
build(staticStats, 'ctr_cpu_usage_total', 'counter', 'total CPU time used by the container')
build(staticStats, 'ctr_cpu_usage_kernelmode', 'counter', 'CPU time in kernel mode used by the container')
build(staticStats, 'ctr_cpu_usage_usermode', 'counter', 'CPU time in user mode used by the container')
build(staticStats, 'ctr_cpu_usage_percpu', 'counter', 'CPU time used by the container on each CPU')
build(staticStats, 'ctr_memory_usage', 'gauge', 'Memory used by the container (excludes page cache usage)')
build(staticStats, 'ctr_memory_limit', 'gauge', 'Memory usage limit of the container, in bytes')
build(staticStats, 'ctr_memory_max_usage', 'gauge', 'Maximum measured memory usage of the container, in bytes')
build(staticStats, 'ctr_memory_stats_active_anon', 'gauge', 'Amount of memory that has been identified as active by the kernel. Anonymous memory is memory that is not linked to disk pages.')
build(staticStats, 'ctr_memory_stats_active_file', 'gauge', 'Amount of active file cache memory. Cache memory = active_file + inactive_file + tmpfs')
build(staticStats, 'ctr_memory_stats_cache', 'gauge', 'The amount of memory used by the processes of this control group that can be associated with a block on a block device. Also accounts for memory used by tmpfs.')
build(staticStats, 'ctr_memory_stats_dirty', 'gauge', 'The amount of memory waiting to get written to disk')
build(staticStats, 'ctr_memory_stats_hierarchical_memory_limit', 'gauge', 'The memory limit in place by the hierarchy cgroup')
build(staticStats, 'ctr_memory_stats_hierarchical_memsw_limit', 'gauge', 'The memory+swap limit in place by the hierarchy cgroup')
build(staticStats, 'ctr_memory_stats_inactive_anon', 'gauge', 'Amount of memory that has been identified as inactive by the kernel. Anonymous memory is memory that is not linked to disk pages.')
build(staticStats, 'ctr_memory_stats_inactive_file', 'gauge', 'Amount of inactive file cache memory. Cache memory = active_file + inactive_file + tmpfs')
build(staticStats, 'ctr_memory_stats_mapped_file', 'gauge', 'Indicates the amount of memory mapped by the processes in the control group. It doesn’t give you information about how much memory is used; it rather tells you how it is used.')
build(staticStats, 'ctr_memory_stats_pgfault', 'counter', 'Number of times that a process of the cgroup triggered a page fault. Page faults occur when a process accesses part of its virtual memory space which is nonexistent or protected. See https://docs.docker.com/config/containers/runmetrics for more info.')
build(staticStats, 'ctr_memory_stats_pgmajfault', 'counter', 'Number of times that a process of the cgroup triggered a major page fault. Page faults occur when a process accesses part of its virtual memory space which is nonexistent or protected. See https://docs.docker.com/config/containers/runmetrics for more info.')
build(staticStats, 'ctr_memory_stats_pgpgin', 'counter', 'Number of charging events to the memory cgroup. Charging events happen each time a page is accounted as either mapped anon page(RSS) or cache page to the cgroup.')
build(staticStats, 'ctr_memory_stats_pgpgout', 'counter', 'Number of uncharging events to the memory cgroup. Uncharging events happen each time a page is unaccounted from the cgroup.')
build(staticStats, 'ctr_memory_stats_rss', 'gauge', 'The amount of memory that doesn’t correspond to anything on disk: stacks, heaps, and anonymous memory maps.')
build(staticStats, 'ctr_memory_stats_rss_huge', 'gauge', 'Amount of memory due to anonymous transparent hugepages.')
build(staticStats, 'ctr_memory_stats_shmem', 'gauge', 'Amount of Shared Memory used by the container, in bytes.')
build(staticStats, 'ctr_memory_stats_swap', 'gauge', 'Bytes of swap memory used by container')
build(staticStats, 'ctr_memory_stats_unevictable', 'gauge', 'The amount of memory that cannot be reclaimed.')
build(staticStats, 'ctr_memory_stats_writeback', 'gauge', 'The amount of memory from file/anon cache that are queued for syncing to the disk')
build(staticStats, 'ctr_network_usage_rx_bytes', 'counter', 'Bytes received by the container via its network interface')
build(staticStats, 'ctr_network_usage_rx_dropped', 'counter', 'Number of inbound network packets dropped by the container')
build(staticStats, 'ctr_network_usage_rx_errors', 'counter', 'Errors receiving network packets')
build(staticStats, 'ctr_network_usage_rx_packets', 'counter', 'Network packets received by the container via its network interface')
build(staticStats, 'ctr_network_usage_tx_bytes', 'counter', 'Bytes sent by the container via its network interface')
build(staticStats, 'ctr_network_usage_tx_dropped', 'counter', 'Number of outbound network packets dropped by the container')
build(staticStats, 'ctr_network_usage_tx_errors', 'counter', 'Errors sending network packets')
build(staticStats, 'ctr_network_usage_tx_packets', 'counter', 'Network packets sent by the container via its network interface')

console.log(staticStats)

export function newStats() {
  var stats = {}
  for (const key in staticStats) {
    const stat = staticStats[key]
    stats[key] = [ stat[0], stat[1] ]
  }
  return stats
}