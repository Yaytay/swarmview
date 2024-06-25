/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

/**
 * An open port on a container
 * @example {"PrivatePort":8080,"PublicPort":80,"Type":"tcp"}
 */
export interface Port {
  /**
   * Host IP address that the container's port is mapped to
   * @format ip-address
   */
  IP?: string;
  /**
   * Port on the container
   * @format uint16
   */
  PrivatePort: number;
  /**
   * Port exposed on the host
   * @format uint16
   */
  PublicPort?: number;
  Type: "tcp" | "udp" | "sctp";
}

/**
 * MountPoint represents a mount point configuration inside the container.
 * This is used for reporting the mountpoints in use by a container.
 */
export interface MountPoint {
  /**
   * The mount type:
   *
   * - `bind` a mount of a file or directory from the host into the container.
   * - `volume` a docker volume with the given `Name`.
   * - `tmpfs` a `tmpfs`.
   * - `npipe` a named pipe from the host into the container.
   * - `cluster` a Swarm cluster volume
   * @example "volume"
   */
  Type?: "bind" | "volume" | "tmpfs" | "npipe" | "cluster";
  /**
   * Name is the name reference to the underlying data defined by `Source`
   * e.g., the volume name.
   * @example "myvolume"
   */
  Name?: string;
  /**
   * Source location of the mount.
   *
   * For volumes, this contains the storage location of the volume (within
   * `/var/lib/docker/volumes/`). For bind-mounts, and `npipe`, this contains
   * the source (host) part of the bind-mount. For `tmpfs` mount points, this
   * field is empty.
   * @example "/var/lib/docker/volumes/myvolume/_data"
   */
  Source?: string;
  /**
   * Destination is the path relative to the container root (`/`) where
   * the `Source` is mounted inside the container.
   * @example "/usr/share/nginx/html/"
   */
  Destination?: string;
  /**
   * Driver is the volume driver used to create the volume (if it is a volume).
   * @example "local"
   */
  Driver?: string;
  /**
   * Mode is a comma separated list of options supplied by the user when
   * creating the bind/volume mount.
   *
   * The default is platform-specific (`"z"` on Linux, empty on Windows).
   * @example "z"
   */
  Mode?: string;
  /**
   * Whether the mount is mounted writable (read-write).
   * @example true
   */
  RW?: boolean;
  /**
   * Propagation describes how mounts are propagated from the host into the
   * mount point, and vice-versa. Refer to the [Linux kernel documentation](https://www.kernel.org/doc/Documentation/filesystems/sharedsubtree.txt)
   * for details. This field is not used on Windows.
   * @example ""
   */
  Propagation?: string;
}

/**
 * A device mapping between the host and container
 * @example {"PathOnHost":"/dev/deviceName","PathInContainer":"/dev/deviceName","CgroupPermissions":"mrw"}
 */
export interface DeviceMapping {
  PathOnHost?: string;
  PathInContainer?: string;
  CgroupPermissions?: string;
}

/** A request for devices to be sent to device drivers */
export interface DeviceRequest {
  /** @example "nvidia" */
  Driver?: string;
  /** @example -1 */
  Count?: number;
  /** @example ["0","1","GPU-fef8089b-4820-abfc-e83e-94318197576e"] */
  DeviceIDs?: string[];
  /**
   * A list of capabilities; an OR list of AND lists of capabilities.
   * @example [["gpu","nvidia","compute"]]
   */
  Capabilities?: string[][];
  /**
   * Driver-specific options, specified as a key/value pairs. These options
   * are passed directly to the driver.
   */
  Options?: Record<string, string>;
}

export interface ThrottleDevice {
  /** Device path */
  Path?: string;
  /**
   * Rate
   * @format int64
   * @min 0
   */
  Rate?: number;
}

export interface Mount {
  /** Container path. */
  Target?: string;
  /** Mount source (e.g. a volume name, a host path). */
  Source?: string;
  /**
   * The mount type. Available types:
   *
   * - `bind` Mounts a file or directory from the host into the container. Must exist prior to creating the container.
   * - `volume` Creates a volume with the given name and options (or uses a pre-existing volume with the same name and options). These are **not** removed when the container is removed.
   * - `tmpfs` Create a tmpfs with the given options. The mount source cannot be specified for tmpfs.
   * - `npipe` Mounts a named pipe from the host into the container. Must exist prior to creating the container.
   * - `cluster` a Swarm cluster volume
   */
  Type?: "bind" | "volume" | "tmpfs" | "npipe" | "cluster";
  /** Whether the mount should be read-only. */
  ReadOnly?: boolean;
  /** The consistency requirement for the mount: `default`, `consistent`, `cached`, or `delegated`. */
  Consistency?: string;
  /** Optional configuration for the `bind` type. */
  BindOptions?: {
    /** A propagation mode with the value `[r]private`, `[r]shared`, or `[r]slave`. */
    Propagation?: "private" | "rprivate" | "shared" | "rshared" | "slave" | "rslave";
    /**
     * Disable recursive bind mount.
     * @default false
     */
    NonRecursive?: boolean;
    /**
     * Create mount point on host if missing
     * @default false
     */
    CreateMountpoint?: boolean;
    /**
     * Make the mount non-recursively read-only, but still leave the mount recursive
     * (unless NonRecursive is set to `true` in conjunction).
     *
     * Addded in v1.44, before that version all read-only mounts were
     * non-recursive by default. To match the previous behaviour this
     * will default to `true` for clients on versions prior to v1.44.
     * @default false
     */
    ReadOnlyNonRecursive?: boolean;
    /**
     * Raise an error if the mount cannot be made recursively read-only.
     * @default false
     */
    ReadOnlyForceRecursive?: boolean;
  };
  /** Optional configuration for the `volume` type. */
  VolumeOptions?: {
    /**
     * Populate volume with data from the target.
     * @default false
     */
    NoCopy?: boolean;
    /** User-defined key/value metadata. */
    Labels?: Record<string, string>;
    /** Map of driver specific options */
    DriverConfig?: {
      /** Name of the driver to use to create the volume. */
      Name?: string;
      /** key/value map of driver specific options. */
      Options?: Record<string, string>;
    };
    /**
     * Source path inside the volume. Must be relative without any back traversals.
     * @example "dir-inside-volume/subdirectory"
     */
    Subpath?: string;
  };
  /** Optional configuration for the `tmpfs` type. */
  TmpfsOptions?: {
    /**
     * The size for the tmpfs mount in bytes.
     * @format int64
     */
    SizeBytes?: number;
    /** The permission mode for the tmpfs mount in an integer. */
    Mode?: number;
  };
}

/**
 * The behavior to apply when the container exits. The default is not to
 * restart.
 *
 * An ever increasing delay (double the previous delay, starting at 100ms) is
 * added before each restart to prevent flooding the server.
 */
export interface RestartPolicy {
  /**
   * - Empty string means not to restart
   * - `no` Do not automatically restart
   * - `always` Always restart
   * - `unless-stopped` Restart always except when the user has manually stopped the container
   * - `on-failure` Restart only when the container exit code is non-zero
   */
  Name?: "" | "no" | "always" | "unless-stopped" | "on-failure";
  /** If `on-failure` is used, the number of times to retry before giving up. */
  MaximumRetryCount?: number;
}

/** A container's resources (cgroups config, ulimits, etc) */
export interface Resources {
  /**
   * An integer value representing this container's relative CPU weight
   * versus other containers.
   */
  CpuShares?: number;
  /**
   * Memory limit in bytes.
   * @format int64
   * @default 0
   */
  Memory?: number;
  /**
   * Path to `cgroups` under which the container's `cgroup` is created. If
   * the path is not absolute, the path is considered to be relative to the
   * `cgroups` path of the init process. Cgroups are created if they do not
   * already exist.
   */
  CgroupParent?: string;
  /**
   * Block IO weight (relative weight).
   * @min 0
   * @max 1000
   */
  BlkioWeight?: number;
  /**
   * Block IO weight (relative device weight) in the form:
   *
   * ```
   * [{"Path": "device_path", "Weight": weight}]
   * ```
   */
  BlkioWeightDevice?: {
    Path?: string;
    /** @min 0 */
    Weight?: number;
  }[];
  /**
   * Limit read rate (bytes per second) from a device, in the form:
   *
   * ```
   * [{"Path": "device_path", "Rate": rate}]
   * ```
   */
  BlkioDeviceReadBps?: ThrottleDevice[];
  /**
   * Limit write rate (bytes per second) to a device, in the form:
   *
   * ```
   * [{"Path": "device_path", "Rate": rate}]
   * ```
   */
  BlkioDeviceWriteBps?: ThrottleDevice[];
  /**
   * Limit read rate (IO per second) from a device, in the form:
   *
   * ```
   * [{"Path": "device_path", "Rate": rate}]
   * ```
   */
  BlkioDeviceReadIOps?: ThrottleDevice[];
  /**
   * Limit write rate (IO per second) to a device, in the form:
   *
   * ```
   * [{"Path": "device_path", "Rate": rate}]
   * ```
   */
  BlkioDeviceWriteIOps?: ThrottleDevice[];
  /**
   * The length of a CPU period in microseconds.
   * @format int64
   */
  CpuPeriod?: number;
  /**
   * Microseconds of CPU time that the container can get in a CPU period.
   * @format int64
   */
  CpuQuota?: number;
  /**
   * The length of a CPU real-time period in microseconds. Set to 0 to
   * allocate no time allocated to real-time tasks.
   * @format int64
   */
  CpuRealtimePeriod?: number;
  /**
   * The length of a CPU real-time runtime in microseconds. Set to 0 to
   * allocate no time allocated to real-time tasks.
   * @format int64
   */
  CpuRealtimeRuntime?: number;
  /**
   * CPUs in which to allow execution (e.g., `0-3`, `0,1`).
   * @example "0-3"
   */
  CpusetCpus?: string;
  /**
   * Memory nodes (MEMs) in which to allow execution (0-3, 0,1). Only
   * effective on NUMA systems.
   */
  CpusetMems?: string;
  /** A list of devices to add to the container. */
  Devices?: DeviceMapping[];
  /** a list of cgroup rules to apply to the container */
  DeviceCgroupRules?: string[];
  /** A list of requests for devices to be sent to device drivers. */
  DeviceRequests?: DeviceRequest[];
  /**
   * Hard limit for kernel TCP buffer memory (in bytes). Depending on the
   * OCI runtime in use, this option may be ignored. It is no longer supported
   * by the default (runc) runtime.
   *
   * This field is omitted when empty.
   * @format int64
   */
  KernelMemoryTCP?: number;
  /**
   * Memory soft limit in bytes.
   * @format int64
   */
  MemoryReservation?: number;
  /**
   * Total memory limit (memory + swap). Set as `-1` to enable unlimited
   * swap.
   * @format int64
   */
  MemorySwap?: number;
  /**
   * Tune a container's memory swappiness behavior. Accepts an integer
   * between 0 and 100.
   * @format int64
   * @min 0
   * @max 100
   */
  MemorySwappiness?: number;
  /**
   * CPU quota in units of 10<sup>-9</sup> CPUs.
   * @format int64
   */
  NanoCpus?: number;
  /** Disable OOM Killer for the container. */
  OomKillDisable?: boolean;
  /**
   * Run an init inside the container that forwards signals and reaps
   * processes. This field is omitted if empty, and the default (as
   * configured on the daemon) is used.
   */
  Init?: boolean | null;
  /**
   * Tune a container's PIDs limit. Set `0` or `-1` for unlimited, or `null`
   * to not change.
   * @format int64
   */
  PidsLimit?: number | null;
  /**
   * A list of resource limits to set in the container. For example:
   *
   * ```
   * {"Name": "nofile", "Soft": 1024, "Hard": 2048}
   * ```
   */
  Ulimits?: {
    /** Name of ulimit */
    Name?: string;
    /** Soft limit */
    Soft?: number;
    /** Hard limit */
    Hard?: number;
  }[];
  /**
   * The number of usable CPUs (Windows only).
   *
   * On Windows Server containers, the processor resource controls are
   * mutually exclusive. The order of precedence is `CPUCount` first, then
   * `CPUShares`, and `CPUPercent` last.
   * @format int64
   */
  CpuCount?: number;
  /**
   * The usable percentage of the available CPUs (Windows only).
   *
   * On Windows Server containers, the processor resource controls are
   * mutually exclusive. The order of precedence is `CPUCount` first, then
   * `CPUShares`, and `CPUPercent` last.
   * @format int64
   */
  CpuPercent?: number;
  /**
   * Maximum IOps for the container system drive (Windows only)
   * @format int64
   */
  IOMaximumIOps?: number;
  /**
   * Maximum IO in bytes per second for the container system drive
   * (Windows only).
   * @format int64
   */
  IOMaximumBandwidth?: number;
}

/** An object describing a limit on resources which can be requested by a task. */
export interface Limit {
  /**
   * @format int64
   * @example 4000000000
   */
  NanoCPUs?: number;
  /**
   * @format int64
   * @example 8272408576
   */
  MemoryBytes?: number;
  /**
   * Limits the maximum number of PIDs in the container. Set `0` for unlimited.
   * @format int64
   * @default 0
   * @example 100
   */
  Pids?: number;
}

/**
 * An object describing the resources which can be advertised by a node and
 * requested by a task.
 */
export interface ResourceObject {
  /**
   * @format int64
   * @example 4000000000
   */
  NanoCPUs?: number;
  /**
   * @format int64
   * @example 8272408576
   */
  MemoryBytes?: number;
  /**
   * User-defined resources can be either Integer resources (e.g, `SSD=3`) or
   * String resources (e.g, `GPU=UUID1`).
   */
  GenericResources?: GenericResources;
}

/**
 * User-defined resources can be either Integer resources (e.g, `SSD=3`) or
 * String resources (e.g, `GPU=UUID1`).
 * @example [{"DiscreteResourceSpec":{"Kind":"SSD","Value":3}},{"NamedResourceSpec":{"Kind":"GPU","Value":"UUID1"}},{"NamedResourceSpec":{"Kind":"GPU","Value":"UUID2"}}]
 */
export type GenericResources = {
  NamedResourceSpec?: {
    Kind?: string;
    Value?: string;
  };
  DiscreteResourceSpec?: {
    Kind?: string;
    /** @format int64 */
    Value?: number;
  };
}[];

/** A test to perform to check that the container is healthy. */
export interface HealthConfig {
  /**
   * The test to perform. Possible values are:
   *
   * - `[]` inherit healthcheck from image or parent image
   * - `["NONE"]` disable healthcheck
   * - `["CMD", args...]` exec arguments directly
   * - `["CMD-SHELL", command]` run command with system's default shell
   */
  Test?: string[];
  /**
   * The time to wait between checks in nanoseconds. It should be 0 or at
   * least 1000000 (1 ms). 0 means inherit.
   * @format int64
   */
  Interval?: number;
  /**
   * The time to wait before considering the check to have hung. It should
   * be 0 or at least 1000000 (1 ms). 0 means inherit.
   * @format int64
   */
  Timeout?: number;
  /**
   * The number of consecutive failures needed to consider a container as
   * unhealthy. 0 means inherit.
   */
  Retries?: number;
  /**
   * Start period for the container to initialize before starting
   * health-retries countdown in nanoseconds. It should be 0 or at least
   * 1000000 (1 ms). 0 means inherit.
   * @format int64
   */
  StartPeriod?: number;
  /**
   * The time to wait between checks in nanoseconds during the start period.
   * It should be 0 or at least 1000000 (1 ms). 0 means inherit.
   * @format int64
   */
  StartInterval?: number;
}

/** Health stores information about the container's healthcheck results. */
export type Health = {
  /**
   * Status is one of `none`, `starting`, `healthy` or `unhealthy`
   *
   * - "none"      Indicates there is no healthcheck
   * - "starting"  Starting indicates that the container is not yet ready
   * - "healthy"   Healthy indicates that the container is running correctly
   * - "unhealthy" Unhealthy indicates that the container has a problem
   * @example "healthy"
   */
  Status?: "none" | "starting" | "healthy" | "unhealthy";
  /**
   * FailingStreak is the number of consecutive failures
   * @example 0
   */
  FailingStreak?: number;
  /** Log contains the last few results (oldest first) */
  Log?: HealthcheckResult[];
} | null;

/** HealthcheckResult stores information about a single run of a healthcheck probe */
export type HealthcheckResult = {
  /**
   * Date and time at which this check started in
   * [RFC 3339](https://www.ietf.org/rfc/rfc3339.txt) format with nano-seconds.
   * @format date-time
   * @example "2020-01-04T10:44:24.496525531Z"
   */
  Start?: string;
  /**
   * Date and time at which this check ended in
   * [RFC 3339](https://www.ietf.org/rfc/rfc3339.txt) format with nano-seconds.
   * @format dateTime
   * @example "2020-01-04T10:45:21.364524523Z"
   */
  End?: string;
  /**
   * ExitCode meanings:
   *
   * - `0` healthy
   * - `1` unhealthy
   * - `2` reserved (considered unhealthy)
   * - other values: error running probe
   * @example 0
   */
  ExitCode?: number;
  /** Output from last check */
  Output?: string;
} | null;

/** Container configuration that depends on the host we are running on */
export type HostConfig = Resources & {
  /**
   * A list of volume bindings for this container. Each volume binding
   * is a string in one of these forms:
   *
   * - `host-src:container-dest[:options]` to bind-mount a host path
   *   into the container. Both `host-src`, and `container-dest` must
   *   be an _absolute_ path.
   * - `volume-name:container-dest[:options]` to bind-mount a volume
   *   managed by a volume driver into the container. `container-dest`
   *   must be an _absolute_ path.
   *
   * `options` is an optional, comma-delimited list of:
   *
   * - `nocopy` disables automatic copying of data from the container
   *   path to the volume. The `nocopy` flag only applies to named volumes.
   * - `[ro|rw]` mounts a volume read-only or read-write, respectively.
   *   If omitted or set to `rw`, volumes are mounted read-write.
   * - `[z|Z]` applies SELinux labels to allow or deny multiple containers
   *   to read and write to the same volume.
   *     - `z`: a _shared_ content label is applied to the content. This
   *       label indicates that multiple containers can share the volume
   *       content, for both reading and writing.
   *     - `Z`: a _private unshared_ label is applied to the content.
   *       This label indicates that only the current container can use
   *       a private volume. Labeling systems such as SELinux require
   *       proper labels to be placed on volume content that is mounted
   *       into a container. Without a label, the security system can
   *       prevent a container's processes from using the content. By
   *       default, the labels set by the host operating system are not
   *       modified.
   * - `[[r]shared|[r]slave|[r]private]` specifies mount
   *   [propagation behavior](https://www.kernel.org/doc/Documentation/filesystems/sharedsubtree.txt).
   *   This only applies to bind-mounted volumes, not internal volumes
   *   or named volumes. Mount propagation requires the source mount
   *   point (the location where the source directory is mounted in the
   *   host operating system) to have the correct propagation properties.
   *   For shared volumes, the source mount point must be set to `shared`.
   *   For slave volumes, the mount must be set to either `shared` or
   *   `slave`.
   */
  Binds?: string[];
  /** Path to a file where the container ID is written */
  ContainerIDFile?: string;
  /** The logging configuration for this container */
  LogConfig?: {
    Type?: "json-file" | "syslog" | "journald" | "gelf" | "fluentd" | "awslogs" | "splunk" | "etwlogs" | "none";
    Config?: Record<string, string>;
  };
  /**
   * Network mode to use for this container. Supported standard values
   * are: `bridge`, `host`, `none`, and `container:<name|id>`. Any
   * other value is taken as a custom network's name to which this
   * container should connect to.
   */
  NetworkMode?: string;
  /**
   * PortMap describes the mapping of container ports to host ports, using the
   * container's port-number and protocol as key in the format `<port>/<protocol>`,
   * for example, `80/udp`.
   *
   * If a container's port is mapped for multiple protocols, separate entries
   * are added to the mapping table.
   */
  PortBindings?: PortMap;
  /**
   * The behavior to apply when the container exits. The default is not to
   * restart.
   *
   * An ever increasing delay (double the previous delay, starting at 100ms) is
   * added before each restart to prevent flooding the server.
   */
  RestartPolicy?: RestartPolicy;
  /**
   * Automatically remove the container when the container's process
   * exits. This has no effect if `RestartPolicy` is set.
   */
  AutoRemove?: boolean;
  /** Driver that this container uses to mount volumes. */
  VolumeDriver?: string;
  /**
   * A list of volumes to inherit from another container, specified in
   * the form `<container name>[:<ro|rw>]`.
   */
  VolumesFrom?: string[];
  /** Specification for mounts to be added to the container. */
  Mounts?: Mount[];
  /**
   * Initial console size, as an `[height, width]` array.
   * @maxItems 2
   * @minItems 2
   */
  ConsoleSize?: number[] | null;
  /**
   * Arbitrary non-identifying metadata attached to container and
   * provided to the runtime when the container is started.
   */
  Annotations?: Record<string, string>;
  /**
   * A list of kernel capabilities to add to the container. Conflicts
   * with option 'Capabilities'.
   */
  CapAdd?: string[];
  /**
   * A list of kernel capabilities to drop from the container. Conflicts
   * with option 'Capabilities'.
   */
  CapDrop?: string[];
  /**
   * cgroup namespace mode for the container. Possible values are:
   *
   * - `"private"`: the container runs in its own private cgroup namespace
   * - `"host"`: use the host system's cgroup namespace
   *
   * If not specified, the daemon default is used, which can either be `"private"`
   * or `"host"`, depending on daemon version, kernel support and configuration.
   */
  CgroupnsMode?: "private" | "host";
  /** A list of DNS servers for the container to use. */
  Dns?: string[];
  /** A list of DNS options. */
  DnsOptions?: string[];
  /** A list of DNS search domains. */
  DnsSearch?: string[];
  /**
   * A list of hostnames/IP mappings to add to the container's `/etc/hosts`
   * file. Specified in the form `["hostname:IP"]`.
   */
  ExtraHosts?: string[];
  /** A list of additional groups that the container process will run as. */
  GroupAdd?: string[];
  /**
   * IPC sharing mode for the container. Possible values are:
   *
   * - `"none"`: own private IPC namespace, with /dev/shm not mounted
   * - `"private"`: own private IPC namespace
   * - `"shareable"`: own private IPC namespace, with a possibility to share it with other containers
   * - `"container:<name|id>"`: join another (shareable) container's IPC namespace
   * - `"host"`: use the host system's IPC namespace
   *
   * If not specified, daemon default is used, which can either be `"private"`
   * or `"shareable"`, depending on daemon version and configuration.
   */
  IpcMode?: string;
  /** Cgroup to use for the container. */
  Cgroup?: string;
  /** A list of links for the container in the form `container_name:alias`. */
  Links?: string[];
  /**
   * An integer value containing the score given to the container in
   * order to tune OOM killer preferences.
   * @example 500
   */
  OomScoreAdj?: number;
  /**
   * Set the PID (Process) Namespace mode for the container. It can be
   * either:
   *
   * - `"container:<name|id>"`: joins another container's PID namespace
   * - `"host"`: use the host's PID namespace inside the container
   */
  PidMode?: string;
  /** Gives the container full access to the host. */
  Privileged?: boolean;
  /**
   * Allocates an ephemeral host port for all of a container's
   * exposed ports.
   *
   * Ports are de-allocated when the container stops and allocated when
   * the container starts. The allocated port might be changed when
   * restarting the container.
   *
   * The port is selected from the ephemeral port range that depends on
   * the kernel. For example, on Linux the range is defined by
   * `/proc/sys/net/ipv4/ip_local_port_range`.
   */
  PublishAllPorts?: boolean;
  /** Mount the container's root filesystem as read only. */
  ReadonlyRootfs?: boolean;
  /**
   * A list of string values to customize labels for MLS systems, such
   * as SELinux.
   */
  SecurityOpt?: string[];
  /** Storage driver options for this container, in the form `{"size": "120G"}`. */
  StorageOpt?: Record<string, string>;
  /**
   * A map of container directories which should be replaced by tmpfs
   * mounts, and their corresponding mount options. For example:
   *
   * ```
   * { "/run": "rw,noexec,nosuid,size=65536k" }
   * ```
   */
  Tmpfs?: Record<string, string>;
  /** UTS namespace to use for the container. */
  UTSMode?: string;
  /**
   * Sets the usernamespace mode for the container when usernamespace
   * remapping option is enabled.
   */
  UsernsMode?: string;
  /**
   * Size of `/dev/shm` in bytes. If omitted, the system uses 64MB.
   * @format int64
   * @min 0
   */
  ShmSize?: number;
  /**
   * A list of kernel parameters (sysctls) to set in the container.
   * For example:
   *
   * ```
   * {"net.ipv4.ip_forward": "1"}
   * ```
   */
  Sysctls?: Record<string, string>;
  /** Runtime to use with this container. */
  Runtime?: string;
  /** Isolation technology of the container. (Windows only) */
  Isolation?: "default" | "process" | "hyperv";
  /**
   * The list of paths to be masked inside the container (this overrides
   * the default set of paths).
   */
  MaskedPaths?: string[];
  /**
   * The list of paths to be set as read-only inside the container
   * (this overrides the default set of paths).
   */
  ReadonlyPaths?: string[];
};

/**
 * Configuration for a container that is portable between hosts.
 *
 * When used as `ContainerConfig` field in an image, `ContainerConfig` is an
 * optional field containing the configuration of the container that was last
 * committed when creating the image.
 *
 * Previous versions of Docker builder used this field to store build cache,
 * and it is not in active use anymore.
 */
export interface ContainerConfig {
  /**
   * The hostname to use for the container, as a valid RFC 1123 hostname.
   * @example "439f4e91bd1d"
   */
  Hostname?: string;
  /** The domain name to use for the container. */
  Domainname?: string;
  /** The user that commands are run as inside the container. */
  User?: string;
  /**
   * Whether to attach to `stdin`.
   * @default false
   */
  AttachStdin?: boolean;
  /**
   * Whether to attach to `stdout`.
   * @default true
   */
  AttachStdout?: boolean;
  /**
   * Whether to attach to `stderr`.
   * @default true
   */
  AttachStderr?: boolean;
  /**
   * An object mapping ports to an empty object in the form:
   *
   * `{"<port>/<tcp|udp|sctp>": {}}`
   * @example {"80/tcp":{},"443/tcp":{}}
   */
  ExposedPorts?: Record<string, "[object Object]">;
  /**
   * Attach standard streams to a TTY, including `stdin` if it is not closed.
   * @default false
   */
  Tty?: boolean;
  /**
   * Open `stdin`
   * @default false
   */
  OpenStdin?: boolean;
  /**
   * Close `stdin` after one attached client disconnects
   * @default false
   */
  StdinOnce?: boolean;
  /**
   * A list of environment variables to set inside the container in the
   * form `["VAR=value", ...]`. A variable without `=` is removed from the
   * environment, rather than to have an empty value.
   * @example ["PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"]
   */
  Env?: string[];
  /**
   * Command to run specified as a string or an array of strings.
   * @example ["/bin/sh"]
   */
  Cmd?: string[];
  /** A test to perform to check that the container is healthy. */
  Healthcheck?: HealthConfig;
  /**
   * Command is already escaped (Windows only)
   * @default false
   * @example false
   */
  ArgsEscaped?: boolean | null;
  /**
   * The name (or reference) of the image to use when creating the container,
   * or which was used when the container was created.
   * @example "example-image:1.0"
   */
  Image?: string;
  /**
   * An object mapping mount point paths inside the container to empty
   * objects.
   */
  Volumes?: Record<string, "[object Object]">;
  /**
   * The working directory for commands to run in.
   * @example "/public/"
   */
  WorkingDir?: string;
  /**
   * The entry point for the container as a string or an array of strings.
   *
   * If the array consists of exactly one empty string (`[""]`) then the
   * entry point is reset to system default (i.e., the entry point used by
   * docker when there is no `ENTRYPOINT` instruction in the `Dockerfile`).
   * @example []
   */
  Entrypoint?: string[];
  /** Disable networking for the container. */
  NetworkDisabled?: boolean | null;
  /**
   * MAC address of the container.
   *
   * Deprecated: this field is deprecated in API v1.44 and up. Use EndpointSettings.MacAddress instead.
   */
  MacAddress?: string | null;
  /**
   * `ONBUILD` metadata that were defined in the image's `Dockerfile`.
   * @example []
   */
  OnBuild?: string[] | null;
  /**
   * User-defined key/value metadata.
   * @example {"com.example.some-label":"some-value","com.example.some-other-label":"some-other-value"}
   */
  Labels?: Record<string, string>;
  /**
   * Signal to stop a container as a string or unsigned integer.
   * @example "SIGTERM"
   */
  StopSignal?: string | null;
  /**
   * Timeout to stop a container in seconds.
   * @default 10
   */
  StopTimeout?: number | null;
  /**
   * Shell for when `RUN`, `CMD`, and `ENTRYPOINT` uses a shell.
   * @example ["/bin/sh","-c"]
   */
  Shell?: string[] | null;
}

/**
 * NetworkingConfig represents the container's networking configuration for
 * each of its interfaces.
 * It is used for the networking configs specified in the `docker create`
 * and `docker network connect` commands.
 * @example {"EndpointsConfig":{"isolated_nw":{"IPAMConfig":{"IPv4Address":"172.20.30.33","IPv6Address":"2001:db8:abcd::3033","LinkLocalIPs":["169.254.34.68","fe80::3468"]},"MacAddress":"02:42:ac:12:05:02","Links":["container_1","container_2"],"Aliases":["server_x","server_y"]},"database_nw":{}}}
 */
export interface NetworkingConfig {
  /**
   * A mapping of network name to endpoint configuration for that network.
   * The endpoint configuration can be left empty to connect to that
   * network with no particular endpoint configuration.
   */
  EndpointsConfig?: Record<string, EndpointSettings>;
}

/** NetworkSettings exposes the network settings in the API */
export interface NetworkSettings {
  /**
   * Name of the default bridge interface when dockerd's --bridge flag is set.
   * @example "docker0"
   */
  Bridge?: string;
  /**
   * SandboxID uniquely represents a container's network stack.
   * @example "9d12daf2c33f5959c8bf90aa513e4f65b561738661003029ec84830cd503a0c3"
   */
  SandboxID?: string;
  /**
   * Indicates if hairpin NAT should be enabled on the virtual interface.
   *
   * Deprecated: This field is never set and will be removed in a future release.
   * @example false
   */
  HairpinMode?: boolean;
  /**
   * IPv6 unicast address using the link-local prefix.
   *
   * Deprecated: This field is never set and will be removed in a future release.
   * @example ""
   */
  LinkLocalIPv6Address?: string;
  /**
   * Prefix length of the IPv6 unicast address.
   *
   * Deprecated: This field is never set and will be removed in a future release.
   * @example ""
   */
  LinkLocalIPv6PrefixLen?: number;
  /**
   * PortMap describes the mapping of container ports to host ports, using the
   * container's port-number and protocol as key in the format `<port>/<protocol>`,
   * for example, `80/udp`.
   *
   * If a container's port is mapped for multiple protocols, separate entries
   * are added to the mapping table.
   */
  Ports?: PortMap;
  /**
   * SandboxKey is the full path of the netns handle
   * @example "/var/run/docker/netns/8ab54b426c38"
   */
  SandboxKey?: string;
  /** Deprecated: This field is never set and will be removed in a future release. */
  SecondaryIPAddresses?: Address[] | null;
  /** Deprecated: This field is never set and will be removed in a future release. */
  SecondaryIPv6Addresses?: Address[] | null;
  /**
   * EndpointID uniquely represents a service endpoint in a Sandbox.
   *
   * <p><br /></p>
   *
   * > **Deprecated**: This field is only propagated when attached to the
   * > default "bridge" network. Use the information from the "bridge"
   * > network inside the `Networks` map instead, which contains the same
   * > information. This field was deprecated in Docker 1.9 and is scheduled
   * > to be removed in Docker 17.12.0
   * @example "b88f5b905aabf2893f3cbc4ee42d1ea7980bbc0a92e2c8922b1e1795298afb0b"
   */
  EndpointID?: string;
  /**
   * Gateway address for the default "bridge" network.
   *
   * <p><br /></p>
   *
   * > **Deprecated**: This field is only propagated when attached to the
   * > default "bridge" network. Use the information from the "bridge"
   * > network inside the `Networks` map instead, which contains the same
   * > information. This field was deprecated in Docker 1.9 and is scheduled
   * > to be removed in Docker 17.12.0
   * @example "172.17.0.1"
   */
  Gateway?: string;
  /**
   * Global IPv6 address for the default "bridge" network.
   *
   * <p><br /></p>
   *
   * > **Deprecated**: This field is only propagated when attached to the
   * > default "bridge" network. Use the information from the "bridge"
   * > network inside the `Networks` map instead, which contains the same
   * > information. This field was deprecated in Docker 1.9 and is scheduled
   * > to be removed in Docker 17.12.0
   * @example "2001:db8::5689"
   */
  GlobalIPv6Address?: string;
  /**
   * Mask length of the global IPv6 address.
   *
   * <p><br /></p>
   *
   * > **Deprecated**: This field is only propagated when attached to the
   * > default "bridge" network. Use the information from the "bridge"
   * > network inside the `Networks` map instead, which contains the same
   * > information. This field was deprecated in Docker 1.9 and is scheduled
   * > to be removed in Docker 17.12.0
   * @example 64
   */
  GlobalIPv6PrefixLen?: number;
  /**
   * IPv4 address for the default "bridge" network.
   *
   * <p><br /></p>
   *
   * > **Deprecated**: This field is only propagated when attached to the
   * > default "bridge" network. Use the information from the "bridge"
   * > network inside the `Networks` map instead, which contains the same
   * > information. This field was deprecated in Docker 1.9 and is scheduled
   * > to be removed in Docker 17.12.0
   * @example "172.17.0.4"
   */
  IPAddress?: string;
  /**
   * Mask length of the IPv4 address.
   *
   * <p><br /></p>
   *
   * > **Deprecated**: This field is only propagated when attached to the
   * > default "bridge" network. Use the information from the "bridge"
   * > network inside the `Networks` map instead, which contains the same
   * > information. This field was deprecated in Docker 1.9 and is scheduled
   * > to be removed in Docker 17.12.0
   * @example 16
   */
  IPPrefixLen?: number;
  /**
   * IPv6 gateway address for this network.
   *
   * <p><br /></p>
   *
   * > **Deprecated**: This field is only propagated when attached to the
   * > default "bridge" network. Use the information from the "bridge"
   * > network inside the `Networks` map instead, which contains the same
   * > information. This field was deprecated in Docker 1.9 and is scheduled
   * > to be removed in Docker 17.12.0
   * @example "2001:db8:2::100"
   */
  IPv6Gateway?: string;
  /**
   * MAC address for the container on the default "bridge" network.
   *
   * <p><br /></p>
   *
   * > **Deprecated**: This field is only propagated when attached to the
   * > default "bridge" network. Use the information from the "bridge"
   * > network inside the `Networks` map instead, which contains the same
   * > information. This field was deprecated in Docker 1.9 and is scheduled
   * > to be removed in Docker 17.12.0
   * @example "02:42:ac:11:00:04"
   */
  MacAddress?: string;
  /** Information about all networks that the container is connected to. */
  Networks?: Record<string, EndpointSettings>;
}

/** Address represents an IPv4 or IPv6 IP address. */
export interface Address {
  /** IP address. */
  Addr?: string;
  /** Mask length of the IP address. */
  PrefixLen?: number;
}

/**
 * PortMap describes the mapping of container ports to host ports, using the
 * container's port-number and protocol as key in the format `<port>/<protocol>`,
 * for example, `80/udp`.
 *
 * If a container's port is mapped for multiple protocols, separate entries
 * are added to the mapping table.
 * @example {"443/tcp":[{"HostIp":"127.0.0.1","HostPort":"4443"}],"80/tcp":[{"HostIp":"0.0.0.0","HostPort":"80"},{"HostIp":"0.0.0.0","HostPort":"8080"}],"80/udp":[{"HostIp":"0.0.0.0","HostPort":"80"}],"53/udp":[{"HostIp":"0.0.0.0","HostPort":"53"}],"2377/tcp":null}
 */
export type PortMap = Record<string, PortBinding[] | null>;

/**
 * PortBinding represents a binding between a host IP address and a host
 * port.
 */
export interface PortBinding {
  /**
   * Host IP address that the container's port is mapped to.
   * @example "127.0.0.1"
   */
  HostIp?: string;
  /**
   * Host port number that the container's port is mapped to.
   * @example "4443"
   */
  HostPort?: string;
}

/**
 * Information about the storage driver used to store the container's and
 * image's filesystem.
 */
export interface GraphDriverData {
  /**
   * Name of the storage driver.
   * @example "overlay2"
   */
  Name: string;
  /**
   * Low-level storage metadata, provided as key/value pairs.
   *
   * This information is driver-specific, and depends on the storage-driver
   * in use, and should be used for informational purposes only.
   * @example {"MergedDir":"/var/lib/docker/overlay2/ef749362d13333e65fc95c572eb525abbe0052e16e086cb64bc3b98ae9aa6d74/merged","UpperDir":"/var/lib/docker/overlay2/ef749362d13333e65fc95c572eb525abbe0052e16e086cb64bc3b98ae9aa6d74/diff","WorkDir":"/var/lib/docker/overlay2/ef749362d13333e65fc95c572eb525abbe0052e16e086cb64bc3b98ae9aa6d74/work"}
   */
  Data: Record<string, string>;
}

/** Change in the container's filesystem. */
export interface FilesystemChange {
  /** Path to file or directory that has changed. */
  Path: string;
  /**
   * Kind of change
   *
   * Can be one of:
   *
   * - `0`: Modified ("C")
   * - `1`: Added ("A")
   * - `2`: Deleted ("D")
   */
  Kind: ChangeType;
}

/**
 * Kind of change
 *
 * Can be one of:
 *
 * - `0`: Modified ("C")
 * - `1`: Added ("A")
 * - `2`: Deleted ("D")
 * @format uint8
 */
export enum ChangeType {
  Value0 = 0,
  Value1 = 1,
  Value2 = 2,
}

/** Information about an image in the local image cache. */
export interface ImageInspect {
  /**
   * ID is the content-addressable ID of an image.
   *
   * This identifier is a content-addressable digest calculated from the
   * image's configuration (which includes the digests of layers used by
   * the image).
   *
   * Note that this digest differs from the `RepoDigests` below, which
   * holds digests of image manifests that reference the image.
   * @example "sha256:ec3f0931a6e6b6855d76b2d7b0be30e81860baccd891b2e243280bf1cd8ad710"
   */
  Id: string;
  /**
   * List of image names/tags in the local image cache that reference this
   * image.
   *
   * Multiple image tags can refer to the same image, and this list may be
   * empty if no tags reference the image, in which case the image is
   * "untagged", in which case it can still be referenced by its ID.
   * @example ["example:1.0","example:latest","example:stable","internal.registry.example.com:5000/example:1.0"]
   */
  RepoTags?: string[];
  /**
   * List of content-addressable digests of locally available image manifests
   * that the image is referenced from. Multiple manifests can refer to the
   * same image.
   *
   * These digests are usually only available if the image was either pulled
   * from a registry, or if the image was pushed to a registry, which is when
   * the manifest is generated and its digest calculated.
   * @example ["example@sha256:afcc7f1ac1b49db317a7196c902e61c6c3c4607d63599ee1a82d702d249a0ccb","internal.registry.example.com:5000/example@sha256:b69959407d21e8a062e0416bf13405bb2b71ed7a84dde4158ebafacfa06f5578"]
   */
  RepoDigests?: string[];
  /**
   * ID of the parent image.
   *
   * Depending on how the image was created, this field may be empty and
   * is only set for images that were built/created locally. This field
   * is empty if the image was pulled from an image registry.
   * @example ""
   */
  Parent: string;
  /**
   * Optional message that was set when committing or importing the image.
   * @example ""
   */
  Comment: string;
  /**
   * Date and time at which the image was created, formatted in
   * [RFC 3339](https://www.ietf.org/rfc/rfc3339.txt) format with nano-seconds.
   *
   * This information is only available if present in the image,
   * and omitted otherwise.
   * @format dateTime
   * @example "2022-02-04T21:20:12.497794809Z"
   */
  Created?: string | null;
  /**
   * The ID of the container that was used to create the image.
   *
   * Depending on how the image was created, this field may be empty.
   *
   * **Deprecated**: this field is kept for backward compatibility, but
   * will be removed in API v1.45.
   * @example "65974bc86f1770ae4bff79f651ebdbce166ae9aada632ee3fa9af3a264911735"
   */
  Container?: string;
  /**
   * **Deprecated**: this field is kept for backward compatibility, but
   * will be removed in API v1.45.
   */
  ContainerConfig?: ContainerConfig;
  /**
   * The version of Docker that was used to build the image.
   *
   * Depending on how the image was created, this field may be empty.
   * @example "20.10.7"
   */
  DockerVersion: string;
  /**
   * Name of the author that was specified when committing the image, or as
   * specified through MAINTAINER (deprecated) in the Dockerfile.
   * @example ""
   */
  Author: string;
  /**
   * Configuration for a container that is portable between hosts.
   *
   * When used as `ContainerConfig` field in an image, `ContainerConfig` is an
   * optional field containing the configuration of the container that was last
   * committed when creating the image.
   *
   * Previous versions of Docker builder used this field to store build cache,
   * and it is not in active use anymore.
   */
  Config?: ContainerConfig;
  /**
   * Hardware CPU architecture that the image runs on.
   * @example "arm"
   */
  Architecture: string;
  /**
   * CPU architecture variant (presently ARM-only).
   * @example "v7"
   */
  Variant?: string | null;
  /**
   * Operating System the image is built to run on.
   * @example "linux"
   */
  Os: string;
  /**
   * Operating System version the image is built to run on (especially
   * for Windows).
   * @example ""
   */
  OsVersion?: string | null;
  /**
   * Total size of the image including all layers it is composed of.
   * @format int64
   * @example 1239828
   */
  Size: number;
  /**
   * Total size of the image including all layers it is composed of.
   *
   * Deprecated: this field is omitted in API v1.44, but kept for backward compatibility. Use Size instead.
   * @format int64
   * @example 1239828
   */
  VirtualSize?: number;
  /**
   * Information about the storage driver used to store the container's and
   * image's filesystem.
   */
  GraphDriver?: GraphDriverData;
  /** Information about the image's RootFS, including the layer IDs. */
  RootFS?: {
    /** @example "layers" */
    Type: string;
    /** @example ["sha256:1834950e52ce4d5a88a1bbd131c537f4d0e56d10ff0dd69e66be3b7dfa9df7e6","sha256:5f70bf18a086007016e948b04aed3b82103a36bea41755b6cddfaf10ace3c6ef"] */
    Layers?: string[];
  };
  /**
   * Additional metadata of the image in the local cache. This information
   * is local to the daemon, and not part of the image itself.
   */
  Metadata?: {
    /**
     * Date and time at which the image was last tagged in
     * [RFC 3339](https://www.ietf.org/rfc/rfc3339.txt) format with nano-seconds.
     *
     * This information is only available if the image was tagged locally,
     * and omitted otherwise.
     * @format dateTime
     * @example "2022-02-28T14:40:02.623929178Z"
     */
    LastTagTime?: string | null;
  };
}

export interface ImageSummary {
  /**
   * ID is the content-addressable ID of an image.
   *
   * This identifier is a content-addressable digest calculated from the
   * image's configuration (which includes the digests of layers used by
   * the image).
   *
   * Note that this digest differs from the `RepoDigests` below, which
   * holds digests of image manifests that reference the image.
   * @example "sha256:ec3f0931a6e6b6855d76b2d7b0be30e81860baccd891b2e243280bf1cd8ad710"
   */
  Id: string;
  /**
   * ID of the parent image.
   *
   * Depending on how the image was created, this field may be empty and
   * is only set for images that were built/created locally. This field
   * is empty if the image was pulled from an image registry.
   * @example ""
   */
  ParentId: string;
  /**
   * List of image names/tags in the local image cache that reference this
   * image.
   *
   * Multiple image tags can refer to the same image, and this list may be
   * empty if no tags reference the image, in which case the image is
   * "untagged", in which case it can still be referenced by its ID.
   * @example ["example:1.0","example:latest","example:stable","internal.registry.example.com:5000/example:1.0"]
   */
  RepoTags: string[];
  /**
   * List of content-addressable digests of locally available image manifests
   * that the image is referenced from. Multiple manifests can refer to the
   * same image.
   *
   * These digests are usually only available if the image was either pulled
   * from a registry, or if the image was pushed to a registry, which is when
   * the manifest is generated and its digest calculated.
   * @example ["example@sha256:afcc7f1ac1b49db317a7196c902e61c6c3c4607d63599ee1a82d702d249a0ccb","internal.registry.example.com:5000/example@sha256:b69959407d21e8a062e0416bf13405bb2b71ed7a84dde4158ebafacfa06f5578"]
   */
  RepoDigests: string[];
  /**
   * Date and time at which the image was created as a Unix timestamp
   * (number of seconds sinds EPOCH).
   * @example "1644009612"
   */
  Created: number;
  /**
   * Total size of the image including all layers it is composed of.
   * @format int64
   * @example 172064416
   */
  Size: number;
  /**
   * Total size of image layers that are shared between this image and other
   * images.
   *
   * This size is not calculated by default. `-1` indicates that the value
   * has not been set / calculated.
   * @format int64
   * @example 1239828
   */
  SharedSize: number;
  /**
   * Total size of the image including all layers it is composed of.
   *
   * Deprecated: this field is omitted in API v1.44, but kept for backward compatibility. Use Size instead.
   * @format int64
   * @example 172064416
   */
  VirtualSize?: number;
  /**
   * User-defined key/value metadata.
   * @example {"com.example.some-label":"some-value","com.example.some-other-label":"some-other-value"}
   */
  Labels: Record<string, string>;
  /**
   * Number of containers using this image. Includes both stopped and running
   * containers.
   *
   * This size is not calculated by default, and depends on which API endpoint
   * is used. `-1` indicates that the value has not been set / calculated.
   * @example 2
   */
  Containers: number;
}

/** @example {"username":"hannibal","password":"xxxx","serveraddress":"https://index.docker.io/v1/"} */
export interface AuthConfig {
  username?: string;
  password?: string;
  email?: string;
  serveraddress?: string;
}

export interface ProcessConfig {
  privileged?: boolean;
  user?: string;
  tty?: boolean;
  entrypoint?: string;
  arguments?: string[];
}

export interface Volume {
  /**
   * Name of the volume.
   * @example "tardis"
   */
  Name: string;
  /**
   * Name of the volume driver used by the volume.
   * @example "custom"
   */
  Driver: string;
  /**
   * Mount path of the volume on the host.
   * @example "/var/lib/docker/volumes/tardis"
   */
  Mountpoint: string;
  /**
   * Date/Time the volume was created.
   * @format dateTime
   * @example "2016-06-07T20:31:11.853781916Z"
   */
  CreatedAt?: string;
  /**
   * Low-level details about the volume, provided by the volume driver.
   * Details are returned as a map with key/value pairs:
   * `{"key":"value","key2":"value2"}`.
   *
   * The `Status` field is optional, and is omitted if the volume driver
   * does not support this feature.
   * @example {"hello":"world"}
   */
  Status?: Record<string, object>;
  /**
   * User-defined key/value metadata.
   * @example {"com.example.some-label":"some-value","com.example.some-other-label":"some-other-value"}
   */
  Labels: Record<string, string>;
  /**
   * The level at which the volume exists. Either `global` for cluster-wide,
   * or `local` for machine level.
   * @default "local"
   * @example "local"
   */
  Scope: "local" | "global";
  /**
   * Options and information specific to, and only present on, Swarm CSI
   * cluster volumes.
   */
  ClusterVolume?: ClusterVolume;
  /**
   * The driver specific options used when creating the volume.
   * @example {"device":"tmpfs","o":"size=100m,uid=1000","type":"tmpfs"}
   */
  Options: Record<string, string>;
  /**
   * Usage details about the volume. This information is used by the
   * `GET /system/df` endpoint, and omitted in other endpoints.
   */
  UsageData?: {
    /**
     * Amount of disk space used by the volume (in bytes). This information
     * is only available for volumes created with the `"local"` volume
     * driver. For volumes created with other volume drivers, this field
     * is set to `-1` ("not available")
     * @format int64
     * @default -1
     */
    Size: number;
    /**
     * The number of containers referencing this volume. This field
     * is set to `-1` if the reference-count is not available.
     * @format int64
     * @default -1
     */
    RefCount: number;
  } | null;
}

/**
 * VolumeConfig
 * Volume configuration
 */
export interface VolumeCreateOptions {
  /**
   * The new volume's name. If not specified, Docker generates a name.
   * @example "tardis"
   */
  Name: string;
  /**
   * Name of the volume driver to use.
   * @default "local"
   * @example "custom"
   */
  Driver: string;
  /**
   * A mapping of driver options and values. These options are
   * passed directly to the driver and are driver specific.
   * @example {"device":"tmpfs","o":"size=100m,uid=1000","type":"tmpfs"}
   */
  DriverOpts?: Record<string, string>;
  /**
   * User-defined key/value metadata.
   * @example {"com.example.some-label":"some-value","com.example.some-other-label":"some-other-value"}
   */
  Labels?: Record<string, string>;
  /** Cluster-specific options used to create the volume. */
  ClusterVolumeSpec?: ClusterVolumeSpec;
}

/**
 * VolumeListResponse
 * Volume list response
 */
export interface VolumeListResponse {
  /** List of volumes */
  Volumes?: Volume[];
  /**
   * Warnings that occurred when fetching the list of volumes.
   * @example []
   */
  Warnings?: string[];
}

/** @example {"Name":"net01","Id":"7d86d31b1478e7cca9ebed7e73aa0fdeec46c5ca29497431d3007d2d9e15ed99","Created":"2016-10-19T04:33:30.360899459Z","Scope":"local","Driver":"bridge","EnableIPv6":false,"IPAM":{"Driver":"default","Config":[{"Subnet":"172.19.0.0/16","Gateway":"172.19.0.1"}],"Options":{"foo":"bar"}},"Internal":false,"Attachable":false,"Ingress":false,"Containers":{"19a4d5d687db25203351ed79d478946f861258f018fe384f229f2efa4b23513c":{"Name":"test","EndpointID":"628cadb8bcb92de107b2a1e516cbffe463e321f548feb37697cce00ad694f21a","MacAddress":"02:42:ac:13:00:02","IPv4Address":"172.19.0.2/16","IPv6Address":""}},"Options":{"com.docker.network.bridge.default_bridge":"true","com.docker.network.bridge.enable_icc":"true","com.docker.network.bridge.enable_ip_masquerade":"true","com.docker.network.bridge.host_binding_ipv4":"0.0.0.0","com.docker.network.bridge.name":"docker0","com.docker.network.driver.mtu":"1500"},"Labels":{"com.example.some-label":"some-value","com.example.some-other-label":"some-other-value"}} */
export interface Network {
  Name?: string;
  Id?: string;
  /** @format dateTime */
  Created?: string;
  Scope?: string;
  Driver?: string;
  EnableIPv6?: boolean;
  IPAM?: IPAM;
  Internal?: boolean;
  Attachable?: boolean;
  Ingress?: boolean;
  Containers?: Record<string, NetworkContainer>;
  Options?: Record<string, string>;
  Labels?: Record<string, string>;
}

export interface IPAM {
  /**
   * Name of the IPAM driver to use.
   * @default "default"
   */
  Driver?: string;
  /**
   * List of IPAM configuration options, specified as a map:
   *
   * ```
   * {"Subnet": <CIDR>, "IPRange": <CIDR>, "Gateway": <IP address>, "AuxAddress": <device_name:IP address>}
   * ```
   */
  Config?: IPAMConfig[];
  /** Driver-specific options, specified as a map. */
  Options?: Record<string, string>;
}

export interface IPAMConfig {
  Subnet?: string;
  IPRange?: string;
  Gateway?: string;
  AuxiliaryAddresses?: Record<string, string>;
}

export interface NetworkContainer {
  Name?: string;
  EndpointID?: string;
  MacAddress?: string;
  IPv4Address?: string;
  IPv6Address?: string;
}

export interface BuildInfo {
  id?: string;
  stream?: string;
  error?: string;
  errorDetail?: ErrorDetail;
  status?: string;
  progress?: string;
  progressDetail?: ProgressDetail;
  /** Image ID or Digest */
  aux?: ImageID;
}

/** BuildCache contains information about a build cache record. */
export interface BuildCache {
  /**
   * Unique ID of the build cache record.
   * @example "ndlpt0hhvkqcdfkputsk4cq9c"
   */
  ID?: string;
  /**
   * ID of the parent build cache record.
   *
   * > **Deprecated**: This field is deprecated, and omitted if empty.
   * @example ""
   */
  Parent?: string | null;
  /**
   * List of parent build cache record IDs.
   * @example ["hw53o5aio51xtltp5xjp8v7fx"]
   */
  Parents?: string[] | null;
  /**
   * Cache record type.
   * @example "regular"
   */
  Type?: "internal" | "frontend" | "source.local" | "source.git.checkout" | "exec.cachemount" | "regular";
  /**
   * Description of the build-step that produced the build cache.
   * @example "mount / from exec /bin/sh -c echo 'Binary::apt::APT::Keep-Downloaded-Packages "true";' > /etc/apt/apt.conf.d/keep-cache"
   */
  Description?: string;
  /**
   * Indicates if the build cache is in use.
   * @example false
   */
  InUse?: boolean;
  /**
   * Indicates if the build cache is shared.
   * @example true
   */
  Shared?: boolean;
  /**
   * Amount of disk space used by the build cache (in bytes).
   * @example 51
   */
  Size?: number;
  /**
   * Date and time at which the build cache was created in
   * [RFC 3339](https://www.ietf.org/rfc/rfc3339.txt) format with nano-seconds.
   * @format dateTime
   * @example "2016-08-18T10:44:24.496525531Z"
   */
  CreatedAt?: string;
  /**
   * Date and time at which the build cache was last used in
   * [RFC 3339](https://www.ietf.org/rfc/rfc3339.txt) format with nano-seconds.
   * @format dateTime
   * @example "2017-08-09T07:09:37.632105588Z"
   */
  LastUsedAt?: string | null;
  /** @example 26 */
  UsageCount?: number;
}

/**
 * Image ID or Digest
 * @example {"ID":"sha256:85f05633ddc1c50679be2b16a0479ab6f7637f8884e0cfe0f4d20e1ebb3d6e7c"}
 */
export interface ImageID {
  ID?: string;
}

export interface CreateImageInfo {
  id?: string;
  error?: string;
  errorDetail?: ErrorDetail;
  status?: string;
  progress?: string;
  progressDetail?: ProgressDetail;
}

export interface PushImageInfo {
  error?: string;
  status?: string;
  progress?: string;
  progressDetail?: ProgressDetail;
}

export interface ErrorDetail {
  code?: number;
  message?: string;
}

export interface ProgressDetail {
  current?: number;
  total?: number;
}

/**
 * Represents an error.
 * @example {"message":"Something went wrong."}
 */
export interface ErrorResponse {
  /** The error message. */
  message: string;
}

/** Response to an API call that returns just an Id */
export interface IdResponse {
  /** The id of the newly created object. */
  Id: string;
}

/** Configuration for a network endpoint. */
export interface EndpointSettings {
  /** EndpointIPAMConfig represents an endpoint's IPAM configuration. */
  IPAMConfig?: EndpointIPAMConfig;
  /** @example ["container_1","container_2"] */
  Links?: string[];
  /**
   * MAC address for the endpoint on this network. The network driver might ignore this parameter.
   * @example "02:42:ac:11:00:04"
   */
  MacAddress?: string;
  /** @example ["server_x","server_y"] */
  Aliases?: string[];
  /**
   * Unique ID of the network.
   * @example "08754567f1f40222263eab4102e1c733ae697e8e354aa9cd6e18d7402835292a"
   */
  NetworkID?: string;
  /**
   * Unique ID for the service endpoint in a Sandbox.
   * @example "b88f5b905aabf2893f3cbc4ee42d1ea7980bbc0a92e2c8922b1e1795298afb0b"
   */
  EndpointID?: string;
  /**
   * Gateway address for this network.
   * @example "172.17.0.1"
   */
  Gateway?: string;
  /**
   * IPv4 address.
   * @example "172.17.0.4"
   */
  IPAddress?: string;
  /**
   * Mask length of the IPv4 address.
   * @example 16
   */
  IPPrefixLen?: number;
  /**
   * IPv6 gateway address.
   * @example "2001:db8:2::100"
   */
  IPv6Gateway?: string;
  /**
   * Global IPv6 address.
   * @example "2001:db8::5689"
   */
  GlobalIPv6Address?: string;
  /**
   * Mask length of the global IPv6 address.
   * @format int64
   * @example 64
   */
  GlobalIPv6PrefixLen?: number;
  /**
   * DriverOpts is a mapping of driver options and values. These options
   * are passed directly to the driver and are driver specific.
   * @example {"com.example.some-label":"some-value","com.example.some-other-label":"some-other-value"}
   */
  DriverOpts?: Record<string, string>;
  /**
   * List of all DNS names an endpoint has on a specific network. This
   * list is based on the container name, network aliases, container short
   * ID, and hostname.
   *
   * These DNS names are non-fully qualified but can contain several dots.
   * You can get fully qualified DNS names by appending `.<network-name>`.
   * For instance, if container name is `my.ctr` and the network is named
   * `testnet`, `DNSNames` will contain `my.ctr` and the FQDN will be
   * `my.ctr.testnet`.
   * @example ["foobar","server_x","server_y","my.ctr"]
   */
  DNSNames?: string[];
}

/** EndpointIPAMConfig represents an endpoint's IPAM configuration. */
export type EndpointIPAMConfig = {
  /** @example "172.20.30.33" */
  IPv4Address?: string;
  /** @example "2001:db8:abcd::3033" */
  IPv6Address?: string;
  /** @example ["169.254.34.68","fe80::3468"] */
  LinkLocalIPs?: string[];
} | null;

export interface PluginMount {
  /** @example "some-mount" */
  Name: string;
  /** @example "This is a mount that's used by the plugin." */
  Description: string;
  Settable: string[];
  /** @example "/var/lib/docker/plugins/" */
  Source: string;
  /** @example "/mnt/state" */
  Destination: string;
  /** @example "bind" */
  Type: string;
  /** @example ["rbind","rw"] */
  Options: string[];
}

export interface PluginDevice {
  Name: string;
  Description: string;
  Settable: string[];
  /** @example "/dev/fuse" */
  Path: string;
}

export interface PluginEnv {
  Name: string;
  Description: string;
  Settable: string[];
  Value: string;
}

export interface PluginInterfaceType {
  Prefix: string;
  Capability: string;
  Version: string;
}

/**
 * Describes a permission the user has to accept upon installing
 * the plugin.
 */
export interface PluginPrivilege {
  /** @example "network" */
  Name?: string;
  Description?: string;
  /** @example ["host"] */
  Value?: string[];
}

/** A plugin for the Engine API */
export interface Plugin {
  /** @example "5724e2c8652da337ab2eedd19fc6fc0ec908e4bd907c7421bf6a8dfc70c4c078" */
  Id?: string;
  /** @example "tiborvass/sample-volume-plugin" */
  Name: string;
  /**
   * True if the plugin is running. False if the plugin is not running, only installed.
   * @example true
   */
  Enabled: boolean;
  /** Settings that can be modified by users. */
  Settings: {
    Mounts: PluginMount[];
    /** @example ["DEBUG=0"] */
    Env: string[];
    Args: string[];
    Devices: PluginDevice[];
  };
  /**
   * plugin remote reference used to push/pull the plugin
   * @example "localhost:5000/tiborvass/sample-volume-plugin:latest"
   */
  PluginReference: string;
  /** The config of a plugin. */
  Config: {
    /**
     * Docker Version used to create the plugin
     * @example "17.06.0-ce"
     */
    DockerVersion: string;
    /** @example "A sample volume plugin for Docker" */
    Description: string;
    /** @example "https://docs.docker.com/engine/extend/plugins/" */
    Documentation: string;
    /** The interface between Docker and the plugin */
    Interface: {
      /** @example ["docker.volumedriver/1.0"] */
      Types: PluginInterfaceType[];
      /** @example "plugins.sock" */
      Socket: string;
      /**
       * Protocol to use for clients connecting to the plugin.
       * @example "some.protocol/v1.0"
       */
      ProtocolScheme?: "" | "moby.plugins.http/v1";
    };
    /** @example ["/usr/bin/sample-volume-plugin","/data"] */
    Entrypoint: string[];
    /** @example "/bin/" */
    WorkDir: string;
    User: {
      /**
       * @format uint32
       * @example 1000
       */
      UID?: number;
      /**
       * @format uint32
       * @example 1000
       */
      GID?: number;
    };
    Network: {
      /** @example "host" */
      Type: string;
    };
    Linux: {
      /** @example ["CAP_SYS_ADMIN","CAP_SYSLOG"] */
      Capabilities: string[];
      /** @example false */
      AllowAllDevices: boolean;
      Devices: PluginDevice[];
    };
    /** @example "/mnt/volumes" */
    PropagatedMount: string;
    /** @example false */
    IpcHost: boolean;
    /** @example false */
    PidHost: boolean;
    Mounts: PluginMount[];
    /** @example [{"Name":"DEBUG","Description":"If set, prints debug messages","Settable":null,"Value":"0"}] */
    Env: PluginEnv[];
    Args: {
      /** @example "args" */
      Name: string;
      /** @example "command line arguments" */
      Description: string;
      Settable: string[];
      Value: string[];
    };
    rootfs?: {
      /** @example "layers" */
      type?: string;
      /** @example ["sha256:675532206fbf3030b8458f88d6e26d4eb1577688a25efec97154c94e8b6b4887","sha256:e216a057b1cb1efc11f8a268f37ef62083e70b1b38323ba252e25ac88904a7e8"] */
      diff_ids?: string[];
    };
  };
}

/**
 * The version number of the object such as node, service, etc. This is needed
 * to avoid conflicting writes. The client must send the version number along
 * with the modified specification when updating these objects.
 *
 * This approach ensures safe concurrency and determinism in that the change
 * on the object may not be applied if the version number has changed from the
 * last read. In other words, if two update requests specify the same base
 * version, only one of the requests can succeed. As a result, two separate
 * update requests that happen at the same time will not unintentionally
 * overwrite each other.
 */
export interface ObjectVersion {
  /**
   * @format uint64
   * @example 373531
   */
  Index?: number;
}

/** @example {"Availability":"active","Name":"node-name","Role":"manager","Labels":{"foo":"bar"}} */
export interface NodeSpec {
  /**
   * Name for the node.
   * @example "my-node"
   */
  Name?: string;
  /** User-defined key/value metadata. */
  Labels?: Record<string, string>;
  /**
   * Role of the node.
   * @example "manager"
   */
  Role?: "worker" | "manager";
  /**
   * Availability of the node.
   * @example "active"
   */
  Availability?: "active" | "pause" | "drain";
}

export interface Node {
  /** @example "24ifsmvkjbyhk" */
  ID?: string;
  /**
   * The version number of the object such as node, service, etc. This is needed
   * to avoid conflicting writes. The client must send the version number along
   * with the modified specification when updating these objects.
   *
   * This approach ensures safe concurrency and determinism in that the change
   * on the object may not be applied if the version number has changed from the
   * last read. In other words, if two update requests specify the same base
   * version, only one of the requests can succeed. As a result, two separate
   * update requests that happen at the same time will not unintentionally
   * overwrite each other.
   */
  Version?: ObjectVersion;
  /**
   * Date and time at which the node was added to the swarm in
   * [RFC 3339](https://www.ietf.org/rfc/rfc3339.txt) format with nano-seconds.
   * @format dateTime
   * @example "2016-08-18T10:44:24.496525531Z"
   */
  CreatedAt?: string;
  /**
   * Date and time at which the node was last updated in
   * [RFC 3339](https://www.ietf.org/rfc/rfc3339.txt) format with nano-seconds.
   * @format dateTime
   * @example "2017-08-09T07:09:37.632105588Z"
   */
  UpdatedAt?: string;
  Spec?: NodeSpec;
  /**
   * NodeDescription encapsulates the properties of the Node as reported by the
   * agent.
   */
  Description?: NodeDescription;
  /**
   * NodeStatus represents the status of a node.
   *
   * It provides the current status of the node, as seen by the manager.
   */
  Status?: NodeStatus;
  /**
   * ManagerStatus represents the status of a manager.
   *
   * It provides the current status of a node's manager component, if the node
   * is a manager.
   */
  ManagerStatus?: ManagerStatus;
}

/**
 * NodeDescription encapsulates the properties of the Node as reported by the
 * agent.
 */
export interface NodeDescription {
  /** @example "bf3067039e47" */
  Hostname?: string;
  /** Platform represents the platform (Arch/OS). */
  Platform?: Platform;
  /**
   * An object describing the resources which can be advertised by a node and
   * requested by a task.
   */
  Resources?: ResourceObject;
  /** EngineDescription provides information about an engine. */
  Engine?: EngineDescription;
  /**
   * Information about the issuer of leaf TLS certificates and the trusted root
   * CA certificate.
   */
  TLSInfo?: TLSInfo;
}

/** Platform represents the platform (Arch/OS). */
export interface Platform {
  /**
   * Architecture represents the hardware architecture (for example,
   * `x86_64`).
   * @example "x86_64"
   */
  Architecture?: string;
  /**
   * OS represents the Operating System (for example, `linux` or `windows`).
   * @example "linux"
   */
  OS?: string;
}

/** EngineDescription provides information about an engine. */
export interface EngineDescription {
  /** @example "17.06.0" */
  EngineVersion?: string;
  /** @example {"foo":"bar"} */
  Labels?: Record<string, string>;
  /** @example [{"Type":"Log","Name":"awslogs"},{"Type":"Log","Name":"fluentd"},{"Type":"Log","Name":"gcplogs"},{"Type":"Log","Name":"gelf"},{"Type":"Log","Name":"journald"},{"Type":"Log","Name":"json-file"},{"Type":"Log","Name":"splunk"},{"Type":"Log","Name":"syslog"},{"Type":"Network","Name":"bridge"},{"Type":"Network","Name":"host"},{"Type":"Network","Name":"ipvlan"},{"Type":"Network","Name":"macvlan"},{"Type":"Network","Name":"null"},{"Type":"Network","Name":"overlay"},{"Type":"Volume","Name":"local"},{"Type":"Volume","Name":"localhost:5000/vieux/sshfs:latest"},{"Type":"Volume","Name":"vieux/sshfs:latest"}] */
  Plugins?: {
    Type?: string;
    Name?: string;
  }[];
}

/**
 * Information about the issuer of leaf TLS certificates and the trusted root
 * CA certificate.
 * @example {"TrustRoot":"-----BEGIN CERTIFICATE-----\nMIIBajCCARCgAwIBAgIUbYqrLSOSQHoxD8CwG6Bi2PJi9c8wCgYIKoZIzj0EAwIw\nEzERMA8GA1UEAxMIc3dhcm0tY2EwHhcNMTcwNDI0MjE0MzAwWhcNMzcwNDE5MjE0\nMzAwWjATMREwDwYDVQQDEwhzd2FybS1jYTBZMBMGByqGSM49AgEGCCqGSM49AwEH\nA0IABJk/VyMPYdaqDXJb/VXh5n/1Yuv7iNrxV3Qb3l06XD46seovcDWs3IZNV1lf\n3Skyr0ofcchipoiHkXBODojJydSjQjBAMA4GA1UdDwEB/wQEAwIBBjAPBgNVHRMB\nAf8EBTADAQH/MB0GA1UdDgQWBBRUXxuRcnFjDfR/RIAUQab8ZV/n4jAKBggqhkjO\nPQQDAgNIADBFAiAy+JTe6Uc3KyLCMiqGl2GyWGQqQDEcO3/YG36x7om65AIhAJvz\npxv6zFeVEkAEEkqIYi0omA9+CjanB/6Bz4n1uw8H\n-----END CERTIFICATE-----\n","CertIssuerSubject":"MBMxETAPBgNVBAMTCHN3YXJtLWNh","CertIssuerPublicKey":"MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEmT9XIw9h1qoNclv9VeHmf/Vi6/uI2vFXdBveXTpcPjqx6i9wNazchk1XWV/dKTKvSh9xyGKmiIeRcE4OiMnJ1A=="}
 */
export interface TLSInfo {
  /**
   * The root CA certificate(s) that are used to validate leaf TLS
   * certificates.
   */
  TrustRoot?: string;
  /** The base64-url-safe-encoded raw subject bytes of the issuer. */
  CertIssuerSubject?: string;
  /** The base64-url-safe-encoded raw public key bytes of the issuer. */
  CertIssuerPublicKey?: string;
}

/**
 * NodeStatus represents the status of a node.
 *
 * It provides the current status of the node, as seen by the manager.
 */
export interface NodeStatus {
  /** NodeState represents the state of a node. */
  State?: NodeState;
  /** @example "" */
  Message?: string;
  /**
   * IP address of the node.
   * @example "172.17.0.2"
   */
  Addr?: string;
}

/**
 * NodeState represents the state of a node.
 * @example "ready"
 */
export enum NodeState {
  Unknown = "unknown",
  Down = "down",
  Ready = "ready",
  Disconnected = "disconnected",
}

/**
 * ManagerStatus represents the status of a manager.
 *
 * It provides the current status of a node's manager component, if the node
 * is a manager.
 */
export type ManagerStatus = {
  /**
   * @default false
   * @example true
   */
  Leader?: boolean;
  /** Reachability represents the reachability of a node. */
  Reachability?: Reachability;
  /**
   * The IP address and port at which the manager is reachable.
   * @example "10.0.0.46:2377"
   */
  Addr?: string;
} | null;

/**
 * Reachability represents the reachability of a node.
 * @example "reachable"
 */
export enum Reachability {
  Unknown = "unknown",
  Unreachable = "unreachable",
  Reachable = "reachable",
}

/** User modifiable swarm configuration. */
export interface SwarmSpec {
  /**
   * Name of the swarm.
   * @example "default"
   */
  Name?: string;
  /**
   * User-defined key/value metadata.
   * @example {"com.example.corp.type":"production","com.example.corp.department":"engineering"}
   */
  Labels?: Record<string, string>;
  /** Orchestration configuration. */
  Orchestration?: {
    /**
     * The number of historic tasks to keep per instance or node. If
     * negative, never remove completed or failed tasks.
     * @format int64
     * @example 10
     */
    TaskHistoryRetentionLimit?: number;
  } | null;
  /** Raft configuration. */
  Raft?: {
    /**
     * The number of log entries between snapshots.
     * @format uint64
     * @example 10000
     */
    SnapshotInterval?: number;
    /**
     * The number of snapshots to keep beyond the current snapshot.
     * @format uint64
     */
    KeepOldSnapshots?: number;
    /**
     * The number of log entries to keep around to sync up slow followers
     * after a snapshot is created.
     * @format uint64
     * @example 500
     */
    LogEntriesForSlowFollowers?: number;
    /**
     * The number of ticks that a follower will wait for a message from
     * the leader before becoming a candidate and starting an election.
     * `ElectionTick` must be greater than `HeartbeatTick`.
     *
     * A tick currently defaults to one second, so these translate
     * directly to seconds currently, but this is NOT guaranteed.
     * @example 3
     */
    ElectionTick?: number;
    /**
     * The number of ticks between heartbeats. Every HeartbeatTick ticks,
     * the leader will send a heartbeat to the followers.
     *
     * A tick currently defaults to one second, so these translate
     * directly to seconds currently, but this is NOT guaranteed.
     * @example 1
     */
    HeartbeatTick?: number;
  };
  /** Dispatcher configuration. */
  Dispatcher?: {
    /**
     * The delay for an agent to send a heartbeat to the dispatcher.
     * @format int64
     * @example 5000000000
     */
    HeartbeatPeriod?: number;
  } | null;
  /** CA configuration. */
  CAConfig?: {
    /**
     * The duration node certificates are issued for.
     * @format int64
     * @example 7776000000000000
     */
    NodeCertExpiry?: number;
    /**
     * Configuration for forwarding signing requests to an external
     * certificate authority.
     */
    ExternalCAs?: {
      /**
       * Protocol for communication with the external CA (currently
       * only `cfssl` is supported).
       * @default "cfssl"
       */
      Protocol?: "cfssl";
      /** URL where certificate signing requests should be sent. */
      URL?: string;
      /**
       * An object with key/value pairs that are interpreted as
       * protocol-specific options for the external CA driver.
       */
      Options?: Record<string, string>;
      /**
       * The root CA certificate (in PEM format) this external CA uses
       * to issue TLS certificates (assumed to be to the current swarm
       * root CA certificate if not provided).
       */
      CACert?: string;
    }[];
    /**
     * The desired signing CA certificate for all swarm node TLS leaf
     * certificates, in PEM format.
     */
    SigningCACert?: string;
    /**
     * The desired signing CA key for all swarm node TLS leaf certificates,
     * in PEM format.
     */
    SigningCAKey?: string;
    /**
     * An integer whose purpose is to force swarm to generate a new
     * signing CA certificate and key, if none have been specified in
     * `SigningCACert` and `SigningCAKey`
     * @format uint64
     */
    ForceRotate?: number;
  } | null;
  /** Parameters related to encryption-at-rest. */
  EncryptionConfig?: {
    /**
     * If set, generate a key and use it to lock data stored on the
     * managers.
     * @example false
     */
    AutoLockManagers?: boolean;
  };
  /** Defaults for creating tasks in this cluster. */
  TaskDefaults?: {
    /**
     * The log driver to use for tasks created in the orchestrator if
     * unspecified by a service.
     *
     * Updating this value only affects new tasks. Existing tasks continue
     * to use their previously configured log driver until recreated.
     */
    LogDriver?: {
      /**
       * The log driver to use as a default for new tasks.
       * @example "json-file"
       */
      Name?: string;
      /**
       * Driver-specific options for the selectd log driver, specified
       * as key/value pairs.
       * @example {"max-file":"10","max-size":"100m"}
       */
      Options?: Record<string, string>;
    };
  };
}

/**
 * ClusterInfo represents information about the swarm as is returned by the
 * "/info" endpoint. Join-tokens are not included.
 */
export type ClusterInfo = {
  /**
   * The ID of the swarm.
   * @example "abajmipo7b4xz5ip2nrla6b11"
   */
  ID?: string;
  /**
   * The version number of the object such as node, service, etc. This is needed
   * to avoid conflicting writes. The client must send the version number along
   * with the modified specification when updating these objects.
   *
   * This approach ensures safe concurrency and determinism in that the change
   * on the object may not be applied if the version number has changed from the
   * last read. In other words, if two update requests specify the same base
   * version, only one of the requests can succeed. As a result, two separate
   * update requests that happen at the same time will not unintentionally
   * overwrite each other.
   */
  Version?: ObjectVersion;
  /**
   * Date and time at which the swarm was initialised in
   * [RFC 3339](https://www.ietf.org/rfc/rfc3339.txt) format with nano-seconds.
   * @format dateTime
   * @example "2016-08-18T10:44:24.496525531Z"
   */
  CreatedAt?: string;
  /**
   * Date and time at which the swarm was last updated in
   * [RFC 3339](https://www.ietf.org/rfc/rfc3339.txt) format with nano-seconds.
   * @format dateTime
   * @example "2017-08-09T07:09:37.632105588Z"
   */
  UpdatedAt?: string;
  /** User modifiable swarm configuration. */
  Spec?: SwarmSpec;
  /**
   * Information about the issuer of leaf TLS certificates and the trusted root
   * CA certificate.
   */
  TLSInfo?: TLSInfo;
  /**
   * Whether there is currently a root CA rotation in progress for the swarm
   * @example false
   */
  RootRotationInProgress?: boolean;
  /**
   * DataPathPort specifies the data path port number for data traffic.
   * Acceptable port range is 1024 to 49151.
   * If no port is set or is set to 0, the default port (4789) is used.
   * @format uint32
   * @default 4789
   * @example 4789
   */
  DataPathPort?: number;
  /**
   * Default Address Pool specifies default subnet pools for global scope
   * networks.
   */
  DefaultAddrPool?: string[];
  /**
   * SubnetSize specifies the subnet size of the networks created from the
   * default subnet pool.
   * @format uint32
   * @max 29
   * @default 24
   * @example 24
   */
  SubnetSize?: number;
} | null;

/** JoinTokens contains the tokens workers and managers need to join the swarm. */
export interface JoinTokens {
  /**
   * The token workers can use to join the swarm.
   * @example "SWMTKN-1-3pu6hszjas19xyp7ghgosyx9k8atbfcr8p2is99znpy26u2lkl-1awxwuwd3z9j1z3puu7rcgdbx"
   */
  Worker?: string;
  /**
   * The token managers can use to join the swarm.
   * @example "SWMTKN-1-3pu6hszjas19xyp7ghgosyx9k8atbfcr8p2is99znpy26u2lkl-7p73s1dx5in4tatdymyhg9hu2"
   */
  Manager?: string;
}

export type Swarm = ClusterInfo & {
  /** JoinTokens contains the tokens workers and managers need to join the swarm. */
  JoinTokens?: JoinTokens;
};

/** User modifiable task configuration. */
export interface TaskSpec {
  /**
   * Plugin spec for the service.  *(Experimental release only.)*
   *
   * <p><br /></p>
   *
   * > **Note**: ContainerSpec, NetworkAttachmentSpec, and PluginSpec are
   * > mutually exclusive. PluginSpec is only used when the Runtime field
   * > is set to `plugin`. NetworkAttachmentSpec is used when the Runtime
   * > field is set to `attachment`.
   */
  PluginSpec?: {
    /** The name or 'alias' to use for the plugin. */
    Name?: string;
    /** The plugin image reference to use. */
    Remote?: string;
    /** Disable the plugin once scheduled. */
    Disabled?: boolean;
    PluginPrivilege?: PluginPrivilege[];
  };
  /**
   * Container spec for the service.
   *
   * <p><br /></p>
   *
   * > **Note**: ContainerSpec, NetworkAttachmentSpec, and PluginSpec are
   * > mutually exclusive. PluginSpec is only used when the Runtime field
   * > is set to `plugin`. NetworkAttachmentSpec is used when the Runtime
   * > field is set to `attachment`.
   */
  ContainerSpec?: {
    /** The image name to use for the container */
    Image?: string;
    /** User-defined key/value data. */
    Labels?: Record<string, string>;
    /** The command to be run in the image. */
    Command?: string[];
    /** Arguments to the command. */
    Args?: string[];
    /**
     * The hostname to use for the container, as a valid
     * [RFC 1123](https://tools.ietf.org/html/rfc1123) hostname.
     */
    Hostname?: string;
    /** A list of environment variables in the form `VAR=value`. */
    Env?: string[];
    /** The working directory for commands to run in. */
    Dir?: string;
    /** The user inside the container. */
    User?: string;
    /** A list of additional groups that the container process will run as. */
    Groups?: string[];
    /** Security options for the container */
    Privileges?: {
      /** CredentialSpec for managed service account (Windows only) */
      CredentialSpec?: {
        /**
         * Load credential spec from a Swarm Config with the given ID.
         * The specified config must also be present in the Configs
         * field with the Runtime property set.
         *
         * <p><br /></p>
         *
         *
         * > **Note**: `CredentialSpec.File`, `CredentialSpec.Registry`,
         * > and `CredentialSpec.Config` are mutually exclusive.
         * @example "0bt9dmxjvjiqermk6xrop3ekq"
         */
        Config?: string;
        /**
         * Load credential spec from this file. The file is read by
         * the daemon, and must be present in the `CredentialSpecs`
         * subdirectory in the docker data directory, which defaults
         * to `C:\ProgramData\Docker\` on Windows.
         *
         * For example, specifying `spec.json` loads
         * `C:\ProgramData\Docker\CredentialSpecs\spec.json`.
         *
         * <p><br /></p>
         *
         * > **Note**: `CredentialSpec.File`, `CredentialSpec.Registry`,
         * > and `CredentialSpec.Config` are mutually exclusive.
         * @example "spec.json"
         */
        File?: string;
        /**
         * Load credential spec from this value in the Windows
         * registry. The specified registry value must be located in:
         *
         * `HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Virtualization\Containers\CredentialSpecs`
         *
         * <p><br /></p>
         *
         *
         * > **Note**: `CredentialSpec.File`, `CredentialSpec.Registry`,
         * > and `CredentialSpec.Config` are mutually exclusive.
         */
        Registry?: string;
      };
      /** SELinux labels of the container */
      SELinuxContext?: {
        /** Disable SELinux */
        Disable?: boolean;
        /** SELinux user label */
        User?: string;
        /** SELinux role label */
        Role?: string;
        /** SELinux type label */
        Type?: string;
        /** SELinux level label */
        Level?: string;
      };
      /** Options for configuring seccomp on the container */
      Seccomp?: {
        Mode?: "default" | "unconfined" | "custom";
        /** The custom seccomp profile as a json object */
        Profile?: string;
      };
      /** Options for configuring AppArmor on the container */
      AppArmor?: {
        Mode?: "default" | "disabled";
      };
      /** Configuration of the no_new_privs bit in the container */
      NoNewPrivileges?: boolean;
    };
    /** Whether a pseudo-TTY should be allocated. */
    TTY?: boolean;
    /** Open `stdin` */
    OpenStdin?: boolean;
    /** Mount the container's root filesystem as read only. */
    ReadOnly?: boolean;
    /**
     * Specification for mounts to be added to containers created as part
     * of the service.
     */
    Mounts?: Mount[];
    /** Signal to stop the container. */
    StopSignal?: string;
    /**
     * Amount of time to wait for the container to terminate before
     * forcefully killing it.
     * @format int64
     */
    StopGracePeriod?: number;
    /** A test to perform to check that the container is healthy. */
    HealthCheck?: HealthConfig;
    /**
     * A list of hostname/IP mappings to add to the container's `hosts`
     * file. The format of extra hosts is specified in the
     * [hosts(5)](http://man7.org/linux/man-pages/man5/hosts.5.html)
     * man page:
     *
     *     IP_address canonical_hostname [aliases...]
     */
    Hosts?: string[];
    /**
     * Specification for DNS related configurations in resolver configuration
     * file (`resolv.conf`).
     */
    DNSConfig?: {
      /** The IP addresses of the name servers. */
      Nameservers?: string[];
      /** A search list for host-name lookup. */
      Search?: string[];
      /**
       * A list of internal resolver variables to be modified (e.g.,
       * `debug`, `ndots:3`, etc.).
       */
      Options?: string[];
    };
    /**
     * Secrets contains references to zero or more secrets that will be
     * exposed to the service.
     */
    Secrets?: {
      /** File represents a specific target that is backed by a file. */
      File?: {
        /** Name represents the final filename in the filesystem. */
        Name?: string;
        /** UID represents the file UID. */
        UID?: string;
        /** GID represents the file GID. */
        GID?: string;
        /**
         * Mode represents the FileMode of the file.
         * @format uint32
         */
        Mode?: number;
      };
      /**
       * SecretID represents the ID of the specific secret that we're
       * referencing.
       */
      SecretID?: string;
      /**
       * SecretName is the name of the secret that this references,
       * but this is just provided for lookup/display purposes. The
       * secret in the reference will be identified by its ID.
       */
      SecretName?: string;
    }[];
    /**
     * Configs contains references to zero or more configs that will be
     * exposed to the service.
     */
    Configs?: {
      /**
       * File represents a specific target that is backed by a file.
       *
       * <p><br /><p>
       *
       * > **Note**: `Configs.File` and `Configs.Runtime` are mutually exclusive
       */
      File?: {
        /** Name represents the final filename in the filesystem. */
        Name?: string;
        /** UID represents the file UID. */
        UID?: string;
        /** GID represents the file GID. */
        GID?: string;
        /**
         * Mode represents the FileMode of the file.
         * @format uint32
         */
        Mode?: number;
      };
      /**
       * Runtime represents a target that is not mounted into the
       * container but is used by the task
       *
       * <p><br /><p>
       *
       * > **Note**: `Configs.File` and `Configs.Runtime` are mutually
       * > exclusive
       */
      Runtime?: object;
      /**
       * ConfigID represents the ID of the specific config that we're
       * referencing.
       */
      ConfigID?: string;
      /**
       * ConfigName is the name of the config that this references,
       * but this is just provided for lookup/display purposes. The
       * config in the reference will be identified by its ID.
       */
      ConfigName?: string;
    }[];
    /**
     * Isolation technology of the containers running the service.
     * (Windows only)
     */
    Isolation?: "default" | "process" | "hyperv";
    /**
     * Run an init inside the container that forwards signals and reaps
     * processes. This field is omitted if empty, and the default (as
     * configured on the daemon) is used.
     */
    Init?: boolean | null;
    /**
     * Set kernel namedspaced parameters (sysctls) in the container.
     * The Sysctls option on services accepts the same sysctls as the
     * are supported on containers. Note that while the same sysctls are
     * supported, no guarantees or checks are made about their
     * suitability for a clustered environment, and it's up to the user
     * to determine whether a given sysctl will work properly in a
     * Service.
     */
    Sysctls?: Record<string, string>;
    /**
     * A list of kernel capabilities to add to the default set
     * for the container.
     * @example ["CAP_NET_RAW","CAP_SYS_ADMIN","CAP_SYS_CHROOT","CAP_SYSLOG"]
     */
    CapabilityAdd?: string[];
    /**
     * A list of kernel capabilities to drop from the default set
     * for the container.
     * @example ["CAP_NET_RAW"]
     */
    CapabilityDrop?: string[];
    /** A list of resource limits to set in the container. For example: `{"Name": "nofile", "Soft": 1024, "Hard": 2048}`" */
    Ulimits?: {
      /** Name of ulimit */
      Name?: string;
      /** Soft limit */
      Soft?: number;
      /** Hard limit */
      Hard?: number;
    }[];
  };
  /**
   * Read-only spec type for non-swarm containers attached to swarm overlay
   * networks.
   *
   * <p><br /></p>
   *
   * > **Note**: ContainerSpec, NetworkAttachmentSpec, and PluginSpec are
   * > mutually exclusive. PluginSpec is only used when the Runtime field
   * > is set to `plugin`. NetworkAttachmentSpec is used when the Runtime
   * > field is set to `attachment`.
   */
  NetworkAttachmentSpec?: {
    /** ID of the container represented by this task */
    ContainerID?: string;
  };
  /**
   * Resource requirements which apply to each individual container created
   * as part of the service.
   */
  Resources?: {
    /** Define resources limits. */
    Limits?: Limit;
    /** Define resources reservation. */
    Reservations?: ResourceObject;
  };
  /**
   * Specification for the restart policy which applies to containers
   * created as part of this service.
   */
  RestartPolicy?: {
    /** Condition for restart. */
    Condition?: "none" | "on-failure" | "any";
    /**
     * Delay between restart attempts.
     * @format int64
     */
    Delay?: number;
    /**
     * Maximum attempts to restart a given container before giving up
     * (default value is 0, which is ignored).
     * @format int64
     * @default 0
     */
    MaxAttempts?: number;
    /**
     * Windows is the time window used to evaluate the restart policy
     * (default value is 0, which is unbounded).
     * @format int64
     * @default 0
     */
    Window?: number;
  };
  Placement?: {
    /**
     * An array of constraint expressions to limit the set of nodes where
     * a task can be scheduled. Constraint expressions can either use a
     * _match_ (`==`) or _exclude_ (`!=`) rule. Multiple constraints find
     * nodes that satisfy every expression (AND match). Constraints can
     * match node or Docker Engine labels as follows:
     *
     * node attribute       | matches                        | example
     * ---------------------|--------------------------------|-----------------------------------------------
     * `node.id`            | Node ID                        | `node.id==2ivku8v2gvtg4`
     * `node.hostname`      | Node hostname                  | `node.hostname!=node-2`
     * `node.role`          | Node role (`manager`/`worker`) | `node.role==manager`
     * `node.platform.os`   | Node operating system          | `node.platform.os==windows`
     * `node.platform.arch` | Node architecture              | `node.platform.arch==x86_64`
     * `node.labels`        | User-defined node labels       | `node.labels.security==high`
     * `engine.labels`      | Docker Engine's labels         | `engine.labels.operatingsystem==ubuntu-14.04`
     *
     * `engine.labels` apply to Docker Engine labels like operating system,
     * drivers, etc. Swarm administrators add `node.labels` for operational
     * purposes by using the [`node update endpoint`](#operation/NodeUpdate).
     * @example ["node.hostname!=node3.corp.example.com","node.role!=manager","node.labels.type==production","node.platform.os==linux","node.platform.arch==x86_64"]
     */
    Constraints?: string[];
    /**
     * Preferences provide a way to make the scheduler aware of factors
     * such as topology. They are provided in order from highest to
     * lowest precedence.
     * @example [{"Spread":{"SpreadDescriptor":"node.labels.datacenter"}},{"Spread":{"SpreadDescriptor":"node.labels.rack"}}]
     */
    Preferences?: {
      Spread?: {
        /** label descriptor, such as `engine.labels.az`. */
        SpreadDescriptor?: string;
      };
    }[];
    /**
     * Maximum number of replicas for per node (default value is 0, which
     * is unlimited)
     * @format int64
     * @default 0
     */
    MaxReplicas?: number;
    /**
     * Platforms stores all the platforms that the service's image can
     * run on. This field is used in the platform filter for scheduling.
     * If empty, then the platform filter is off, meaning there are no
     * scheduling restrictions.
     */
    Platforms?: Platform[];
  };
  /**
   * A counter that triggers an update even if no relevant parameters have
   * been changed.
   */
  ForceUpdate?: number;
  /** Runtime is the type of runtime specified for the task executor. */
  Runtime?: string;
  /** Specifies which networks the service should attach to. */
  Networks?: NetworkAttachmentConfig[];
  /**
   * Specifies the log driver to use for tasks created from this spec. If
   * not present, the default one for the swarm will be used, finally
   * falling back to the engine default if not specified.
   */
  LogDriver?: {
    Name?: string;
    Options?: Record<string, string>;
  };
}

export enum TaskState {
  New = "new",
  Allocated = "allocated",
  Pending = "pending",
  Assigned = "assigned",
  Accepted = "accepted",
  Preparing = "preparing",
  Ready = "ready",
  Starting = "starting",
  Running = "running",
  Complete = "complete",
  Shutdown = "shutdown",
  Failed = "failed",
  Rejected = "rejected",
  Remove = "remove",
  Orphaned = "orphaned",
}

/** represents the status of a container. */
export interface ContainerStatus {
  ContainerID?: string;
  PID?: number;
  ExitCode?: number;
}

/** represents the port status of a task's host ports whose service has published host ports */
export interface PortStatus {
  Ports?: EndpointPortConfig[];
}

/** represents the status of a task. */
export interface TaskStatus {
  /** @format dateTime */
  Timestamp?: string;
  State?: TaskState;
  Message?: string;
  Err?: string;
  /** represents the status of a container. */
  ContainerStatus?: ContainerStatus;
  /** represents the port status of a task's host ports whose service has published host ports */
  PortStatus?: PortStatus;
}

/** @example {"ID":"0kzzo1i0y4jz6027t0k7aezc7","Version":{"Index":71},"CreatedAt":"2016-06-07T21:07:31.171892745Z","UpdatedAt":"2016-06-07T21:07:31.376370513Z","Spec":{"ContainerSpec":{"Image":"redis"},"Resources":{"Limits":{},"Reservations":{}},"RestartPolicy":{"Condition":"any","MaxAttempts":0},"Placement":{}},"ServiceID":"9mnpnzenvg8p8tdbtq4wvbkcz","Slot":1,"NodeID":"60gvrl6tm78dmak4yl7srz94v","Status":{"Timestamp":"2016-06-07T21:07:31.290032978Z","State":"running","Message":"started","ContainerStatus":{"ContainerID":"e5d62702a1b48d01c3e02ca1e0212a250801fa8d67caca0b6f35919ebc12f035","PID":677}},"DesiredState":"running","NetworksAttachments":[{"Network":{"ID":"4qvuz4ko70xaltuqbt8956gd1","Version":{"Index":18},"CreatedAt":"2016-06-07T20:31:11.912919752Z","UpdatedAt":"2016-06-07T21:07:29.955277358Z","Spec":{"Name":"ingress","Labels":{"com.docker.swarm.internal":"true"},"DriverConfiguration":{},"IPAMOptions":{"Driver":{},"Configs":[{"Subnet":"10.255.0.0/16","Gateway":"10.255.0.1"}]}},"DriverState":{"Name":"overlay","Options":{"com.docker.network.driver.overlay.vxlanid_list":"256"}},"IPAMOptions":{"Driver":{"Name":"default"},"Configs":[{"Subnet":"10.255.0.0/16","Gateway":"10.255.0.1"}]}},"Addresses":["10.255.0.10/16"]}],"AssignedGenericResources":[{"DiscreteResourceSpec":{"Kind":"SSD","Value":3}},{"NamedResourceSpec":{"Kind":"GPU","Value":"UUID1"}},{"NamedResourceSpec":{"Kind":"GPU","Value":"UUID2"}}]} */
export interface Task {
  /** The ID of the task. */
  ID?: string;
  /**
   * The version number of the object such as node, service, etc. This is needed
   * to avoid conflicting writes. The client must send the version number along
   * with the modified specification when updating these objects.
   *
   * This approach ensures safe concurrency and determinism in that the change
   * on the object may not be applied if the version number has changed from the
   * last read. In other words, if two update requests specify the same base
   * version, only one of the requests can succeed. As a result, two separate
   * update requests that happen at the same time will not unintentionally
   * overwrite each other.
   */
  Version?: ObjectVersion;
  /** @format dateTime */
  CreatedAt?: string;
  /** @format dateTime */
  UpdatedAt?: string;
  /** Name of the task. */
  Name?: string;
  /** User-defined key/value metadata. */
  Labels?: Record<string, string>;
  /** User modifiable task configuration. */
  Spec?: TaskSpec;
  /** The ID of the service this task is part of. */
  ServiceID?: string;
  Slot?: number;
  /** The ID of the node that this task is on. */
  NodeID?: string;
  /**
   * User-defined resources can be either Integer resources (e.g, `SSD=3`) or
   * String resources (e.g, `GPU=UUID1`).
   */
  AssignedGenericResources?: GenericResources;
  /** represents the status of a task. */
  Status?: TaskStatus;
  DesiredState?: TaskState;
  /**
   * If the Service this Task belongs to is a job-mode service, contains
   * the JobIteration of the Service this Task was created for. Absent if
   * the Task was created for a Replicated or Global Service.
   */
  JobIteration?: ObjectVersion;
}

/** User modifiable configuration for a service. */
export interface ServiceSpec {
  /** Name of the service. */
  Name?: string;
  /** User-defined key/value metadata. */
  Labels?: Record<string, string>;
  /** User modifiable task configuration. */
  TaskTemplate?: TaskSpec;
  /** Scheduling mode for the service. */
  Mode?: {
    Replicated?: {
      /** @format int64 */
      Replicas?: number;
    };
    Global?: object;
    /**
     * The mode used for services with a finite number of tasks that run
     * to a completed state.
     */
    ReplicatedJob?: {
      /**
       * The maximum number of replicas to run simultaneously.
       * @format int64
       * @default 1
       */
      MaxConcurrent?: number;
      /**
       * The total number of replicas desired to reach the Completed
       * state. If unset, will default to the value of `MaxConcurrent`
       * @format int64
       */
      TotalCompletions?: number;
    };
    /**
     * The mode used for services which run a task to the completed state
     * on each valid node.
     */
    GlobalJob?: object;
  };
  /** Specification for the update strategy of the service. */
  UpdateConfig?: {
    /**
     * Maximum number of tasks to be updated in one iteration (0 means
     * unlimited parallelism).
     * @format int64
     */
    Parallelism?: number;
    /**
     * Amount of time between updates, in nanoseconds.
     * @format int64
     */
    Delay?: number;
    /**
     * Action to take if an updated task fails to run, or stops running
     * during the update.
     */
    FailureAction?: "continue" | "pause" | "rollback";
    /**
     * Amount of time to monitor each updated task for failures, in
     * nanoseconds.
     * @format int64
     */
    Monitor?: number;
    /**
     * The fraction of tasks that may fail during an update before the
     * failure action is invoked, specified as a floating point number
     * between 0 and 1.
     * @default 0
     */
    MaxFailureRatio?: number;
    /**
     * The order of operations when rolling out an updated task. Either
     * the old task is shut down before the new task is started, or the
     * new task is started before the old task is shut down.
     */
    Order?: "stop-first" | "start-first";
  };
  /** Specification for the rollback strategy of the service. */
  RollbackConfig?: {
    /**
     * Maximum number of tasks to be rolled back in one iteration (0 means
     * unlimited parallelism).
     * @format int64
     */
    Parallelism?: number;
    /**
     * Amount of time between rollback iterations, in nanoseconds.
     * @format int64
     */
    Delay?: number;
    /**
     * Action to take if an rolled back task fails to run, or stops
     * running during the rollback.
     */
    FailureAction?: "continue" | "pause";
    /**
     * Amount of time to monitor each rolled back task for failures, in
     * nanoseconds.
     * @format int64
     */
    Monitor?: number;
    /**
     * The fraction of tasks that may fail during a rollback before the
     * failure action is invoked, specified as a floating point number
     * between 0 and 1.
     * @default 0
     */
    MaxFailureRatio?: number;
    /**
     * The order of operations when rolling back a task. Either the old
     * task is shut down before the new task is started, or the new task
     * is started before the old task is shut down.
     */
    Order?: "stop-first" | "start-first";
  };
  /**
   * Specifies which networks the service should attach to.
   *
   * Deprecated: This field is deprecated since v1.44. The Networks field in TaskSpec should be used instead.
   */
  Networks?: NetworkAttachmentConfig[];
  /** Properties that can be configured to access and load balance a service. */
  EndpointSpec?: EndpointSpec;
}

export interface EndpointPortConfig {
  Name?: string;
  Protocol?: "tcp" | "udp" | "sctp";
  /** The port inside the container. */
  TargetPort?: number;
  /** The port on the swarm hosts. */
  PublishedPort?: number;
  /**
   * The mode in which port is published.
   *
   * <p><br /></p>
   *
   * - "ingress" makes the target port accessible on every node,
   *   regardless of whether there is a task for the service running on
   *   that node or not.
   * - "host" bypasses the routing mesh and publish the port directly on
   *   the swarm node where that service is running.
   * @default "ingress"
   * @example "ingress"
   */
  PublishMode?: "ingress" | "host";
}

/** Properties that can be configured to access and load balance a service. */
export interface EndpointSpec {
  /**
   * The mode of resolution to use for internal load balancing between tasks.
   * @default "vip"
   */
  Mode?: "vip" | "dnsrr";
  /**
   * List of exposed ports that this service is accessible on from the
   * outside. Ports can only be provided if `vip` resolution mode is used.
   */
  Ports?: EndpointPortConfig[];
}

/** @example {"ID":"9mnpnzenvg8p8tdbtq4wvbkcz","Version":{"Index":19},"CreatedAt":"2016-06-07T21:05:51.880065305Z","UpdatedAt":"2016-06-07T21:07:29.962229872Z","Spec":{"Name":"hopeful_cori","TaskTemplate":{"ContainerSpec":{"Image":"redis"},"Resources":{"Limits":{},"Reservations":{}},"RestartPolicy":{"Condition":"any","MaxAttempts":0},"Placement":{},"ForceUpdate":0},"Mode":{"Replicated":{"Replicas":1}},"UpdateConfig":{"Parallelism":1,"Delay":1000000000,"FailureAction":"pause","Monitor":15000000000,"MaxFailureRatio":0.15},"RollbackConfig":{"Parallelism":1,"Delay":1000000000,"FailureAction":"pause","Monitor":15000000000,"MaxFailureRatio":0.15},"EndpointSpec":{"Mode":"vip","Ports":[{"Protocol":"tcp","TargetPort":6379,"PublishedPort":30001}]}},"Endpoint":{"Spec":{"Mode":"vip","Ports":[{"Protocol":"tcp","TargetPort":6379,"PublishedPort":30001}]},"Ports":[{"Protocol":"tcp","TargetPort":6379,"PublishedPort":30001}],"VirtualIPs":[{"NetworkID":"4qvuz4ko70xaltuqbt8956gd1","Addr":"10.255.0.2/16"},{"NetworkID":"4qvuz4ko70xaltuqbt8956gd1","Addr":"10.255.0.3/16"}]}} */
export interface Service {
  ID?: string;
  /**
   * The version number of the object such as node, service, etc. This is needed
   * to avoid conflicting writes. The client must send the version number along
   * with the modified specification when updating these objects.
   *
   * This approach ensures safe concurrency and determinism in that the change
   * on the object may not be applied if the version number has changed from the
   * last read. In other words, if two update requests specify the same base
   * version, only one of the requests can succeed. As a result, two separate
   * update requests that happen at the same time will not unintentionally
   * overwrite each other.
   */
  Version?: ObjectVersion;
  /** @format dateTime */
  CreatedAt?: string;
  /** @format dateTime */
  UpdatedAt?: string;
  /** User modifiable configuration for a service. */
  Spec?: ServiceSpec;
  Endpoint?: {
    /** Properties that can be configured to access and load balance a service. */
    Spec?: EndpointSpec;
    Ports?: EndpointPortConfig[];
    VirtualIPs?: {
      NetworkID?: string;
      Addr?: string;
    }[];
  };
  /** The status of a service update. */
  UpdateStatus?: {
    State?: "updating" | "paused" | "completed";
    /** @format dateTime */
    StartedAt?: string;
    /** @format dateTime */
    CompletedAt?: string;
    Message?: string;
  };
  /**
   * The status of the service's tasks. Provided only when requested as
   * part of a ServiceList operation.
   */
  ServiceStatus?: {
    /**
     * The number of tasks for the service currently in the Running state.
     * @format uint64
     * @example 7
     */
    RunningTasks?: number;
    /**
     * The number of tasks for the service desired to be running.
     * For replicated services, this is the replica count from the
     * service spec. For global services, this is computed by taking
     * count of all tasks for the service with a Desired State other
     * than Shutdown.
     * @format uint64
     * @example 10
     */
    DesiredTasks?: number;
    /**
     * The number of tasks for a job that are in the Completed state.
     * This field must be cross-referenced with the service type, as the
     * value of 0 may mean the service is not in a job mode, or it may
     * mean the job-mode service has no tasks yet Completed.
     * @format uint64
     */
    CompletedTasks?: number;
  };
  /**
   * The status of the service when it is in one of ReplicatedJob or
   * GlobalJob modes. Absent on Replicated and Global mode services. The
   * JobIteration is an ObjectVersion, but unlike the Service's version,
   * does not need to be sent with an update request.
   */
  JobStatus?: {
    /**
     * JobIteration is a value increased each time a Job is executed,
     * successfully or otherwise. "Executed", in this case, means the
     * job as a whole has been started, not that an individual Task has
     * been launched. A job is "Executed" when its ServiceSpec is
     * updated. JobIteration can be used to disambiguate Tasks belonging
     * to different executions of a job.  Though JobIteration will
     * increase with each subsequent execution, it may not necessarily
     * increase by 1, and so JobIteration should not be used to
     */
    JobIteration?: ObjectVersion;
    /**
     * The last time, as observed by the server, that this job was
     * started.
     * @format dateTime
     */
    LastExecution?: string;
  };
}

export interface ImageDeleteResponseItem {
  /** The image ID of an image that was untagged */
  Untagged?: string;
  /** The image ID of an image that was deleted */
  Deleted?: string;
}

/**
 * contains the information returned to a client on the
 * creation of a new service.
 */
export interface ServiceCreateResponse {
  /**
   * The ID of the created service.
   * @example "ak7w3gjqoa3kuz8xcpnyy0pvl"
   */
  ID: string;
  /**
   * Optional warning message.
   *
   * FIXME(thaJeztah): this should have "omitempty" in the generated type.
   * @example ["unable to pin image doesnotexist:latest to digest: image library/doesnotexist:latest not found"]
   */
  Warnings?: string[] | null;
}

/** @example {"Warnings":["unable to pin image doesnotexist:latest to digest: image library/doesnotexist:latest not found"]} */
export interface ServiceUpdateResponse {
  /** Optional warning messages */
  Warnings?: string[];
}

export interface ContainerSummary {
  /** The ID of this container */
  Id?: string;
  /** The names that this container has been given */
  Names?: string[];
  /** The name of the image used when creating this container */
  Image?: string;
  /** The ID of the image that this container was created from */
  ImageID?: string;
  /** Command to run when starting the container */
  Command?: string;
  /**
   * When the container was created
   * @format int64
   */
  Created?: number;
  /** The ports exposed by this container */
  Ports?: Port[];
  /**
   * The size of files that have been created or changed by this container
   * @format int64
   */
  SizeRw?: number;
  /**
   * The total size of all the files in this container
   * @format int64
   */
  SizeRootFs?: number;
  /** User-defined key/value metadata. */
  Labels?: Record<string, string>;
  /** The state of this container (e.g. `Exited`) */
  State?: string;
  /** Additional human-readable status of this container (e.g. `Exit 0`) */
  Status?: string;
  HostConfig?: {
    NetworkMode?: string;
  };
  /** A summary of the container's network settings */
  NetworkSettings?: {
    Networks?: Record<string, EndpointSettings>;
  };
  Mounts?: MountPoint[];
}

/** Driver represents a driver (network, logging, secrets). */
export interface Driver {
  /**
   * Name of the driver.
   * @example "some-driver"
   */
  Name: string;
  /**
   * Key/value map of driver-specific options.
   * @example {"OptionA":"value for driver-specific option A","OptionB":"value for driver-specific option B"}
   */
  Options: Record<string, string>;
}

export interface SecretSpec {
  /** User-defined name of the secret. */
  Name?: string;
  /**
   * User-defined key/value metadata.
   * @example {"com.example.some-label":"some-value","com.example.some-other-label":"some-other-value"}
   */
  Labels?: Record<string, string>;
  /**
   * Base64-url-safe-encoded ([RFC 4648](https://tools.ietf.org/html/rfc4648#section-5))
   * data to store as secret.
   *
   * This field is only used to _create_ a secret, and is not returned by
   * other endpoints.
   * @example ""
   */
  Data?: string;
  /**
   * Name of the secrets driver used to fetch the secret's value from an
   * external secret store.
   */
  Driver?: Driver;
  /**
   * Templating driver, if applicable
   *
   * Templating controls whether and how to evaluate the config payload as
   * a template. If no driver is set, no templating is used.
   */
  Templating?: Driver;
}

export interface Secret {
  /** @example "blt1owaxmitz71s9v5zh81zun" */
  ID?: string;
  /**
   * The version number of the object such as node, service, etc. This is needed
   * to avoid conflicting writes. The client must send the version number along
   * with the modified specification when updating these objects.
   *
   * This approach ensures safe concurrency and determinism in that the change
   * on the object may not be applied if the version number has changed from the
   * last read. In other words, if two update requests specify the same base
   * version, only one of the requests can succeed. As a result, two separate
   * update requests that happen at the same time will not unintentionally
   * overwrite each other.
   */
  Version?: ObjectVersion;
  /**
   * @format dateTime
   * @example "2017-07-20T13:55:28.678958722Z"
   */
  CreatedAt?: string;
  /**
   * @format dateTime
   * @example "2017-07-20T13:55:28.678958722Z"
   */
  UpdatedAt?: string;
  Spec?: SecretSpec;
}

export interface ConfigSpec {
  /** User-defined name of the config. */
  Name?: string;
  /** User-defined key/value metadata. */
  Labels?: Record<string, string>;
  /**
   * Base64-url-safe-encoded ([RFC 4648](https://tools.ietf.org/html/rfc4648#section-5))
   * config data.
   */
  Data?: string;
  /**
   * Templating driver, if applicable
   *
   * Templating controls whether and how to evaluate the config payload as
   * a template. If no driver is set, no templating is used.
   */
  Templating?: Driver;
}

export interface Config {
  ID?: string;
  /**
   * The version number of the object such as node, service, etc. This is needed
   * to avoid conflicting writes. The client must send the version number along
   * with the modified specification when updating these objects.
   *
   * This approach ensures safe concurrency and determinism in that the change
   * on the object may not be applied if the version number has changed from the
   * last read. In other words, if two update requests specify the same base
   * version, only one of the requests can succeed. As a result, two separate
   * update requests that happen at the same time will not unintentionally
   * overwrite each other.
   */
  Version?: ObjectVersion;
  /** @format dateTime */
  CreatedAt?: string;
  /** @format dateTime */
  UpdatedAt?: string;
  Spec?: ConfigSpec;
}

/**
 * ContainerState stores container's running state. It's part of ContainerJSONBase
 * and will be returned by the "inspect" command.
 */
export type ContainerState = {
  /**
   * String representation of the container state. Can be one of "created",
   * "running", "paused", "restarting", "removing", "exited", or "dead".
   * @example "running"
   */
  Status?: "created" | "running" | "paused" | "restarting" | "removing" | "exited" | "dead";
  /**
   * Whether this container is running.
   *
   * Note that a running container can be _paused_. The `Running` and `Paused`
   * booleans are not mutually exclusive:
   *
   * When pausing a container (on Linux), the freezer cgroup is used to suspend
   * all processes in the container. Freezing the process requires the process to
   * be running. As a result, paused containers are both `Running` _and_ `Paused`.
   *
   * Use the `Status` field instead to determine if a container's state is "running".
   * @example true
   */
  Running?: boolean;
  /**
   * Whether this container is paused.
   * @example false
   */
  Paused?: boolean;
  /**
   * Whether this container is restarting.
   * @example false
   */
  Restarting?: boolean;
  /**
   * Whether a process within this container has been killed because it ran
   * out of memory since the container was last started.
   * @example false
   */
  OOMKilled?: boolean;
  /** @example false */
  Dead?: boolean;
  /**
   * The process ID of this container
   * @example 1234
   */
  Pid?: number;
  /**
   * The last exit code of this container
   * @example 0
   */
  ExitCode?: number;
  Error?: string;
  /**
   * The time when this container was last started.
   * @example "2020-01-06T09:06:59.461876391Z"
   */
  StartedAt?: string;
  /**
   * The time when this container last exited.
   * @example "2020-01-06T09:07:59.461876391Z"
   */
  FinishedAt?: string;
  /** Health stores information about the container's healthcheck results. */
  Health?: Health;
} | null;

/**
 * ContainerCreateResponse
 * OK response to ContainerCreate operation
 */
export interface ContainerCreateResponse {
  /**
   * The ID of the created container
   * @example "ede54ee1afda366ab42f824e8a5ffd195155d853ceaec74a927f249ea270c743"
   */
  Id: string;
  /**
   * Warnings encountered when creating the container
   * @example []
   */
  Warnings: string[];
}

/**
 * ContainerWaitResponse
 * OK response to ContainerWait operation
 */
export interface ContainerWaitResponse {
  /**
   * Exit code of the container
   * @format int64
   */
  StatusCode: number;
  /** container waiting error, if any */
  Error?: ContainerWaitExitError;
}

/** container waiting error, if any */
export interface ContainerWaitExitError {
  /** Details of an error */
  Message?: string;
}

/** Response of Engine API: GET "/version" */
export interface SystemVersion {
  Platform?: {
    Name: string;
  };
  /** Information about system components */
  Components?: {
    /**
     * Name of the component
     * @example "Engine"
     */
    Name: string;
    /**
     * Version of the component
     * @example "19.03.12"
     */
    Version: string;
    /**
     * Key/value pairs of strings with additional information about the
     * component. These values are intended for informational purposes
     * only, and their content is not defined, and not part of the API
     * specification.
     *
     * These messages can be printed by the client as information to the user.
     */
    Details?: object | null;
  }[];
  /**
   * The version of the daemon
   * @example "19.03.12"
   */
  Version?: string;
  /**
   * The default (and highest) API version that is supported by the daemon
   * @example "1.40"
   */
  ApiVersion?: string;
  /**
   * The minimum API version that is supported by the daemon
   * @example "1.12"
   */
  MinAPIVersion?: string;
  /**
   * The Git commit of the source code that was used to build the daemon
   * @example "48a66213fe"
   */
  GitCommit?: string;
  /**
   * The version Go used to compile the daemon, and the version of the Go
   * runtime in use.
   * @example "go1.13.14"
   */
  GoVersion?: string;
  /**
   * The operating system that the daemon is running on ("linux" or "windows")
   * @example "linux"
   */
  Os?: string;
  /**
   * The architecture that the daemon is running on
   * @example "amd64"
   */
  Arch?: string;
  /**
   * The kernel version (`uname -r`) that the daemon is running on.
   *
   * This field is omitted when empty.
   * @example "4.19.76-linuxkit"
   */
  KernelVersion?: string;
  /**
   * Indicates if the daemon is started with experimental features enabled.
   *
   * This field is omitted when empty / false.
   * @example true
   */
  Experimental?: boolean;
  /**
   * The date and time that the daemon was compiled.
   * @example "2020-06-22T15:49:27.000000000+00:00"
   */
  BuildTime?: string;
}

export interface SystemInfo {
  /**
   * Unique identifier of the daemon.
   *
   * <p><br /></p>
   *
   * > **Note**: The format of the ID itself is not part of the API, and
   * > should not be considered stable.
   * @example "7TRN:IPZB:QYBB:VPBQ:UMPP:KARE:6ZNR:XE6T:7EWV:PKF4:ZOJD:TPYS"
   */
  ID?: string;
  /**
   * Total number of containers on the host.
   * @example 14
   */
  Containers?: number;
  /**
   * Number of containers with status `"running"`.
   * @example 3
   */
  ContainersRunning?: number;
  /**
   * Number of containers with status `"paused"`.
   * @example 1
   */
  ContainersPaused?: number;
  /**
   * Number of containers with status `"stopped"`.
   * @example 10
   */
  ContainersStopped?: number;
  /**
   * Total number of images on the host.
   *
   * Both _tagged_ and _untagged_ (dangling) images are counted.
   * @example 508
   */
  Images?: number;
  /**
   * Name of the storage driver in use.
   * @example "overlay2"
   */
  Driver?: string;
  /**
   * Information specific to the storage driver, provided as
   * "label" / "value" pairs.
   *
   * This information is provided by the storage driver, and formatted
   * in a way consistent with the output of `docker info` on the command
   * line.
   *
   * <p><br /></p>
   *
   * > **Note**: The information returned in this field, including the
   * > formatting of values and labels, should not be considered stable,
   * > and may change without notice.
   * @example [["Backing Filesystem","extfs"],["Supports d_type","true"],["Native Overlay Diff","true"]]
   */
  DriverStatus?: string[][];
  /**
   * Root directory of persistent Docker state.
   *
   * Defaults to `/var/lib/docker` on Linux, and `C:\ProgramData\docker`
   * on Windows.
   * @example "/var/lib/docker"
   */
  DockerRootDir?: string;
  /**
   * Available plugins per type.
   *
   * <p><br /></p>
   *
   * > **Note**: Only unmanaged (V1) plugins are included in this list.
   * > V1 plugins are "lazily" loaded, and are not returned in this list
   * > if there is no resource using the plugin.
   */
  Plugins?: PluginsInfo;
  /**
   * Indicates if the host has memory limit support enabled.
   * @example true
   */
  MemoryLimit?: boolean;
  /**
   * Indicates if the host has memory swap limit support enabled.
   * @example true
   */
  SwapLimit?: boolean;
  /**
   * Indicates if the host has kernel memory TCP limit support enabled. This
   * field is omitted if not supported.
   *
   * Kernel memory TCP limits are not supported when using cgroups v2, which
   * does not support the corresponding `memory.kmem.tcp.limit_in_bytes` cgroup.
   * @example true
   */
  KernelMemoryTCP?: boolean;
  /**
   * Indicates if CPU CFS(Completely Fair Scheduler) period is supported by
   * the host.
   * @example true
   */
  CpuCfsPeriod?: boolean;
  /**
   * Indicates if CPU CFS(Completely Fair Scheduler) quota is supported by
   * the host.
   * @example true
   */
  CpuCfsQuota?: boolean;
  /**
   * Indicates if CPU Shares limiting is supported by the host.
   * @example true
   */
  CPUShares?: boolean;
  /**
   * Indicates if CPUsets (cpuset.cpus, cpuset.mems) are supported by the host.
   *
   * See [cpuset(7)](https://www.kernel.org/doc/Documentation/cgroup-v1/cpusets.txt)
   * @example true
   */
  CPUSet?: boolean;
  /**
   * Indicates if the host kernel has PID limit support enabled.
   * @example true
   */
  PidsLimit?: boolean;
  /** Indicates if OOM killer disable is supported on the host. */
  OomKillDisable?: boolean;
  /**
   * Indicates IPv4 forwarding is enabled.
   * @example true
   */
  IPv4Forwarding?: boolean;
  /**
   * Indicates if `bridge-nf-call-iptables` is available on the host.
   * @example true
   */
  BridgeNfIptables?: boolean;
  /**
   * Indicates if `bridge-nf-call-ip6tables` is available on the host.
   * @example true
   */
  BridgeNfIp6tables?: boolean;
  /**
   * Indicates if the daemon is running in debug-mode / with debug-level
   * logging enabled.
   * @example true
   */
  Debug?: boolean;
  /**
   * The total number of file Descriptors in use by the daemon process.
   *
   * This information is only returned if debug-mode is enabled.
   * @example 64
   */
  NFd?: number;
  /**
   * The  number of goroutines that currently exist.
   *
   * This information is only returned if debug-mode is enabled.
   * @example 174
   */
  NGoroutines?: number;
  /**
   * Current system-time in [RFC 3339](https://www.ietf.org/rfc/rfc3339.txt)
   * format with nano-seconds.
   * @example "2017-08-08T20:28:29.06202363Z"
   */
  SystemTime?: string;
  /** The logging driver to use as a default for new containers. */
  LoggingDriver?: string;
  /**
   * The driver to use for managing cgroups.
   * @default "cgroupfs"
   * @example "cgroupfs"
   */
  CgroupDriver?: "cgroupfs" | "systemd" | "none";
  /**
   * The version of the cgroup.
   * @default "1"
   * @example "1"
   */
  CgroupVersion?: "1" | "2";
  /**
   * Number of event listeners subscribed.
   * @example 30
   */
  NEventsListener?: number;
  /**
   * Kernel version of the host.
   *
   * On Linux, this information obtained from `uname`. On Windows this
   * information is queried from the <kbd>HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\</kbd>
   * registry value, for example _"10.0 14393 (14393.1198.amd64fre.rs1_release_sec.170427-1353)"_.
   * @example "4.9.38-moby"
   */
  KernelVersion?: string;
  /**
   * Name of the host's operating system, for example: "Ubuntu 16.04.2 LTS"
   * or "Windows Server 2016 Datacenter"
   * @example "Alpine Linux v3.5"
   */
  OperatingSystem?: string;
  /**
   * Version of the host's operating system
   *
   * <p><br /></p>
   *
   * > **Note**: The information returned in this field, including its
   * > very existence, and the formatting of values, should not be considered
   * > stable, and may change without notice.
   * @example "16.04"
   */
  OSVersion?: string;
  /**
   * Generic type of the operating system of the host, as returned by the
   * Go runtime (`GOOS`).
   *
   * Currently returned values are "linux" and "windows". A full list of
   * possible values can be found in the [Go documentation](https://go.dev/doc/install/source#environment).
   * @example "linux"
   */
  OSType?: string;
  /**
   * Hardware architecture of the host, as returned by the Go runtime
   * (`GOARCH`).
   *
   * A full list of possible values can be found in the [Go documentation](https://go.dev/doc/install/source#environment).
   * @example "x86_64"
   */
  Architecture?: string;
  /**
   * The number of logical CPUs usable by the daemon.
   *
   * The number of available CPUs is checked by querying the operating
   * system when the daemon starts. Changes to operating system CPU
   * allocation after the daemon is started are not reflected.
   * @example 4
   */
  NCPU?: number;
  /**
   * Total amount of physical memory available on the host, in bytes.
   * @format int64
   * @example 2095882240
   */
  MemTotal?: number;
  /**
   * Address / URL of the index server that is used for image search,
   * and as a default for user authentication for Docker Hub and Docker Cloud.
   * @default "https://index.docker.io/v1/"
   * @example "https://index.docker.io/v1/"
   */
  IndexServerAddress?: string;
  /** RegistryServiceConfig stores daemon registry services configuration. */
  RegistryConfig?: RegistryServiceConfig;
  /**
   * User-defined resources can be either Integer resources (e.g, `SSD=3`) or
   * String resources (e.g, `GPU=UUID1`).
   */
  GenericResources?: GenericResources;
  /**
   * HTTP-proxy configured for the daemon. This value is obtained from the
   * [`HTTP_PROXY`](https://www.gnu.org/software/wget/manual/html_node/Proxies.html) environment variable.
   * Credentials ([user info component](https://tools.ietf.org/html/rfc3986#section-3.2.1)) in the proxy URL
   * are masked in the API response.
   *
   * Containers do not automatically inherit this configuration.
   * @example "http://xxxxx:xxxxx@proxy.corp.example.com:8080"
   */
  HttpProxy?: string;
  /**
   * HTTPS-proxy configured for the daemon. This value is obtained from the
   * [`HTTPS_PROXY`](https://www.gnu.org/software/wget/manual/html_node/Proxies.html) environment variable.
   * Credentials ([user info component](https://tools.ietf.org/html/rfc3986#section-3.2.1)) in the proxy URL
   * are masked in the API response.
   *
   * Containers do not automatically inherit this configuration.
   * @example "https://xxxxx:xxxxx@proxy.corp.example.com:4443"
   */
  HttpsProxy?: string;
  /**
   * Comma-separated list of domain extensions for which no proxy should be
   * used. This value is obtained from the [`NO_PROXY`](https://www.gnu.org/software/wget/manual/html_node/Proxies.html)
   * environment variable.
   *
   * Containers do not automatically inherit this configuration.
   * @example "*.local, 169.254/16"
   */
  NoProxy?: string;
  /**
   * Hostname of the host.
   * @example "node5.corp.example.com"
   */
  Name?: string;
  /**
   * User-defined labels (key/value metadata) as set on the daemon.
   *
   * <p><br /></p>
   *
   * > **Note**: When part of a Swarm, nodes can both have _daemon_ labels,
   * > set through the daemon configuration, and _node_ labels, set from a
   * > manager node in the Swarm. Node labels are not included in this
   * > field. Node labels can be retrieved using the `/nodes/(id)` endpoint
   * > on a manager node in the Swarm.
   * @example ["storage=ssd","production"]
   */
  Labels?: string[];
  /**
   * Indicates if experimental features are enabled on the daemon.
   * @example true
   */
  ExperimentalBuild?: boolean;
  /**
   * Version string of the daemon.
   * @example "24.0.2"
   */
  ServerVersion?: string;
  /**
   * List of [OCI compliant](https://github.com/opencontainers/runtime-spec)
   * runtimes configured on the daemon. Keys hold the "name" used to
   * reference the runtime.
   *
   * The Docker daemon relies on an OCI compliant runtime (invoked via the
   * `containerd` daemon) as its interface to the Linux kernel namespaces,
   * cgroups, and SELinux.
   *
   * The default runtime is `runc`, and automatically configured. Additional
   * runtimes can be configured by the user and will be listed here.
   * @default {"runc":{"path":"runc"}}
   * @example {"runc":{"path":"runc"},"runc-master":{"path":"/go/bin/runc"},"custom":{"path":"/usr/local/bin/my-oci-runtime","runtimeArgs":["--debug","--systemd-cgroup=false"]}}
   */
  Runtimes?: Record<string, Runtime>;
  /**
   * Name of the default OCI runtime that is used when starting containers.
   *
   * The default can be overridden per-container at create time.
   * @default "runc"
   * @example "runc"
   */
  DefaultRuntime?: string;
  /** Represents generic information about swarm. */
  Swarm?: SwarmInfo;
  /**
   * Indicates if live restore is enabled.
   *
   * If enabled, containers are kept running when the daemon is shutdown
   * or upon daemon start if running containers are detected.
   * @default false
   * @example false
   */
  LiveRestoreEnabled?: boolean;
  /**
   * Represents the isolation technology to use as a default for containers.
   * The supported values are platform-specific.
   *
   * If no isolation value is specified on daemon start, on Windows client,
   * the default is `hyperv`, and on Windows server, the default is `process`.
   *
   * This option is currently not used on other platforms.
   * @default "default"
   */
  Isolation?: "default" | "hyperv" | "process";
  /**
   * Name and, optional, path of the `docker-init` binary.
   *
   * If the path is omitted, the daemon searches the host's `$PATH` for the
   * binary and uses the first result.
   * @example "docker-init"
   */
  InitBinary?: string;
  /**
   * Commit holds the Git-commit (SHA1) that a binary was built from, as
   * reported in the version-string of external tools, such as `containerd`,
   * or `runC`.
   */
  ContainerdCommit?: Commit;
  /**
   * Commit holds the Git-commit (SHA1) that a binary was built from, as
   * reported in the version-string of external tools, such as `containerd`,
   * or `runC`.
   */
  RuncCommit?: Commit;
  /**
   * Commit holds the Git-commit (SHA1) that a binary was built from, as
   * reported in the version-string of external tools, such as `containerd`,
   * or `runC`.
   */
  InitCommit?: Commit;
  /**
   * List of security features that are enabled on the daemon, such as
   * apparmor, seccomp, SELinux, user-namespaces (userns), rootless and
   * no-new-privileges.
   *
   * Additional configuration options for each security feature may
   * be present, and are included as a comma-separated list of key/value
   * pairs.
   * @example ["name=apparmor","name=seccomp,profile=default","name=selinux","name=userns","name=rootless"]
   */
  SecurityOptions?: string[];
  /**
   * Reports a summary of the product license on the daemon.
   *
   * If a commercial license has been applied to the daemon, information
   * such as number of nodes, and expiration are included.
   * @example "Community Engine"
   */
  ProductLicense?: string;
  /**
   * List of custom default address pools for local networks, which can be
   * specified in the daemon.json file or dockerd option.
   *
   * Example: a Base "10.10.0.0/16" with Size 24 will define the set of 256
   * 10.10.[0-255].0/24 address pools.
   */
  DefaultAddressPools?: {
    /**
     * The network address in CIDR format
     * @example "10.10.0.0/16"
     */
    Base?: string;
    /**
     * The network pool size
     * @example "24"
     */
    Size?: number;
  }[];
  /**
   * List of warnings / informational messages about missing features, or
   * issues related to the daemon configuration.
   *
   * These messages can be printed by the client as information to the user.
   * @example ["WARNING: No memory limit support","WARNING: bridge-nf-call-iptables is disabled","WARNING: bridge-nf-call-ip6tables is disabled"]
   */
  Warnings?: string[];
  /**
   * List of directories where (Container Device Interface) CDI
   * specifications are located.
   *
   * These specifications define vendor-specific modifications to an OCI
   * runtime specification for a container being created.
   *
   * An empty list indicates that CDI device injection is disabled.
   *
   * Note that since using CDI device injection requires the daemon to have
   * experimental enabled. For non-experimental daemons an empty list will
   * always be returned.
   * @example ["/etc/cdi","/var/run/cdi"]
   */
  CDISpecDirs?: string[];
}

/**
 * Available plugins per type.
 *
 * <p><br /></p>
 *
 * > **Note**: Only unmanaged (V1) plugins are included in this list.
 * > V1 plugins are "lazily" loaded, and are not returned in this list
 * > if there is no resource using the plugin.
 */
export interface PluginsInfo {
  /**
   * Names of available volume-drivers, and network-driver plugins.
   * @example ["local"]
   */
  Volume?: string[];
  /**
   * Names of available network-drivers, and network-driver plugins.
   * @example ["bridge","host","ipvlan","macvlan","null","overlay"]
   */
  Network?: string[];
  /**
   * Names of available authorization plugins.
   * @example ["img-authz-plugin","hbm"]
   */
  Authorization?: string[];
  /**
   * Names of available logging-drivers, and logging-driver plugins.
   * @example ["awslogs","fluentd","gcplogs","gelf","journald","json-file","splunk","syslog"]
   */
  Log?: string[];
}

/** RegistryServiceConfig stores daemon registry services configuration. */
export type RegistryServiceConfig = {
  /**
   * List of IP ranges to which nondistributable artifacts can be pushed,
   * using the CIDR syntax [RFC 4632](https://tools.ietf.org/html/4632).
   *
   * Some images (for example, Windows base images) contain artifacts
   * whose distribution is restricted by license. When these images are
   * pushed to a registry, restricted artifacts are not included.
   *
   * This configuration override this behavior, and enables the daemon to
   * push nondistributable artifacts to all registries whose resolved IP
   * address is within the subnet described by the CIDR syntax.
   *
   * This option is useful when pushing images containing
   * nondistributable artifacts to a registry on an air-gapped network so
   * hosts on that network can pull the images without connecting to
   * another server.
   *
   * > **Warning**: Nondistributable artifacts typically have restrictions
   * > on how and where they can be distributed and shared. Only use this
   * > feature to push artifacts to private registries and ensure that you
   * > are in compliance with any terms that cover redistributing
   * > nondistributable artifacts.
   * @example ["::1/128","127.0.0.0/8"]
   */
  AllowNondistributableArtifactsCIDRs?: string[];
  /**
   * List of registry hostnames to which nondistributable artifacts can be
   * pushed, using the format `<hostname>[:<port>]` or `<IP address>[:<port>]`.
   *
   * Some images (for example, Windows base images) contain artifacts
   * whose distribution is restricted by license. When these images are
   * pushed to a registry, restricted artifacts are not included.
   *
   * This configuration override this behavior for the specified
   * registries.
   *
   * This option is useful when pushing images containing
   * nondistributable artifacts to a registry on an air-gapped network so
   * hosts on that network can pull the images without connecting to
   * another server.
   *
   * > **Warning**: Nondistributable artifacts typically have restrictions
   * > on how and where they can be distributed and shared. Only use this
   * > feature to push artifacts to private registries and ensure that you
   * > are in compliance with any terms that cover redistributing
   * > nondistributable artifacts.
   * @example ["registry.internal.corp.example.com:3000","[2001:db8:a0b:12f0::1]:443"]
   */
  AllowNondistributableArtifactsHostnames?: string[];
  /**
   * List of IP ranges of insecure registries, using the CIDR syntax
   * ([RFC 4632](https://tools.ietf.org/html/4632)). Insecure registries
   * accept un-encrypted (HTTP) and/or untrusted (HTTPS with certificates
   * from unknown CAs) communication.
   *
   * By default, local registries (`127.0.0.0/8`) are configured as
   * insecure. All other registries are secure. Communicating with an
   * insecure registry is not possible if the daemon assumes that registry
   * is secure.
   *
   * This configuration override this behavior, insecure communication with
   * registries whose resolved IP address is within the subnet described by
   * the CIDR syntax.
   *
   * Registries can also be marked insecure by hostname. Those registries
   * are listed under `IndexConfigs` and have their `Secure` field set to
   * `false`.
   *
   * > **Warning**: Using this option can be useful when running a local
   * > registry, but introduces security vulnerabilities. This option
   * > should therefore ONLY be used for testing purposes. For increased
   * > security, users should add their CA to their system's list of trusted
   * > CAs instead of enabling this option.
   * @example ["::1/128","127.0.0.0/8"]
   */
  InsecureRegistryCIDRs?: string[];
  /** @example {"127.0.0.1:5000":{"Name":"127.0.0.1:5000","Mirrors":[],"Secure":false,"Official":false},"[2001:db8:a0b:12f0::1]:80":{"Name":"[2001:db8:a0b:12f0::1]:80","Mirrors":[],"Secure":false,"Official":false},"docker.io":{"Name":"docker.io","Mirrors":["https://hub-mirror.corp.example.com:5000/"],"Secure":true,"Official":true},"registry.internal.corp.example.com:3000":{"Name":"registry.internal.corp.example.com:3000","Mirrors":[],"Secure":false,"Official":false}} */
  IndexConfigs?: Record<string, IndexInfo>;
  /**
   * List of registry URLs that act as a mirror for the official
   * (`docker.io`) registry.
   * @example ["https://hub-mirror.corp.example.com:5000/","https://[2001:db8:a0b:12f0::1]/"]
   */
  Mirrors?: string[];
} | null;

/** IndexInfo contains information about a registry. */
export type IndexInfo = {
  /**
   * Name of the registry, such as "docker.io".
   * @example "docker.io"
   */
  Name?: string;
  /**
   * List of mirrors, expressed as URIs.
   * @example ["https://hub-mirror.corp.example.com:5000/","https://registry-2.docker.io/","https://registry-3.docker.io/"]
   */
  Mirrors?: string[];
  /**
   * Indicates if the registry is part of the list of insecure
   * registries.
   *
   * If `false`, the registry is insecure. Insecure registries accept
   * un-encrypted (HTTP) and/or untrusted (HTTPS with certificates from
   * unknown CAs) communication.
   *
   * > **Warning**: Insecure registries can be useful when running a local
   * > registry. However, because its use creates security vulnerabilities
   * > it should ONLY be enabled for testing purposes. For increased
   * > security, users should add their CA to their system's list of
   * > trusted CAs instead of enabling this option.
   * @example true
   */
  Secure?: boolean;
  /**
   * Indicates whether this is an official registry (i.e., Docker Hub / docker.io)
   * @example true
   */
  Official?: boolean;
} | null;

/**
 * Runtime describes an [OCI compliant](https://github.com/opencontainers/runtime-spec)
 * runtime.
 *
 * The runtime is invoked by the daemon via the `containerd` daemon. OCI
 * runtimes act as an interface to the Linux kernel namespaces, cgroups,
 * and SELinux.
 */
export interface Runtime {
  /**
   * Name and, optional, path, of the OCI executable binary.
   *
   * If the path is omitted, the daemon searches the host's `$PATH` for the
   * binary and uses the first result.
   * @example "/usr/local/bin/my-oci-runtime"
   */
  path?: string;
  /**
   * List of command-line arguments to pass to the runtime when invoked.
   * @example ["--debug","--systemd-cgroup=false"]
   */
  runtimeArgs?: string[] | null;
  /**
   * Information specific to the runtime.
   *
   * While this API specification does not define data provided by runtimes,
   * the following well-known properties may be provided by runtimes:
   *
   * `org.opencontainers.runtime-spec.features`: features structure as defined
   * in the [OCI Runtime Specification](https://github.com/opencontainers/runtime-spec/blob/main/features.md),
   * in a JSON string representation.
   *
   * <p><br /></p>
   *
   * > **Note**: The information returned in this field, including the
   * > formatting of values and labels, should not be considered stable,
   * > and may change without notice.
   * @example {"org.opencontainers.runtime-spec.features":"{\"ociVersionMin\":\"1.0.0\",\"ociVersionMax\":\"1.1.0\",\"...\":\"...\"}"}
   */
  status?: Record<string, string>;
}

/**
 * Commit holds the Git-commit (SHA1) that a binary was built from, as
 * reported in the version-string of external tools, such as `containerd`,
 * or `runC`.
 */
export interface Commit {
  /**
   * Actual commit ID of external tool.
   * @example "cfb82a876ecc11b5ca0977d1733adbe58599088a"
   */
  ID?: string;
  /**
   * Commit ID of external tool expected by dockerd as set at build time.
   * @example "2d41c047c83e09a6d61d464906feb2a2f3c52aa4"
   */
  Expected?: string;
}

/** Represents generic information about swarm. */
export interface SwarmInfo {
  /**
   * Unique identifier of for this node in the swarm.
   * @default ""
   * @example "k67qz4598weg5unwwffg6z1m1"
   */
  NodeID?: string;
  /**
   * IP address at which this node can be reached by other nodes in the
   * swarm.
   * @default ""
   * @example "10.0.0.46"
   */
  NodeAddr?: string;
  /** Current local status of this node. */
  LocalNodeState?: LocalNodeState;
  /**
   * @default false
   * @example true
   */
  ControlAvailable?: boolean;
  /** @default "" */
  Error?: string;
  /**
   * List of ID's and addresses of other managers in the swarm.
   * @default null
   * @example [{"NodeID":"71izy0goik036k48jg985xnds","Addr":"10.0.0.158:2377"},{"NodeID":"79y6h1o4gv8n120drcprv5nmc","Addr":"10.0.0.159:2377"},{"NodeID":"k67qz4598weg5unwwffg6z1m1","Addr":"10.0.0.46:2377"}]
   */
  RemoteManagers?: PeerNode[] | null;
  /**
   * Total number of nodes in the swarm.
   * @example 4
   */
  Nodes?: number | null;
  /**
   * Total number of managers in the swarm.
   * @example 3
   */
  Managers?: number | null;
  /**
   * ClusterInfo represents information about the swarm as is returned by the
   * "/info" endpoint. Join-tokens are not included.
   */
  Cluster?: ClusterInfo;
}

/**
 * Current local status of this node.
 * @default ""
 * @example "active"
 */
export enum LocalNodeState {
  Value = "",
  Inactive = "inactive",
  Pending = "pending",
  Active = "active",
  Error = "error",
  Locked = "locked",
}

/** Represents a peer-node in the swarm */
export interface PeerNode {
  /** Unique identifier of for this node in the swarm. */
  NodeID?: string;
  /** IP address and ports at which this node can be reached. */
  Addr?: string;
}

/** Specifies how a service should be attached to a particular network. */
export interface NetworkAttachmentConfig {
  /** The target network for attachment. Must be a network name or ID. */
  Target?: string;
  /** Discoverable alternate names for the service on this network. */
  Aliases?: string[];
  /** Driver attachment options for the network target. */
  DriverOpts?: Record<string, string>;
}

/**
 * Actor describes something that generates events, like a container, network,
 * or a volume.
 */
export interface EventActor {
  /**
   * The ID of the object emitting the event
   * @example "ede54ee1afda366ab42f824e8a5ffd195155d853ceaec74a927f249ea270c743"
   */
  ID?: string;
  /**
   * Various key/value attributes of the object, depending on its type.
   * @example {"com.example.some-label":"some-label-value","image":"alpine:latest","name":"my-container"}
   */
  Attributes?: Record<string, string>;
}

/**
 * SystemEventsResponse
 * EventMessage represents the information an event contains.
 */
export interface EventMessage {
  /**
   * The type of object emitting the event
   * @example "container"
   */
  Type?:
    | "builder"
    | "config"
    | "container"
    | "daemon"
    | "image"
    | "network"
    | "node"
    | "plugin"
    | "secret"
    | "service"
    | "volume";
  /**
   * The type of event
   * @example "create"
   */
  Action?: string;
  /**
   * Actor describes something that generates events, like a container, network,
   * or a volume.
   */
  Actor?: EventActor;
  /**
   * Scope of the event. Engine events are `local` scope. Cluster (Swarm)
   * events are `swarm` scope.
   */
  scope?: "local" | "swarm";
  /**
   * Timestamp of event
   * @format int64
   * @example 1629574695
   */
  time?: number;
  /**
   * Timestamp of event, with nanosecond accuracy
   * @format int64
   * @example 1629574695515050000
   */
  timeNano?: number;
}

/**
 * A descriptor struct containing digest, media type, and size, as defined in
 * the [OCI Content Descriptors Specification](https://github.com/opencontainers/image-spec/blob/v1.0.1/descriptor.md).
 */
export interface OCIDescriptor {
  /**
   * The media type of the object this schema refers to.
   * @example "application/vnd.docker.distribution.manifest.v2+json"
   */
  mediaType?: string;
  /**
   * The digest of the targeted content.
   * @example "sha256:c0537ff6a5218ef531ece93d4984efc99bbf3f7497c0a7726c88e2bb7584dc96"
   */
  digest?: string;
  /**
   * The size in bytes of the blob.
   * @format int64
   * @example 3987495
   */
  size?: number;
}

/**
 * Describes the platform which the image in the manifest runs on, as defined
 * in the [OCI Image Index Specification](https://github.com/opencontainers/image-spec/blob/v1.0.1/image-index.md).
 */
export interface OCIPlatform {
  /**
   * The CPU architecture, for example `amd64` or `ppc64`.
   * @example "arm"
   */
  architecture?: string;
  /**
   * The operating system, for example `linux` or `windows`.
   * @example "windows"
   */
  os?: string;
  /**
   * Optional field specifying the operating system version, for example on
   * Windows `10.0.19041.1165`.
   * @example "10.0.19041.1165"
   */
  "os.version"?: string;
  /**
   * Optional field specifying an array of strings, each listing a required
   * OS feature (for example on Windows `win32k`).
   * @example ["win32k"]
   */
  "os.features"?: string[];
  /**
   * Optional field specifying a variant of the CPU, for example `v7` to
   * specify ARMv7 when architecture is `arm`.
   * @example "v7"
   */
  variant?: string;
}

/**
 * DistributionInspectResponse
 * Describes the result obtained from contacting the registry to retrieve
 * image metadata.
 */
export interface DistributionInspect {
  /**
   * A descriptor struct containing digest, media type, and size, as defined in
   * the [OCI Content Descriptors Specification](https://github.com/opencontainers/image-spec/blob/v1.0.1/descriptor.md).
   */
  Descriptor: OCIDescriptor;
  /** An array containing all platforms supported by the image. */
  Platforms: OCIPlatform[];
}

/**
 * Options and information specific to, and only present on, Swarm CSI
 * cluster volumes.
 */
export interface ClusterVolume {
  /**
   * The Swarm ID of this volume. Because cluster volumes are Swarm
   * objects, they have an ID, unlike non-cluster volumes. This ID can
   * be used to refer to the Volume instead of the name.
   */
  ID?: string;
  /**
   * The version number of the object such as node, service, etc. This is needed
   * to avoid conflicting writes. The client must send the version number along
   * with the modified specification when updating these objects.
   *
   * This approach ensures safe concurrency and determinism in that the change
   * on the object may not be applied if the version number has changed from the
   * last read. In other words, if two update requests specify the same base
   * version, only one of the requests can succeed. As a result, two separate
   * update requests that happen at the same time will not unintentionally
   * overwrite each other.
   */
  Version?: ObjectVersion;
  /** @format dateTime */
  CreatedAt?: string;
  /** @format dateTime */
  UpdatedAt?: string;
  /** Cluster-specific options used to create the volume. */
  Spec?: ClusterVolumeSpec;
  /** Information about the global status of the volume. */
  Info?: {
    /**
     * The capacity of the volume in bytes. A value of 0 indicates that
     * the capacity is unknown.
     * @format int64
     */
    CapacityBytes?: number;
    /**
     * A map of strings to strings returned from the storage plugin when
     * the volume is created.
     */
    VolumeContext?: Record<string, string>;
    /**
     * The ID of the volume as returned by the CSI storage plugin. This
     * is distinct from the volume's ID as provided by Docker. This ID
     * is never used by the user when communicating with Docker to refer
     * to this volume. If the ID is blank, then the Volume has not been
     * successfully created in the plugin yet.
     */
    VolumeID?: string;
    /** The topology this volume is actually accessible from. */
    AccessibleTopology?: Topology[];
  };
  /**
   * The status of the volume as it pertains to its publishing and use on
   * specific nodes
   */
  PublishStatus?: {
    /** The ID of the Swarm node the volume is published on. */
    NodeID?: string;
    /**
     * The published state of the volume.
     * * `pending-publish` The volume should be published to this node, but the call to the controller plugin to do so has not yet been successfully completed.
     * * `published` The volume is published successfully to the node.
     * * `pending-node-unpublish` The volume should be unpublished from the node, and the manager is awaiting confirmation from the worker that it has done so.
     * * `pending-controller-unpublish` The volume is successfully unpublished from the node, but has not yet been successfully unpublished on the controller.
     */
    State?: "pending-publish" | "published" | "pending-node-unpublish" | "pending-controller-unpublish";
    /**
     * A map of strings to strings returned by the CSI controller
     * plugin when a volume is published.
     */
    PublishContext?: Record<string, string>;
  }[];
}

/** Cluster-specific options used to create the volume. */
export interface ClusterVolumeSpec {
  /**
   * Group defines the volume group of this volume. Volumes belonging to
   * the same group can be referred to by group name when creating
   * Services.  Referring to a volume by group instructs Swarm to treat
   * volumes in that group interchangeably for the purpose of scheduling.
   * Volumes with an empty string for a group technically all belong to
   * the same, emptystring group.
   */
  Group?: string;
  /** Defines how the volume is used by tasks. */
  AccessMode?: {
    /**
     * The set of nodes this volume can be used on at one time.
     * - `single` The volume may only be scheduled to one node at a time.
     * - `multi` the volume may be scheduled to any supported number of nodes at a time.
     * @default "single"
     */
    Scope: "single" | "multi";
    /**
     * The number and way that different tasks can use this volume
     * at one time.
     * - `none` The volume may only be used by one task at a time.
     * - `readonly` The volume may be used by any number of tasks, but they all must mount the volume as readonly
     * - `onewriter` The volume may be used by any number of tasks, but only one may mount it as read/write.
     * - `all` The volume may have any number of readers and writers.
     * @default "none"
     */
    Sharing: "none" | "readonly" | "onewriter" | "all";
    /**
     * Options for using this volume as a Mount-type volume.
     *
     *     Either MountVolume or BlockVolume, but not both, must be
     *     present.
     *   properties:
     *     FsType:
     *       type: "string"
     *       description: |
     *         Specifies the filesystem type for the mount volume.
     *         Optional.
     *     MountFlags:
     *       type: "array"
     *       description: |
     *         Flags to pass when mounting the volume. Optional.
     *       items:
     *         type: "string"
     * BlockVolume:
     *   type: "object"
     *   description: |
     *     Options for using this volume as a Block-type volume.
     *     Intentionally empty.
     */
    MountVolume?: object;
    /**
     * Swarm Secrets that are passed to the CSI storage plugin when
     * operating on this volume.
     */
    Secrets?: {
      /**
       * Key is the name of the key of the key-value pair passed to
       * the plugin.
       */
      Key?: string;
      /**
       * Secret is the swarm Secret object from which to read data.
       * This can be a Secret name or ID. The Secret data is
       * retrieved by swarm and used as the value of the key-value
       * pair passed to the plugin.
       */
      Secret?: string;
    }[];
    /**
     * Requirements for the accessible topology of the volume. These
     * fields are optional. For an in-depth description of what these
     * fields mean, see the CSI specification.
     */
    AccessibilityRequirements?: {
      /**
       * A list of required topologies, at least one of which the
       * volume must be accessible from.
       */
      Requisite?: Topology[];
      /**
       * A list of topologies that the volume should attempt to be
       * provisioned in.
       */
      Preferred?: Topology[];
    };
    /**
     * The desired capacity that the volume should be created with. If
     * empty, the plugin will decide the capacity.
     */
    CapacityRange?: {
      /**
       * The volume must be at least this big. The value of 0
       * indicates an unspecified minimum
       * @format int64
       */
      RequiredBytes?: number;
      /**
       * The volume must not be bigger than this. The value of 0
       * indicates an unspecified maximum.
       * @format int64
       */
      LimitBytes?: number;
    };
    /**
     * The availability of the volume for use in tasks.
     * - `active` The volume is fully available for scheduling on the cluster
     * - `pause` No new workloads should use the volume, but existing workloads are not stopped.
     * - `drain` All workloads using this volume should be stopped and rescheduled, and no new ones should be started.
     * @default "active"
     */
    Availability: "active" | "pause" | "drain";
  };
}

/**
 * A map of topological domains to topological segments. For in depth
 * details, see documentation for the Topology object in the CSI
 * specification.
 */
export type Topology = Record<string, string>;

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (securityData: SecurityDataType | null) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "/v1.45";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) => fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter((key) => "undefined" !== typeof query[key]);
    return keys
      .map((key) => (Array.isArray(query[key]) ? this.addArrayQueryParam(query, key) : this.addQueryParam(query, key)))
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string") ? JSON.stringify(input) : input,
    [ContentType.Text]: (input: any) => (input !== null && typeof input !== "string" ? JSON.stringify(input) : input),
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
              ? JSON.stringify(property)
              : `${property}`,
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (cancelToken: CancelToken): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(`${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`, {
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type && type !== ContentType.FormData ? { "Content-Type": type } : {}),
      },
      signal: (cancelToken ? this.createAbortSignal(cancelToken) : requestParams.signal) || null,
      body: typeof body === "undefined" || body === null ? null : payloadFormatter(body),
    }).then(async (response) => {
      const r = response.clone() as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title Docker Engine API
 * @version 1.45
 * @baseUrl /v1.45
 *
 * The Engine API is an HTTP API served by Docker Engine. It is the API the
 * Docker client uses to communicate with the Engine, so everything the Docker
 * client can do can be done with the API.
 *
 * Most of the client's commands map directly to API endpoints (e.g. `docker ps`
 * is `GET /containers/json`). The notable exception is running containers,
 * which consists of several API calls.
 *
 * # Errors
 *
 * The API uses standard HTTP status codes to indicate the success or failure
 * of the API call. The body of the response will be JSON in the following
 * format:
 *
 * ```
 * {
 *   "message": "page not found"
 * }
 * ```
 *
 * # Versioning
 *
 * The API is usually changed in each release, so API calls are versioned to
 * ensure that clients don't break. To lock to a specific version of the API,
 * you prefix the URL with its version, for example, call `/v1.30/info` to use
 * the v1.30 version of the `/info` endpoint. If the API version specified in
 * the URL is not supported by the daemon, a HTTP `400 Bad Request` error message
 * is returned.
 *
 * If you omit the version-prefix, the current version of the API (v1.45) is used.
 * For example, calling `/info` is the same as calling `/v1.45/info`. Using the
 * API without a version-prefix is deprecated and will be removed in a future release.
 *
 * Engine releases in the near future should support this version of the API,
 * so your client will continue to work even if it is talking to a newer Engine.
 *
 * The API uses an open schema model, which means server may add extra properties
 * to responses. Likewise, the server will ignore any extra query parameters and
 * request body properties. When you write clients, you need to ignore additional
 * properties in responses to ensure they do not break when talking to newer
 * daemons.
 *
 *
 * # Authentication
 *
 * Authentication for registries is handled client side. The client has to send
 * authentication details to various endpoints that need to communicate with
 * registries, such as `POST /images/(name)/push`. These are sent as
 * `X-Registry-Auth` header as a [base64url encoded](https://tools.ietf.org/html/rfc4648#section-5)
 * (JSON) string with the following structure:
 *
 * ```
 * {
 *   "username": "string",
 *   "password": "string",
 *   "email": "string",
 *   "serveraddress": "string"
 * }
 * ```
 *
 * The `serveraddress` is a domain/IP without a protocol. Throughout this
 * structure, double quotes are required.
 *
 * If you have already got an identity token from the [`/auth` endpoint](#operation/SystemAuth),
 * you can just pass this instead of credentials:
 *
 * ```
 * {
 *   "identitytoken": "9cbaf023786cd7..."
 * }
 * ```
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  containers = {
    /**
     * @description Returns a list of containers. For details on the format, see the [inspect endpoint](#operation/ContainerInspect). Note that it uses a different, smaller representation of a container than inspecting a single container. For example, the list of linked containers is not propagated .
     *
     * @tags Container
     * @name ContainerList
     * @summary List containers
     * @request GET:/containers/json
     */
    containerList: (
      query?: {
        /**
         * Return all containers. By default, only running containers are shown.
         * @default false
         */
        all?: boolean;
        /**
         * Return this number of most recently created containers, including
         * non-running ones.
         */
        limit?: number;
        /**
         * Return the size of container as fields `SizeRw` and `SizeRootFs`.
         * @default false
         */
        size?: boolean;
        /**
         * Filters to process on the container list, encoded as JSON (a
         * `map[string][]string`). For example, `{"status": ["paused"]}` will
         * only return paused containers.
         *
         * Available filters:
         *
         * - `ancestor`=(`<image-name>[:<tag>]`, `<image id>`, or `<image@digest>`)
         * - `before`=(`<container id>` or `<container name>`)
         * - `expose`=(`<port>[/<proto>]`|`<startport-endport>/[<proto>]`)
         * - `exited=<int>` containers with exit code of `<int>`
         * - `health`=(`starting`|`healthy`|`unhealthy`|`none`)
         * - `id=<ID>` a container's ID
         * - `isolation=`(`default`|`process`|`hyperv`) (Windows daemon only)
         * - `is-task=`(`true`|`false`)
         * - `label=key` or `label="key=value"` of a container label
         * - `name=<name>` a container's name
         * - `network`=(`<network id>` or `<network name>`)
         * - `publish`=(`<port>[/<proto>]`|`<startport-endport>/[<proto>]`)
         * - `since`=(`<container id>` or `<container name>`)
         * - `status=`(`created`|`restarting`|`running`|`removing`|`paused`|`exited`|`dead`)
         * - `volume`=(`<volume name>` or `<mount point destination>`)
         */
        filters?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<ContainerSummary[], ErrorResponse>({
        path: `/containers/json`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Container
     * @name ContainerCreate
     * @summary Create a container
     * @request POST:/containers/create
     */
    containerCreate: (
      body: ContainerConfig & {
        /** Container configuration that depends on the host we are running on */
        HostConfig?: HostConfig;
        /**
         * NetworkingConfig represents the container's networking configuration for
         * each of its interfaces.
         * It is used for the networking configs specified in the `docker create`
         * and `docker network connect` commands.
         */
        NetworkingConfig?: NetworkingConfig;
      },
      query?: {
        /**
         * Assign the specified name to the container. Must match
         * `/?[a-zA-Z0-9][a-zA-Z0-9_.-]+`.
         * @pattern ^/?[a-zA-Z0-9][a-zA-Z0-9_.-]+$
         */
        name?: string;
        /**
         * Platform in the format `os[/arch[/variant]]` used for image lookup.
         *
         * When specified, the daemon checks if the requested image is present
         * in the local image cache with the given OS and Architecture, and
         * otherwise returns a `404` status.
         *
         * If the option is not set, the host's native OS and Architecture are
         * used to look up the image in the image cache. However, if no platform
         * is passed and the given image does exist in the local image cache,
         * but its OS or architecture does not match, the container is created
         * with the available image, and a warning is added to the `Warnings`
         * field in the response, for example;
         *
         *     WARNING: The requested image's platform (linux/arm64/v8) does not
         *              match the detected host platform (linux/amd64) and no
         *              specific platform was requested
         * @default ""
         */
        platform?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<ContainerCreateResponse, ErrorResponse>({
        path: `/containers/create`,
        method: "POST",
        query: query,
        body: body,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Return low-level information about a container.
     *
     * @tags Container
     * @name ContainerInspect
     * @summary Inspect a container
     * @request GET:/containers/{id}/json
     */
    containerInspect: (
      id: string,
      query?: {
        /**
         * Return the size of container as fields `SizeRw` and `SizeRootFs`
         * @default false
         */
        size?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /** The ID of the container */
          Id?: string;
          /** The time the container was created */
          Created?: string;
          /** The path to the command being run */
          Path?: string;
          /** The arguments to the command being run */
          Args?: string[];
          /**
           * ContainerState stores container's running state. It's part of ContainerJSONBase
           * and will be returned by the "inspect" command.
           */
          State?: ContainerState;
          /** The container's image ID */
          Image?: string;
          ResolvConfPath?: string;
          HostnamePath?: string;
          HostsPath?: string;
          LogPath?: string;
          Name?: string;
          RestartCount?: number;
          Driver?: string;
          Platform?: string;
          MountLabel?: string;
          ProcessLabel?: string;
          AppArmorProfile?: string;
          /** IDs of exec instances that are running in the container. */
          ExecIDs?: string[] | null;
          /** Container configuration that depends on the host we are running on */
          HostConfig?: HostConfig;
          /**
           * Information about the storage driver used to store the container's and
           * image's filesystem.
           */
          GraphDriver?: GraphDriverData;
          /**
           * The size of files that have been created or changed by this
           * container.
           * @format int64
           */
          SizeRw?: number;
          /**
           * The total size of all the files in this container.
           * @format int64
           */
          SizeRootFs?: number;
          Mounts?: MountPoint[];
          /**
           * Configuration for a container that is portable between hosts.
           *
           * When used as `ContainerConfig` field in an image, `ContainerConfig` is an
           * optional field containing the configuration of the container that was last
           * committed when creating the image.
           *
           * Previous versions of Docker builder used this field to store build cache,
           * and it is not in active use anymore.
           */
          Config?: ContainerConfig;
          /** NetworkSettings exposes the network settings in the API */
          NetworkSettings?: NetworkSettings;
        },
        ErrorResponse
      >({
        path: `/containers/${id}/json`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description On Unix systems, this is done by running the `ps` command. This endpoint is not supported on Windows.
     *
     * @tags Container
     * @name ContainerTop
     * @summary List processes running inside a container
     * @request GET:/containers/{id}/top
     */
    containerTop: (
      id: string,
      query?: {
        /**
         * The arguments to pass to `ps`. For example, `aux`
         * @default "-ef"
         */
        ps_args?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /** The ps column titles */
          Titles?: string[];
          /**
           * Each process running in the container, where each is process
           * is an array of values corresponding to the titles.
           */
          Processes?: string[][];
        },
        ErrorResponse
      >({
        path: `/containers/${id}/top`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Get `stdout` and `stderr` logs from a container. Note: This endpoint works only for containers with the `json-file` or `journald` logging driver.
     *
     * @tags Container
     * @name ContainerLogs
     * @summary Get container logs
     * @request GET:/containers/{id}/logs
     */
    containerLogs: (
      id: string,
      query?: {
        /**
         * Keep connection after returning logs.
         * @default false
         */
        follow?: boolean;
        /**
         * Return logs from `stdout`
         * @default false
         */
        stdout?: boolean;
        /**
         * Return logs from `stderr`
         * @default false
         */
        stderr?: boolean;
        /**
         * Only return logs since this time, as a UNIX timestamp
         * @default 0
         */
        since?: number;
        /**
         * Only return logs before this time, as a UNIX timestamp
         * @default 0
         */
        until?: number;
        /**
         * Add timestamps to every log line
         * @default false
         */
        timestamps?: boolean;
        /**
         * Only return this number of log lines from the end of the logs.
         * Specify as an integer or `all` to output all log lines.
         * @default "all"
         */
        tail?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<File, ErrorResponse>({
        path: `/containers/${id}/logs`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * @description Returns which files in a container's filesystem have been added, deleted, or modified. The `Kind` of modification can be one of: - `0`: Modified ("C") - `1`: Added ("A") - `2`: Deleted ("D")
     *
     * @tags Container
     * @name ContainerChanges
     * @summary Get changes on a container’s filesystem
     * @request GET:/containers/{id}/changes
     */
    containerChanges: (id: string, params: RequestParams = {}) =>
      this.request<FilesystemChange[], ErrorResponse>({
        path: `/containers/${id}/changes`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Export the contents of a container as a tarball.
     *
     * @tags Container
     * @name ContainerExport
     * @summary Export a container
     * @request GET:/containers/{id}/export
     */
    containerExport: (id: string, params: RequestParams = {}) =>
      this.request<void, ErrorResponse>({
        path: `/containers/${id}/export`,
        method: "GET",
        ...params,
      }),

    /**
     * @description This endpoint returns a live stream of a container’s resource usage statistics. The `precpu_stats` is the CPU statistic of the *previous* read, and is used to calculate the CPU usage percentage. It is not an exact copy of the `cpu_stats` field. If either `precpu_stats.online_cpus` or `cpu_stats.online_cpus` is nil then for compatibility with older daemons the length of the corresponding `cpu_usage.percpu_usage` array should be used. On a cgroup v2 host, the following fields are not set * `blkio_stats`: all fields other than `io_service_bytes_recursive` * `cpu_stats`: `cpu_usage.percpu_usage` * `memory_stats`: `max_usage` and `failcnt` Also, `memory_stats.stats` fields are incompatible with cgroup v1. To calculate the values shown by the `stats` command of the docker cli tool the following formulas can be used: * used_memory = `memory_stats.usage - memory_stats.stats.cache` * available_memory = `memory_stats.limit` * Memory usage % = `(used_memory / available_memory) * 100.0` * cpu_delta = `cpu_stats.cpu_usage.total_usage - precpu_stats.cpu_usage.total_usage` * system_cpu_delta = `cpu_stats.system_cpu_usage - precpu_stats.system_cpu_usage` * number_cpus = `lenght(cpu_stats.cpu_usage.percpu_usage)` or `cpu_stats.online_cpus` * CPU usage % = `(cpu_delta / system_cpu_delta) * number_cpus * 100.0`
     *
     * @tags Container
     * @name ContainerStats
     * @summary Get container stats based on resource usage
     * @request GET:/containers/{id}/stats
     */
    containerStats: (
      id: string,
      query?: {
        /**
         * Stream the output. If false, the stats will be output once and then
         * it will disconnect.
         * @default true
         */
        stream?: boolean;
        /**
         * Only get a single stat instead of waiting for 2 cycles. Must be used
         * with `stream=false`.
         * @default false
         */
        "one-shot"?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<object, ErrorResponse>({
        path: `/containers/${id}/stats`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Resize the TTY for a container.
     *
     * @tags Container
     * @name ContainerResize
     * @summary Resize a container TTY
     * @request POST:/containers/{id}/resize
     */
    containerResize: (
      id: string,
      query?: {
        /** Height of the TTY session in characters */
        h?: number;
        /** Width of the TTY session in characters */
        w?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, ErrorResponse>({
        path: `/containers/${id}/resize`,
        method: "POST",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Container
     * @name ContainerStart
     * @summary Start a container
     * @request POST:/containers/{id}/start
     */
    containerStart: (
      id: string,
      query?: {
        /**
         * Override the key sequence for detaching a container. Format is a
         * single character `[a-Z]` or `ctrl-<value>` where `<value>` is one
         * of: `a-z`, `@`, `^`, `[`, `,` or `_`.
         */
        detachKeys?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, void | ErrorResponse>({
        path: `/containers/${id}/start`,
        method: "POST",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Container
     * @name ContainerStop
     * @summary Stop a container
     * @request POST:/containers/{id}/stop
     */
    containerStop: (
      id: string,
      query?: {
        /** Signal to send to the container as an integer or string (e.g. `SIGINT`). */
        signal?: string;
        /** Number of seconds to wait before killing the container */
        t?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, void | ErrorResponse>({
        path: `/containers/${id}/stop`,
        method: "POST",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Container
     * @name ContainerRestart
     * @summary Restart a container
     * @request POST:/containers/{id}/restart
     */
    containerRestart: (
      id: string,
      query?: {
        /** Signal to send to the container as an integer or string (e.g. `SIGINT`). */
        signal?: string;
        /** Number of seconds to wait before killing the container */
        t?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, ErrorResponse>({
        path: `/containers/${id}/restart`,
        method: "POST",
        query: query,
        ...params,
      }),

    /**
     * @description Send a POSIX signal to a container, defaulting to killing to the container.
     *
     * @tags Container
     * @name ContainerKill
     * @summary Kill a container
     * @request POST:/containers/{id}/kill
     */
    containerKill: (
      id: string,
      query?: {
        /**
         * Signal to send to the container as an integer or string (e.g. `SIGINT`).
         * @default "SIGKILL"
         */
        signal?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, ErrorResponse>({
        path: `/containers/${id}/kill`,
        method: "POST",
        query: query,
        ...params,
      }),

    /**
     * @description Change various configuration options of a container without having to recreate it.
     *
     * @tags Container
     * @name ContainerUpdate
     * @summary Update a container
     * @request POST:/containers/{id}/update
     */
    containerUpdate: (
      id: string,
      update: Resources & {
        /**
         * The behavior to apply when the container exits. The default is not to
         * restart.
         *
         * An ever increasing delay (double the previous delay, starting at 100ms) is
         * added before each restart to prevent flooding the server.
         */
        RestartPolicy?: RestartPolicy;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          Warnings?: string[];
        },
        ErrorResponse
      >({
        path: `/containers/${id}/update`,
        method: "POST",
        body: update,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Container
     * @name ContainerRename
     * @summary Rename a container
     * @request POST:/containers/{id}/rename
     */
    containerRename: (
      id: string,
      query: {
        /** New name for the container */
        name: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, ErrorResponse>({
        path: `/containers/${id}/rename`,
        method: "POST",
        query: query,
        ...params,
      }),

    /**
     * @description Use the freezer cgroup to suspend all processes in a container. Traditionally, when suspending a process the `SIGSTOP` signal is used, which is observable by the process being suspended. With the freezer cgroup the process is unaware, and unable to capture, that it is being suspended, and subsequently resumed.
     *
     * @tags Container
     * @name ContainerPause
     * @summary Pause a container
     * @request POST:/containers/{id}/pause
     */
    containerPause: (id: string, params: RequestParams = {}) =>
      this.request<void, ErrorResponse>({
        path: `/containers/${id}/pause`,
        method: "POST",
        ...params,
      }),

    /**
     * @description Resume a container which has been paused.
     *
     * @tags Container
     * @name ContainerUnpause
     * @summary Unpause a container
     * @request POST:/containers/{id}/unpause
     */
    containerUnpause: (id: string, params: RequestParams = {}) =>
      this.request<void, ErrorResponse>({
        path: `/containers/${id}/unpause`,
        method: "POST",
        ...params,
      }),

    /**
     * @description Attach to a container to read its output or send it input. You can attach to the same container multiple times and you can reattach to containers that have been detached. Either the `stream` or `logs` parameter must be `true` for this endpoint to do anything. See the [documentation for the `docker attach` command](https://docs.docker.com/engine/reference/commandline/attach/) for more details. ### Hijacking This endpoint hijacks the HTTP connection to transport `stdin`, `stdout`, and `stderr` on the same socket. This is the response from the daemon for an attach request: ``` HTTP/1.1 200 OK Content-Type: application/vnd.docker.raw-stream [STREAM] ``` After the headers and two new lines, the TCP connection can now be used for raw, bidirectional communication between the client and server. To hint potential proxies about connection hijacking, the Docker client can also optionally send connection upgrade headers. For example, the client sends this request to upgrade the connection: ``` POST /containers/16253994b7c4/attach?stream=1&stdout=1 HTTP/1.1 Upgrade: tcp Connection: Upgrade ``` The Docker daemon will respond with a `101 UPGRADED` response, and will similarly follow with the raw stream: ``` HTTP/1.1 101 UPGRADED Content-Type: application/vnd.docker.raw-stream Connection: Upgrade Upgrade: tcp [STREAM] ``` ### Stream format When the TTY setting is disabled in [`POST /containers/create`](#operation/ContainerCreate), the HTTP Content-Type header is set to application/vnd.docker.multiplexed-stream and the stream over the hijacked connected is multiplexed to separate out `stdout` and `stderr`. The stream consists of a series of frames, each containing a header and a payload. The header contains the information which the stream writes (`stdout` or `stderr`). It also contains the size of the associated frame encoded in the last four bytes (`uint32`). It is encoded on the first eight bytes like this: ```go header := [8]byte{STREAM_TYPE, 0, 0, 0, SIZE1, SIZE2, SIZE3, SIZE4} ``` `STREAM_TYPE` can be: - 0: `stdin` (is written on `stdout`) - 1: `stdout` - 2: `stderr` `SIZE1, SIZE2, SIZE3, SIZE4` are the four bytes of the `uint32` size encoded as big endian. Following the header is the payload, which is the specified number of bytes of `STREAM_TYPE`. The simplest way to implement this protocol is the following: 1. Read 8 bytes. 2. Choose `stdout` or `stderr` depending on the first byte. 3. Extract the frame size from the last four bytes. 4. Read the extracted size and output it on the correct output. 5. Goto 1. ### Stream format when using a TTY When the TTY setting is enabled in [`POST /containers/create`](#operation/ContainerCreate), the stream is not multiplexed. The data exchanged over the hijacked connection is simply the raw data from the process PTY and client's `stdin`.
     *
     * @tags Container
     * @name ContainerAttach
     * @summary Attach to a container
     * @request POST:/containers/{id}/attach
     */
    containerAttach: (
      id: string,
      query?: {
        /**
         * Override the key sequence for detaching a container.Format is a single
         * character `[a-Z]` or `ctrl-<value>` where `<value>` is one of: `a-z`,
         * `@`, `^`, `[`, `,` or `_`.
         */
        detachKeys?: string;
        /**
         * Replay previous logs from the container.
         *
         * This is useful for attaching to a container that has started and you
         * want to output everything since the container started.
         *
         * If `stream` is also enabled, once all the previous output has been
         * returned, it will seamlessly transition into streaming current
         * output.
         * @default false
         */
        logs?: boolean;
        /**
         * Stream attached streams from the time the request was made onwards.
         * @default false
         */
        stream?: boolean;
        /**
         * Attach to `stdin`
         * @default false
         */
        stdin?: boolean;
        /**
         * Attach to `stdout`
         * @default false
         */
        stdout?: boolean;
        /**
         * Attach to `stderr`
         * @default false
         */
        stderr?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, void | ErrorResponse>({
        path: `/containers/${id}/attach`,
        method: "POST",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Container
     * @name ContainerAttachWebsocket
     * @summary Attach to a container via a websocket
     * @request GET:/containers/{id}/attach/ws
     */
    containerAttachWebsocket: (
      id: string,
      query?: {
        /**
         * Override the key sequence for detaching a container.Format is a single
         * character `[a-Z]` or `ctrl-<value>` where `<value>` is one of: `a-z`,
         * `@`, `^`, `[`, `,`, or `_`.
         */
        detachKeys?: string;
        /**
         * Return logs
         * @default false
         */
        logs?: boolean;
        /**
         * Return stream
         * @default false
         */
        stream?: boolean;
        /**
         * Attach to `stdin`
         * @default false
         */
        stdin?: boolean;
        /**
         * Attach to `stdout`
         * @default false
         */
        stdout?: boolean;
        /**
         * Attach to `stderr`
         * @default false
         */
        stderr?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, void | ErrorResponse>({
        path: `/containers/${id}/attach/ws`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * @description Block until a container stops, then returns the exit code.
     *
     * @tags Container
     * @name ContainerWait
     * @summary Wait for a container
     * @request POST:/containers/{id}/wait
     */
    containerWait: (
      id: string,
      query?: {
        /**
         * Wait until a container state reaches the given condition.
         *
         * Defaults to `not-running` if omitted or empty.
         * @default "not-running"
         */
        condition?: "not-running" | "next-exit" | "removed";
      },
      params: RequestParams = {},
    ) =>
      this.request<ContainerWaitResponse, ErrorResponse>({
        path: `/containers/${id}/wait`,
        method: "POST",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Container
     * @name ContainerDelete
     * @summary Remove a container
     * @request DELETE:/containers/{id}
     */
    containerDelete: (
      id: string,
      query?: {
        /**
         * Remove anonymous volumes associated with the container.
         * @default false
         */
        v?: boolean;
        /**
         * If the container is running, kill it before removing it.
         * @default false
         */
        force?: boolean;
        /**
         * Remove the specified link associated with the container.
         * @default false
         */
        link?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, ErrorResponse>({
        path: `/containers/${id}`,
        method: "DELETE",
        query: query,
        ...params,
      }),

    /**
     * @description A response header `X-Docker-Container-Path-Stat` is returned, containing a base64 - encoded JSON object with some filesystem header information about the path.
     *
     * @tags Container
     * @name ContainerArchiveInfo
     * @summary Get information about files in a container
     * @request HEAD:/containers/{id}/archive
     */
    containerArchiveInfo: (
      id: string,
      query: {
        /** Resource in the container’s filesystem to archive. */
        path: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, ErrorResponse>({
        path: `/containers/${id}/archive`,
        method: "HEAD",
        query: query,
        ...params,
      }),

    /**
     * @description Get a tar archive of a resource in the filesystem of container id.
     *
     * @tags Container
     * @name ContainerArchive
     * @summary Get an archive of a filesystem resource in a container
     * @request GET:/containers/{id}/archive
     */
    containerArchive: (
      id: string,
      query: {
        /** Resource in the container’s filesystem to archive. */
        path: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, ErrorResponse>({
        path: `/containers/${id}/archive`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * @description Upload a tar archive to be extracted to a path in the filesystem of container id. `path` parameter is asserted to be a directory. If it exists as a file, 400 error will be returned with message "not a directory".
     *
     * @tags Container
     * @name PutContainerArchive
     * @summary Extract an archive of files or folders to a directory in a container
     * @request PUT:/containers/{id}/archive
     */
    putContainerArchive: (
      id: string,
      query: {
        /** Path to a directory in the container to extract the archive’s contents into.  */
        path: string;
        /**
         * If `1`, `true`, or `True` then it will be an error if unpacking the
         * given content would cause an existing directory to be replaced with
         * a non-directory and vice versa.
         */
        noOverwriteDirNonDir?: string;
        /**
         * If `1`, `true`, then it will copy UID/GID maps to the dest file or
         * dir
         */
        copyUIDGID?: string;
      },
      inputStream: File,
      params: RequestParams = {},
    ) =>
      this.request<void, ErrorResponse>({
        path: `/containers/${id}/archive`,
        method: "PUT",
        query: query,
        body: inputStream,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Container
     * @name ContainerPrune
     * @summary Delete stopped containers
     * @request POST:/containers/prune
     */
    containerPrune: (
      query?: {
        /**
         * Filters to process on the prune list, encoded as JSON (a `map[string][]string`).
         *
         * Available filters:
         * - `until=<timestamp>` Prune containers created before this timestamp. The `<timestamp>` can be Unix timestamps, date formatted timestamps, or Go duration strings (e.g. `10m`, `1h30m`) computed relative to the daemon machine’s time.
         * - `label` (`label=<key>`, `label=<key>=<value>`, `label!=<key>`, or `label!=<key>=<value>`) Prune containers with (or without, in case `label!=...` is used) the specified labels.
         */
        filters?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /** Container IDs that were deleted */
          ContainersDeleted?: string[];
          /**
           * Disk space reclaimed in bytes
           * @format int64
           */
          SpaceReclaimed?: number;
        },
        ErrorResponse
      >({
        path: `/containers/prune`,
        method: "POST",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Run a command inside a running container.
     *
     * @tags Exec
     * @name ContainerExec
     * @summary Create an exec instance
     * @request POST:/containers/{id}/exec
     */
    containerExec: (
      id: string,
      execConfig: {
        /** Attach to `stdin` of the exec command. */
        AttachStdin?: boolean;
        /** Attach to `stdout` of the exec command. */
        AttachStdout?: boolean;
        /** Attach to `stderr` of the exec command. */
        AttachStderr?: boolean;
        /**
         * Initial console size, as an `[height, width]` array.
         * @maxItems 2
         * @minItems 2
         */
        ConsoleSize?: number[] | null;
        /**
         * Override the key sequence for detaching a container. Format is
         * a single character `[a-Z]` or `ctrl-<value>` where `<value>`
         * is one of: `a-z`, `@`, `^`, `[`, `,` or `_`.
         */
        DetachKeys?: string;
        /** Allocate a pseudo-TTY. */
        Tty?: boolean;
        /** A list of environment variables in the form `["VAR=value", ...]`. */
        Env?: string[];
        /** Command to run, as a string or array of strings. */
        Cmd?: string[];
        /**
         * Runs the exec process with extended privileges.
         * @default false
         */
        Privileged?: boolean;
        /**
         * The user, and optionally, group to run the exec process inside
         * the container. Format is one of: `user`, `user:group`, `uid`,
         * or `uid:gid`.
         */
        User?: string;
        /** The working directory for the exec process inside the container. */
        WorkingDir?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<IdResponse, ErrorResponse>({
        path: `/containers/${id}/exec`,
        method: "POST",
        body: execConfig,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  images = {
    /**
     * @description Returns a list of images on the server. Note that it uses a different, smaller representation of an image than inspecting a single image.
     *
     * @tags Image
     * @name ImageList
     * @summary List Images
     * @request GET:/images/json
     */
    imageList: (
      query?: {
        /**
         * Show all images. Only images from a final layer (no children) are shown by default.
         * @default false
         */
        all?: boolean;
        /**
         * A JSON encoded value of the filters (a `map[string][]string`) to
         * process on the images list.
         *
         * Available filters:
         *
         * - `before`=(`<image-name>[:<tag>]`,  `<image id>` or `<image@digest>`)
         * - `dangling=true`
         * - `label=key` or `label="key=value"` of an image label
         * - `reference`=(`<image-name>[:<tag>]`)
         * - `since`=(`<image-name>[:<tag>]`,  `<image id>` or `<image@digest>`)
         * - `until=<timestamp>`
         */
        filters?: string;
        /**
         * Compute and show shared size as a `SharedSize` field on each image.
         * @default false
         */
        "shared-size"?: boolean;
        /**
         * Show digest information as a `RepoDigests` field on each image.
         * @default false
         */
        digests?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<ImageSummary[], ErrorResponse>({
        path: `/images/json`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Pull or import an image.
     *
     * @tags Image
     * @name ImageCreate
     * @summary Create an image
     * @request POST:/images/create
     */
    imageCreate: (
      inputImage: string,
      query?: {
        /** Name of the image to pull. The name may include a tag or digest. This parameter may only be used when pulling an image. The pull is cancelled if the HTTP connection is closed. */
        fromImage?: string;
        /** Source to import. The value may be a URL from which the image can be retrieved or `-` to read the image from the request body. This parameter may only be used when importing an image. */
        fromSrc?: string;
        /** Repository name given to an image when it is imported. The repo may include a tag. This parameter may only be used when importing an image. */
        repo?: string;
        /** Tag or digest. If empty when pulling an image, this causes all tags for the given image to be pulled. */
        tag?: string;
        /** Set commit message for imported image. */
        message?: string;
        /**
         * Apply `Dockerfile` instructions to the image that is created,
         * for example: `changes=ENV DEBUG=true`.
         * Note that `ENV DEBUG=true` should be URI component encoded.
         *
         * Supported `Dockerfile` instructions:
         * `CMD`|`ENTRYPOINT`|`ENV`|`EXPOSE`|`ONBUILD`|`USER`|`VOLUME`|`WORKDIR`
         */
        changes?: string[];
        /**
         * Platform in the format os[/arch[/variant]].
         *
         * When used in combination with the `fromImage` option, the daemon checks
         * if the given image is present in the local image cache with the given
         * OS and Architecture, and otherwise attempts to pull the image. If the
         * option is not set, the host's native OS and Architecture are used.
         * If the given image does not exist in the local image cache, the daemon
         * attempts to pull the image with the host's native OS and Architecture.
         * If the given image does exists in the local image cache, but its OS or
         * architecture does not match, a warning is produced.
         *
         * When used with the `fromSrc` option to import an image from an archive,
         * this option sets the platform information for the imported image. If
         * the option is not set, the host's native OS and Architecture are used
         * for the imported image.
         * @default ""
         */
        platform?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, ErrorResponse>({
        path: `/images/create`,
        method: "POST",
        query: query,
        body: inputImage,
        type: ContentType.Text,
        ...params,
      }),

    /**
     * @description Return low-level information about an image.
     *
     * @tags Image
     * @name ImageInspect
     * @summary Inspect an image
     * @request GET:/images/{name}/json
     */
    imageInspect: (name: string, params: RequestParams = {}) =>
      this.request<ImageInspect, ErrorResponse>({
        path: `/images/${name}/json`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Return parent layers of an image.
     *
     * @tags Image
     * @name ImageHistory
     * @summary Get the history of an image
     * @request GET:/images/{name}/history
     */
    imageHistory: (name: string, params: RequestParams = {}) =>
      this.request<
        {
          Id: string;
          /** @format int64 */
          Created: number;
          CreatedBy: string;
          Tags: string[];
          /** @format int64 */
          Size: number;
          Comment: string;
        }[],
        ErrorResponse
      >({
        path: `/images/${name}/history`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Push an image to a registry. If you wish to push an image on to a private registry, that image must already have a tag which references the registry. For example, `registry.example.com/myimage:latest`. The push is cancelled if the HTTP connection is closed.
     *
     * @tags Image
     * @name ImagePush
     * @summary Push an image
     * @request POST:/images/{name}/push
     */
    imagePush: (
      name: string,
      query?: {
        /** The tag to associate with the image on the registry. */
        tag?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, ErrorResponse>({
        path: `/images/${name}/push`,
        method: "POST",
        query: query,
        ...params,
      }),

    /**
     * @description Tag an image so that it becomes part of a repository.
     *
     * @tags Image
     * @name ImageTag
     * @summary Tag an image
     * @request POST:/images/{name}/tag
     */
    imageTag: (
      name: string,
      query?: {
        /** The repository to tag in. For example, `someuser/someimage`. */
        repo?: string;
        /** The name of the new tag. */
        tag?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, ErrorResponse>({
        path: `/images/${name}/tag`,
        method: "POST",
        query: query,
        ...params,
      }),

    /**
     * @description Remove an image, along with any untagged parent images that were referenced by that image. Images can't be removed if they have descendant images, are being used by a running container or are being used by a build.
     *
     * @tags Image
     * @name ImageDelete
     * @summary Remove an image
     * @request DELETE:/images/{name}
     */
    imageDelete: (
      name: string,
      query?: {
        /**
         * Remove the image even if it is being used by stopped containers or has other tags
         * @default false
         */
        force?: boolean;
        /**
         * Do not delete untagged parent images
         * @default false
         */
        noprune?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<ImageDeleteResponseItem[], ErrorResponse>({
        path: `/images/${name}`,
        method: "DELETE",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Search for an image on Docker Hub.
     *
     * @tags Image
     * @name ImageSearch
     * @summary Search images
     * @request GET:/images/search
     */
    imageSearch: (
      query: {
        /** Term to search */
        term: string;
        /** Maximum number of results to return */
        limit?: number;
        /**
         * A JSON encoded value of the filters (a `map[string][]string`) to process on the images list. Available filters:
         *
         * - `is-official=(true|false)`
         * - `stars=<number>` Matches images that has at least 'number' stars.
         */
        filters?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          description?: string;
          is_official?: boolean;
          /**
           * Whether this repository has automated builds enabled.
           *
           * <p><br /></p>
           *
           * > **Deprecated**: This field is deprecated and will always be "false".
           * @example false
           */
          is_automated?: boolean;
          name?: string;
          star_count?: number;
        }[],
        ErrorResponse
      >({
        path: `/images/search`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Image
     * @name ImagePrune
     * @summary Delete unused images
     * @request POST:/images/prune
     */
    imagePrune: (
      query?: {
        /**
         * Filters to process on the prune list, encoded as JSON (a `map[string][]string`). Available filters:
         *
         * - `dangling=<boolean>` When set to `true` (or `1`), prune only
         *    unused *and* untagged images. When set to `false`
         *    (or `0`), all unused images are pruned.
         * - `until=<string>` Prune images created before this timestamp. The `<timestamp>` can be Unix timestamps, date formatted timestamps, or Go duration strings (e.g. `10m`, `1h30m`) computed relative to the daemon machine’s time.
         * - `label` (`label=<key>`, `label=<key>=<value>`, `label!=<key>`, or `label!=<key>=<value>`) Prune images with (or without, in case `label!=...` is used) the specified labels.
         */
        filters?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /** Images that were deleted */
          ImagesDeleted?: ImageDeleteResponseItem[];
          /**
           * Disk space reclaimed in bytes
           * @format int64
           */
          SpaceReclaimed?: number;
        },
        ErrorResponse
      >({
        path: `/images/prune`,
        method: "POST",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Get a tarball containing all images and metadata for a repository. If `name` is a specific name and tag (e.g. `ubuntu:latest`), then only that image (and its parents) are returned. If `name` is an image ID, similarly only that image (and its parents) are returned, but with the exclusion of the `repositories` file in the tarball, as there were no image names referenced. ### Image tarball format An image tarball contains one directory per image layer (named using its long ID), each containing these files: - `VERSION`: currently `1.0` - the file format version - `json`: detailed layer information, similar to `docker inspect layer_id` - `layer.tar`: A tarfile containing the filesystem changes in this layer The `layer.tar` file contains `aufs` style `.wh..wh.aufs` files and directories for storing attribute changes and deletions. If the tarball defines a repository, the tarball should also include a `repositories` file at the root that contains a list of repository and tag names mapped to layer IDs. ```json { "hello-world": { "latest": "565a9d68a73f6706862bfe8409a7f659776d4d60a8d096eb4a3cbce6999cc2a1" } } ```
     *
     * @tags Image
     * @name ImageGet
     * @summary Export an image
     * @request GET:/images/{name}/get
     */
    imageGet: (name: string, params: RequestParams = {}) =>
      this.request<File, ErrorResponse>({
        path: `/images/${name}/get`,
        method: "GET",
        ...params,
      }),

    /**
     * @description Get a tarball containing all images and metadata for several image repositories. For each value of the `names` parameter: if it is a specific name and tag (e.g. `ubuntu:latest`), then only that image (and its parents) are returned; if it is an image ID, similarly only that image (and its parents) are returned and there would be no names referenced in the 'repositories' file for this image ID. For details on the format, see the [export image endpoint](#operation/ImageGet).
     *
     * @tags Image
     * @name ImageGetAll
     * @summary Export several images
     * @request GET:/images/get
     */
    imageGetAll: (
      query?: {
        /** Image names to filter by */
        names?: string[];
      },
      params: RequestParams = {},
    ) =>
      this.request<File, ErrorResponse>({
        path: `/images/get`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * @description Load a set of images and tags into a repository. For details on the format, see the [export image endpoint](#operation/ImageGet).
     *
     * @tags Image
     * @name ImageLoad
     * @summary Import images
     * @request POST:/images/load
     */
    imageLoad: (
      imagesTarball: File,
      query?: {
        /**
         * Suppress progress details during load.
         * @default false
         */
        quiet?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, ErrorResponse>({
        path: `/images/load`,
        method: "POST",
        query: query,
        body: imagesTarball,
        ...params,
      }),
  };
  build = {
    /**
     * @description Build an image from a tar archive with a `Dockerfile` in it. The `Dockerfile` specifies how the image is built from the tar archive. It is typically in the archive's root, but can be at a different path or have a different name by specifying the `dockerfile` parameter. [See the `Dockerfile` reference for more information](https://docs.docker.com/engine/reference/builder/). The Docker daemon performs a preliminary validation of the `Dockerfile` before starting the build, and returns an error if the syntax is incorrect. After that, each instruction is run one-by-one until the ID of the new image is output. The build is canceled if the client drops the connection by quitting or being killed.
     *
     * @tags Image
     * @name ImageBuild
     * @summary Build an image
     * @request POST:/build
     */
    imageBuild: (
      inputStream: File,
      query?: {
        /**
         * Path within the build context to the `Dockerfile`. This is ignored if `remote` is specified and points to an external `Dockerfile`.
         * @default "Dockerfile"
         */
        dockerfile?: string;
        /** A name and optional tag to apply to the image in the `name:tag` format. If you omit the tag the default `latest` value is assumed. You can provide several `t` parameters. */
        t?: string;
        /** Extra hosts to add to /etc/hosts */
        extrahosts?: string;
        /** A Git repository URI or HTTP/HTTPS context URI. If the URI points to a single text file, the file’s contents are placed into a file called `Dockerfile` and the image is built from that file. If the URI points to a tarball, the file is downloaded by the daemon and the contents therein used as the context for the build. If the URI points to a tarball and the `dockerfile` parameter is also specified, there must be a file with the corresponding path inside the tarball. */
        remote?: string;
        /**
         * Suppress verbose build output.
         * @default false
         */
        q?: boolean;
        /**
         * Do not use the cache when building the image.
         * @default false
         */
        nocache?: boolean;
        /** JSON array of images used for build cache resolution. */
        cachefrom?: string;
        /** Attempt to pull the image even if an older image exists locally. */
        pull?: string;
        /**
         * Remove intermediate containers after a successful build.
         * @default true
         */
        rm?: boolean;
        /**
         * Always remove intermediate containers, even upon failure.
         * @default false
         */
        forcerm?: boolean;
        /** Set memory limit for build. */
        memory?: number;
        /** Total memory (memory + swap). Set as `-1` to disable swap. */
        memswap?: number;
        /** CPU shares (relative weight). */
        cpushares?: number;
        /** CPUs in which to allow execution (e.g., `0-3`, `0,1`). */
        cpusetcpus?: string;
        /** The length of a CPU period in microseconds. */
        cpuperiod?: number;
        /** Microseconds of CPU time that the container can get in a CPU period. */
        cpuquota?: number;
        /**
         * JSON map of string pairs for build-time variables. Users pass these values at build-time. Docker uses the buildargs as the environment context for commands run via the `Dockerfile` RUN instruction, or for variable expansion in other `Dockerfile` instructions. This is not meant for passing secret values.
         *
         * For example, the build arg `FOO=bar` would become `{"FOO":"bar"}` in JSON. This would result in the query parameter `buildargs={"FOO":"bar"}`. Note that `{"FOO":"bar"}` should be URI component encoded.
         *
         * [Read more about the buildargs instruction.](https://docs.docker.com/engine/reference/builder/#arg)
         */
        buildargs?: string;
        /** Size of `/dev/shm` in bytes. The size must be greater than 0. If omitted the system uses 64MB. */
        shmsize?: number;
        /** Squash the resulting images layers into a single layer. *(Experimental release only.)* */
        squash?: boolean;
        /** Arbitrary key/value labels to set on the image, as a JSON map of string pairs. */
        labels?: string;
        /**
         * Sets the networking mode for the run commands during build. Supported
         * standard values are: `bridge`, `host`, `none`, and `container:<name|id>`.
         * Any other value is taken as a custom network's name or ID to which this
         * container should connect to.
         */
        networkmode?: string;
        /**
         * Platform in the format os[/arch[/variant]]
         * @default ""
         */
        platform?: string;
        /**
         * Target build stage
         * @default ""
         */
        target?: string;
        /**
         * BuildKit output configuration
         * @default ""
         */
        outputs?: string;
        /**
         * Version of the builder backend to use.
         *
         * - `1` is the first generation classic (deprecated) builder in the Docker daemon (default)
         * - `2` is [BuildKit](https://github.com/moby/buildkit)
         * @default "1"
         */
        version?: "1" | "2";
      },
      params: RequestParams = {},
    ) =>
      this.request<void, ErrorResponse>({
        path: `/build`,
        method: "POST",
        query: query,
        body: inputStream,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Image
     * @name BuildPrune
     * @summary Delete builder cache
     * @request POST:/build/prune
     */
    buildPrune: (
      query?: {
        /**
         * Amount of disk space in bytes to keep for cache
         * @format int64
         */
        "keep-storage"?: number;
        /** Remove all types of build cache */
        all?: boolean;
        /**
         * A JSON encoded value of the filters (a `map[string][]string`) to
         * process on the list of build cache objects.
         *
         * Available filters:
         *
         * - `until=<timestamp>` remove cache older than `<timestamp>`. The `<timestamp>` can be Unix timestamps, date formatted timestamps, or Go duration strings (e.g. `10m`, `1h30m`) computed relative to the daemon's local time.
         * - `id=<id>`
         * - `parent=<id>`
         * - `type=<string>`
         * - `description=<string>`
         * - `inuse`
         * - `shared`
         * - `private`
         */
        filters?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          CachesDeleted?: string[];
          /**
           * Disk space reclaimed in bytes
           * @format int64
           */
          SpaceReclaimed?: number;
        },
        ErrorResponse
      >({
        path: `/build/prune`,
        method: "POST",
        query: query,
        format: "json",
        ...params,
      }),
  };
  auth = {
    /**
     * @description Validate credentials for a registry and, if available, get an identity token for accessing the registry without password.
     *
     * @tags System
     * @name SystemAuth
     * @summary Check auth configuration
     * @request POST:/auth
     */
    systemAuth: (authConfig: AuthConfig, params: RequestParams = {}) =>
      this.request<
        {
          /** The status of the authentication */
          Status: string;
          /** An opaque token used to authenticate a user after a successful login */
          IdentityToken: string;
        },
        ErrorResponse
      >({
        path: `/auth`,
        method: "POST",
        body: authConfig,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  info = {
    /**
     * No description
     *
     * @tags System
     * @name SystemInfo
     * @summary Get system information
     * @request GET:/info
     */
    systemInfo: (params: RequestParams = {}) =>
      this.request<SystemInfo, ErrorResponse>({
        path: `/info`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };
  version = {
    /**
     * @description Returns the version of Docker that is running and various information about the system that Docker is running on.
     *
     * @tags System
     * @name SystemVersion
     * @summary Get version
     * @request GET:/version
     */
    systemVersion: (params: RequestParams = {}) =>
      this.request<SystemVersion, ErrorResponse>({
        path: `/version`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };
  ping = {
    /**
     * @description This is a dummy endpoint you can use to test if the server is accessible.
     *
     * @tags System
     * @name SystemPing
     * @summary Ping
     * @request GET:/_ping
     */
    systemPing: (params: RequestParams = {}) =>
      this.request<string, ErrorResponse>({
        path: `/_ping`,
        method: "GET",
        ...params,
      }),

    /**
     * @description This is a dummy endpoint you can use to test if the server is accessible.
     *
     * @tags System
     * @name SystemPingHead
     * @summary Ping
     * @request HEAD:/_ping
     */
    systemPingHead: (params: RequestParams = {}) =>
      this.request<string, ErrorResponse>({
        path: `/_ping`,
        method: "HEAD",
        ...params,
      }),
  };
  commit = {
    /**
     * No description
     *
     * @tags Image
     * @name ImageCommit
     * @summary Create a new image from a container
     * @request POST:/commit
     */
    imageCommit: (
      containerConfig: ContainerConfig,
      query?: {
        /** The ID or name of the container to commit */
        container?: string;
        /** Repository name for the created image */
        repo?: string;
        /** Tag name for the create image */
        tag?: string;
        /** Commit message */
        comment?: string;
        /** Author of the image (e.g., `John Hannibal Smith <hannibal@a-team.com>`) */
        author?: string;
        /**
         * Whether to pause the container before committing
         * @default true
         */
        pause?: boolean;
        /** `Dockerfile` instructions to apply while committing */
        changes?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<IdResponse, ErrorResponse>({
        path: `/commit`,
        method: "POST",
        query: query,
        body: containerConfig,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  events = {
    /**
     * @description Stream real-time events from the server. Various objects within Docker report events when something happens to them. Containers report these events: `attach`, `commit`, `copy`, `create`, `destroy`, `detach`, `die`, `exec_create`, `exec_detach`, `exec_start`, `exec_die`, `export`, `health_status`, `kill`, `oom`, `pause`, `rename`, `resize`, `restart`, `start`, `stop`, `top`, `unpause`, `update`, and `prune` Images report these events: `delete`, `import`, `load`, `pull`, `push`, `save`, `tag`, `untag`, and `prune` Volumes report these events: `create`, `mount`, `unmount`, `destroy`, and `prune` Networks report these events: `create`, `connect`, `disconnect`, `destroy`, `update`, `remove`, and `prune` The Docker daemon reports these events: `reload` Services report these events: `create`, `update`, and `remove` Nodes report these events: `create`, `update`, and `remove` Secrets report these events: `create`, `update`, and `remove` Configs report these events: `create`, `update`, and `remove` The Builder reports `prune` events
     *
     * @tags System
     * @name SystemEvents
     * @summary Monitor events
     * @request GET:/events
     */
    systemEvents: (
      query?: {
        /** Show events created since this timestamp then stream new events. */
        since?: string;
        /** Show events created until this timestamp then stop streaming. */
        until?: string;
        /**
         * A JSON encoded value of filters (a `map[string][]string`) to process on the event list. Available filters:
         *
         * - `config=<string>` config name or ID
         * - `container=<string>` container name or ID
         * - `daemon=<string>` daemon name or ID
         * - `event=<string>` event type
         * - `image=<string>` image name or ID
         * - `label=<string>` image or container label
         * - `network=<string>` network name or ID
         * - `node=<string>` node ID
         * - `plugin`=<string> plugin name or ID
         * - `scope`=<string> local or swarm
         * - `secret=<string>` secret name or ID
         * - `service=<string>` service name or ID
         * - `type=<string>` object to filter by, one of `container`, `image`, `volume`, `network`, `daemon`, `plugin`, `node`, `service`, `secret` or `config`
         * - `volume=<string>` volume name
         */
        filters?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<EventMessage, ErrorResponse>({
        path: `/events`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
  };
  system = {
    /**
     * No description
     *
     * @tags System
     * @name SystemDataUsage
     * @summary Get data usage information
     * @request GET:/system/df
     */
    systemDataUsage: (
      query?: {
        /** Object types, for which to compute and return data. */
        type?: ("container" | "image" | "volume" | "build-cache")[];
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /** @format int64 */
          LayersSize?: number;
          Images?: ImageSummary[];
          Containers?: ContainerSummary[];
          Volumes?: Volume[];
          BuildCache?: BuildCache[];
        },
        ErrorResponse
      >({
        path: `/system/df`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
  };
  exec = {
    /**
     * @description Starts a previously set up exec instance. If detach is true, this endpoint returns immediately after starting the command. Otherwise, it sets up an interactive session with the command.
     *
     * @tags Exec
     * @name ExecStart
     * @summary Start an exec instance
     * @request POST:/exec/{id}/start
     */
    execStart: (
      id: string,
      execStartConfig: {
        /** Detach from the command. */
        Detach?: boolean;
        /** Allocate a pseudo-TTY. */
        Tty?: boolean;
        /**
         * Initial console size, as an `[height, width]` array.
         * @maxItems 2
         * @minItems 2
         */
        ConsoleSize?: number[] | null;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, ErrorResponse>({
        path: `/exec/${id}/start`,
        method: "POST",
        body: execStartConfig,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Resize the TTY session used by an exec instance. This endpoint only works if `tty` was specified as part of creating and starting the exec instance.
     *
     * @tags Exec
     * @name ExecResize
     * @summary Resize an exec instance
     * @request POST:/exec/{id}/resize
     */
    execResize: (
      id: string,
      query?: {
        /** Height of the TTY session in characters */
        h?: number;
        /** Width of the TTY session in characters */
        w?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, ErrorResponse>({
        path: `/exec/${id}/resize`,
        method: "POST",
        query: query,
        ...params,
      }),

    /**
     * @description Return low-level information about an exec instance.
     *
     * @tags Exec
     * @name ExecInspect
     * @summary Inspect an exec instance
     * @request GET:/exec/{id}/json
     */
    execInspect: (id: string, params: RequestParams = {}) =>
      this.request<
        {
          CanRemove?: boolean;
          DetachKeys?: string;
          ID?: string;
          Running?: boolean;
          ExitCode?: number;
          ProcessConfig?: ProcessConfig;
          OpenStdin?: boolean;
          OpenStderr?: boolean;
          OpenStdout?: boolean;
          ContainerID?: string;
          /** The system process ID for the exec process. */
          Pid?: number;
        },
        ErrorResponse
      >({
        path: `/exec/${id}/json`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };
  volumes = {
    /**
     * No description
     *
     * @tags Volume
     * @name VolumeList
     * @summary List volumes
     * @request GET:/volumes
     */
    volumeList: (
      query?: {
        /**
         * JSON encoded value of the filters (a `map[string][]string`) to
         * process on the volumes list. Available filters:
         *
         * - `dangling=<boolean>` When set to `true` (or `1`), returns all
         *    volumes that are not in use by a container. When set to `false`
         *    (or `0`), only volumes that are in use by one or more
         *    containers are returned.
         * - `driver=<volume-driver-name>` Matches volumes based on their driver.
         * - `label=<key>` or `label=<key>:<value>` Matches volumes based on
         *    the presence of a `label` alone or a `label` and a value.
         * - `name=<volume-name>` Matches all or part of a volume name.
         * @format json
         */
        filters?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<VolumeListResponse, ErrorResponse>({
        path: `/volumes`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Volume
     * @name VolumeCreate
     * @summary Create a volume
     * @request POST:/volumes/create
     */
    volumeCreate: (volumeConfig: VolumeCreateOptions, params: RequestParams = {}) =>
      this.request<Volume, ErrorResponse>({
        path: `/volumes/create`,
        method: "POST",
        body: volumeConfig,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Volume
     * @name VolumeInspect
     * @summary Inspect a volume
     * @request GET:/volumes/{name}
     */
    volumeInspect: (name: string, params: RequestParams = {}) =>
      this.request<Volume, ErrorResponse>({
        path: `/volumes/${name}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Volume
     * @name VolumeUpdate
     * @summary "Update a volume. Valid only for Swarm cluster volumes"
     * @request PUT:/volumes/{name}
     */
    volumeUpdate: (
      name: string,
      query: {
        /**
         * The version number of the volume being updated. This is required to
         * avoid conflicting writes. Found in the volume's `ClusterVolume`
         * field.
         * @format int64
         */
        version: number;
      },
      body: {
        /** Cluster-specific options used to create the volume. */
        Spec?: ClusterVolumeSpec;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, ErrorResponse>({
        path: `/volumes/${name}`,
        method: "PUT",
        query: query,
        body: body,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Instruct the driver to remove the volume.
     *
     * @tags Volume
     * @name VolumeDelete
     * @summary Remove a volume
     * @request DELETE:/volumes/{name}
     */
    volumeDelete: (
      name: string,
      query?: {
        /**
         * Force the removal of the volume
         * @default false
         */
        force?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, ErrorResponse>({
        path: `/volumes/${name}`,
        method: "DELETE",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Volume
     * @name VolumePrune
     * @summary Delete unused volumes
     * @request POST:/volumes/prune
     */
    volumePrune: (
      query?: {
        /**
         * Filters to process on the prune list, encoded as JSON (a `map[string][]string`).
         *
         * Available filters:
         * - `label` (`label=<key>`, `label=<key>=<value>`, `label!=<key>`, or `label!=<key>=<value>`) Prune volumes with (or without, in case `label!=...` is used) the specified labels.
         * - `all` (`all=true`) - Consider all (local) volumes for pruning and not just anonymous volumes.
         */
        filters?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /** Volumes that were deleted */
          VolumesDeleted?: string[];
          /**
           * Disk space reclaimed in bytes
           * @format int64
           */
          SpaceReclaimed?: number;
        },
        ErrorResponse
      >({
        path: `/volumes/prune`,
        method: "POST",
        query: query,
        format: "json",
        ...params,
      }),
  };
  networks = {
    /**
     * @description Returns a list of networks. For details on the format, see the [network inspect endpoint](#operation/NetworkInspect). Note that it uses a different, smaller representation of a network than inspecting a single network. For example, the list of containers attached to the network is not propagated in API versions 1.28 and up.
     *
     * @tags Network
     * @name NetworkList
     * @summary List networks
     * @request GET:/networks
     */
    networkList: (
      query?: {
        /**
         * JSON encoded value of the filters (a `map[string][]string`) to process
         * on the networks list.
         *
         * Available filters:
         *
         * - `dangling=<boolean>` When set to `true` (or `1`), returns all
         *    networks that are not in use by a container. When set to `false`
         *    (or `0`), only networks that are in use by one or more
         *    containers are returned.
         * - `driver=<driver-name>` Matches a network's driver.
         * - `id=<network-id>` Matches all or part of a network ID.
         * - `label=<key>` or `label=<key>=<value>` of a network label.
         * - `name=<network-name>` Matches all or part of a network name.
         * - `scope=["swarm"|"global"|"local"]` Filters networks by scope (`swarm`, `global`, or `local`).
         * - `type=["custom"|"builtin"]` Filters networks by type. The `custom` keyword returns all user-defined networks.
         */
        filters?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<Network[], ErrorResponse>({
        path: `/networks`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Network
     * @name NetworkInspect
     * @summary Inspect a network
     * @request GET:/networks/{id}
     */
    networkInspect: (
      id: string,
      query?: {
        /**
         * Detailed inspect output for troubleshooting
         * @default false
         */
        verbose?: boolean;
        /** Filter the network by scope (swarm, global, or local) */
        scope?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<Network, ErrorResponse>({
        path: `/networks/${id}`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Network
     * @name NetworkDelete
     * @summary Remove a network
     * @request DELETE:/networks/{id}
     */
    networkDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, ErrorResponse>({
        path: `/networks/${id}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Network
     * @name NetworkCreate
     * @summary Create a network
     * @request POST:/networks/create
     */
    networkCreate: (
      networkConfig: {
        /** The network's name. */
        Name: string;
        /** Deprecated: CheckDuplicate is now always enabled. */
        CheckDuplicate?: boolean;
        /**
         * Name of the network driver plugin to use.
         * @default "bridge"
         */
        Driver?: string;
        /** Restrict external access to the network. */
        Internal?: boolean;
        /**
         * Globally scoped network is manually attachable by regular
         * containers from workers in swarm mode.
         */
        Attachable?: boolean;
        /**
         * Ingress network is the network which provides the routing-mesh
         * in swarm mode.
         */
        Ingress?: boolean;
        /** Optional custom IP scheme for the network. */
        IPAM?: IPAM;
        /** Enable IPv6 on the network. */
        EnableIPv6?: boolean;
        /** Network specific options to be used by the drivers. */
        Options?: Record<string, string>;
        /** User-defined key/value metadata. */
        Labels?: Record<string, string>;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /** The ID of the created network. */
          Id?: string;
          Warning?: string;
        },
        ErrorResponse
      >({
        path: `/networks/create`,
        method: "POST",
        body: networkConfig,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description The network must be either a local-scoped network or a swarm-scoped network with the `attachable` option set. A network cannot be re-attached to a running container
     *
     * @tags Network
     * @name NetworkConnect
     * @summary Connect a container to a network
     * @request POST:/networks/{id}/connect
     */
    networkConnect: (
      id: string,
      container: {
        /** The ID or name of the container to connect to the network. */
        Container?: string;
        /** Configuration for a network endpoint. */
        EndpointConfig?: EndpointSettings;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, ErrorResponse>({
        path: `/networks/${id}/connect`,
        method: "POST",
        body: container,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Network
     * @name NetworkDisconnect
     * @summary Disconnect a container from a network
     * @request POST:/networks/{id}/disconnect
     */
    networkDisconnect: (
      id: string,
      container: {
        /** The ID or name of the container to disconnect from the network. */
        Container?: string;
        /** Force the container to disconnect from the network. */
        Force?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, ErrorResponse>({
        path: `/networks/${id}/disconnect`,
        method: "POST",
        body: container,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Network
     * @name NetworkPrune
     * @summary Delete unused networks
     * @request POST:/networks/prune
     */
    networkPrune: (
      query?: {
        /**
         * Filters to process on the prune list, encoded as JSON (a `map[string][]string`).
         *
         * Available filters:
         * - `until=<timestamp>` Prune networks created before this timestamp. The `<timestamp>` can be Unix timestamps, date formatted timestamps, or Go duration strings (e.g. `10m`, `1h30m`) computed relative to the daemon machine’s time.
         * - `label` (`label=<key>`, `label=<key>=<value>`, `label!=<key>`, or `label!=<key>=<value>`) Prune networks with (or without, in case `label!=...` is used) the specified labels.
         */
        filters?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /** Networks that were deleted */
          NetworksDeleted?: string[];
        },
        ErrorResponse
      >({
        path: `/networks/prune`,
        method: "POST",
        query: query,
        format: "json",
        ...params,
      }),
  };
  plugins = {
    /**
     * @description Returns information about installed plugins.
     *
     * @tags Plugin
     * @name PluginList
     * @summary List plugins
     * @request GET:/plugins
     */
    pluginList: (
      query?: {
        /**
         * A JSON encoded value of the filters (a `map[string][]string`) to
         * process on the plugin list.
         *
         * Available filters:
         *
         * - `capability=<capability name>`
         * - `enable=<true>|<false>`
         */
        filters?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<Plugin[], ErrorResponse>({
        path: `/plugins`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Plugin
     * @name GetPluginPrivileges
     * @summary Get plugin privileges
     * @request GET:/plugins/privileges
     */
    getPluginPrivileges: (
      query: {
        /**
         * The name of the plugin. The `:latest` tag is optional, and is the
         * default if omitted.
         */
        remote: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<PluginPrivilege[], ErrorResponse>({
        path: `/plugins/privileges`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Pulls and installs a plugin. After the plugin is installed, it can be enabled using the [`POST /plugins/{name}/enable` endpoint](#operation/PostPluginsEnable).
     *
     * @tags Plugin
     * @name PluginPull
     * @summary Install a plugin
     * @request POST:/plugins/pull
     */
    pluginPull: (
      query: {
        /**
         * Remote reference for plugin to install.
         *
         * The `:latest` tag is optional, and is used as the default if omitted.
         */
        remote: string;
        /**
         * Local name for the pulled plugin.
         *
         * The `:latest` tag is optional, and is used as the default if omitted.
         */
        name?: string;
      },
      body: PluginPrivilege[],
      params: RequestParams = {},
    ) =>
      this.request<void, ErrorResponse>({
        path: `/plugins/pull`,
        method: "POST",
        query: query,
        body: body,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Plugin
     * @name PluginInspect
     * @summary Inspect a plugin
     * @request GET:/plugins/{name}/json
     */
    pluginInspect: (name: string, params: RequestParams = {}) =>
      this.request<Plugin, ErrorResponse>({
        path: `/plugins/${name}/json`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Plugin
     * @name PluginDelete
     * @summary Remove a plugin
     * @request DELETE:/plugins/{name}
     */
    pluginDelete: (
      name: string,
      query?: {
        /**
         * Disable the plugin before removing. This may result in issues if the
         * plugin is in use by a container.
         * @default false
         */
        force?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<Plugin, ErrorResponse>({
        path: `/plugins/${name}`,
        method: "DELETE",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Plugin
     * @name PluginEnable
     * @summary Enable a plugin
     * @request POST:/plugins/{name}/enable
     */
    pluginEnable: (
      name: string,
      query?: {
        /**
         * Set the HTTP client timeout (in seconds)
         * @default 0
         */
        timeout?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, ErrorResponse>({
        path: `/plugins/${name}/enable`,
        method: "POST",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Plugin
     * @name PluginDisable
     * @summary Disable a plugin
     * @request POST:/plugins/{name}/disable
     */
    pluginDisable: (
      name: string,
      query?: {
        /** Force disable a plugin even if still in use. */
        force?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, ErrorResponse>({
        path: `/plugins/${name}/disable`,
        method: "POST",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Plugin
     * @name PluginUpgrade
     * @summary Upgrade a plugin
     * @request POST:/plugins/{name}/upgrade
     */
    pluginUpgrade: (
      name: string,
      query: {
        /**
         * Remote reference to upgrade to.
         *
         * The `:latest` tag is optional, and is used as the default if omitted.
         */
        remote: string;
      },
      body: PluginPrivilege[],
      params: RequestParams = {},
    ) =>
      this.request<void, ErrorResponse>({
        path: `/plugins/${name}/upgrade`,
        method: "POST",
        query: query,
        body: body,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Plugin
     * @name PluginCreate
     * @summary Create a plugin
     * @request POST:/plugins/create
     */
    pluginCreate: (
      query: {
        /**
         * The name of the plugin. The `:latest` tag is optional, and is the
         * default if omitted.
         */
        name: string;
      },
      tarContext: File,
      params: RequestParams = {},
    ) =>
      this.request<void, ErrorResponse>({
        path: `/plugins/create`,
        method: "POST",
        query: query,
        body: tarContext,
        ...params,
      }),

    /**
     * @description Push a plugin to the registry.
     *
     * @tags Plugin
     * @name PluginPush
     * @summary Push a plugin
     * @request POST:/plugins/{name}/push
     */
    pluginPush: (name: string, params: RequestParams = {}) =>
      this.request<void, ErrorResponse>({
        path: `/plugins/${name}/push`,
        method: "POST",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Plugin
     * @name PluginSet
     * @summary Configure a plugin
     * @request POST:/plugins/{name}/set
     */
    pluginSet: (name: string, body: string[], params: RequestParams = {}) =>
      this.request<void, ErrorResponse>({
        path: `/plugins/${name}/set`,
        method: "POST",
        body: body,
        type: ContentType.Json,
        ...params,
      }),
  };
  nodes = {
    /**
     * No description
     *
     * @tags Node
     * @name NodeList
     * @summary List nodes
     * @request GET:/nodes
     */
    nodeList: (
      query?: {
        /**
         * Filters to process on the nodes list, encoded as JSON (a `map[string][]string`).
         *
         * Available filters:
         * - `id=<node id>`
         * - `label=<engine label>`
         * - `membership=`(`accepted`|`pending`)`
         * - `name=<node name>`
         * - `node.label=<node label>`
         * - `role=`(`manager`|`worker`)`
         */
        filters?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<Node[], ErrorResponse>({
        path: `/nodes`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Node
     * @name NodeInspect
     * @summary Inspect a node
     * @request GET:/nodes/{id}
     */
    nodeInspect: (id: string, params: RequestParams = {}) =>
      this.request<Node, ErrorResponse>({
        path: `/nodes/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Node
     * @name NodeDelete
     * @summary Delete a node
     * @request DELETE:/nodes/{id}
     */
    nodeDelete: (
      id: string,
      query?: {
        /**
         * Force remove a node from the swarm
         * @default false
         */
        force?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, ErrorResponse>({
        path: `/nodes/${id}`,
        method: "DELETE",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Node
     * @name NodeUpdate
     * @summary Update a node
     * @request POST:/nodes/{id}/update
     */
    nodeUpdate: (
      id: string,
      query: {
        /**
         * The version number of the node object being updated. This is required
         * to avoid conflicting writes.
         * @format int64
         */
        version: number;
      },
      body: NodeSpec,
      params: RequestParams = {},
    ) =>
      this.request<void, ErrorResponse>({
        path: `/nodes/${id}/update`,
        method: "POST",
        query: query,
        body: body,
        type: ContentType.Json,
        ...params,
      }),
  };
  swarm = {
    /**
     * No description
     *
     * @tags Swarm
     * @name SwarmInspect
     * @summary Inspect swarm
     * @request GET:/swarm
     */
    swarmInspect: (params: RequestParams = {}) =>
      this.request<Swarm, ErrorResponse>({
        path: `/swarm`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Swarm
     * @name SwarmInit
     * @summary Initialize a new swarm
     * @request POST:/swarm/init
     */
    swarmInit: (
      body: {
        /**
         * Listen address used for inter-manager communication, as well
         * as determining the networking interface used for the VXLAN
         * Tunnel Endpoint (VTEP). This can either be an address/port
         * combination in the form `192.168.1.1:4567`, or an interface
         * followed by a port number, like `eth0:4567`. If the port number
         * is omitted, the default swarm listening port is used.
         */
        ListenAddr?: string;
        /**
         * Externally reachable address advertised to other nodes. This
         * can either be an address/port combination in the form
         * `192.168.1.1:4567`, or an interface followed by a port number,
         * like `eth0:4567`. If the port number is omitted, the port
         * number from the listen address is used. If `AdvertiseAddr` is
         * not specified, it will be automatically detected when possible.
         */
        AdvertiseAddr?: string;
        /**
         * Address or interface to use for data path traffic (format:
         * `<ip|interface>`), for example,  `192.168.1.1`, or an interface,
         * like `eth0`. If `DataPathAddr` is unspecified, the same address
         * as `AdvertiseAddr` is used.
         *
         * The `DataPathAddr` specifies the address that global scope
         * network drivers will publish towards other  nodes in order to
         * reach the containers running on this node. Using this parameter
         * it is possible to separate the container data traffic from the
         * management traffic of the cluster.
         */
        DataPathAddr?: string;
        /**
         * DataPathPort specifies the data path port number for data traffic.
         * Acceptable port range is 1024 to 49151.
         * if no port is set or is set to 0, default port 4789 will be used.
         * @format uint32
         */
        DataPathPort?: number;
        /**
         * Default Address Pool specifies default subnet pools for global
         * scope networks.
         */
        DefaultAddrPool?: string[];
        /** Force creation of a new swarm. */
        ForceNewCluster?: boolean;
        /**
         * SubnetSize specifies the subnet size of the networks created
         * from the default subnet pool.
         * @format uint32
         */
        SubnetSize?: number;
        /** User modifiable swarm configuration. */
        Spec?: SwarmSpec;
      },
      params: RequestParams = {},
    ) =>
      this.request<string, ErrorResponse>({
        path: `/swarm/init`,
        method: "POST",
        body: body,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Swarm
     * @name SwarmJoin
     * @summary Join an existing swarm
     * @request POST:/swarm/join
     */
    swarmJoin: (
      body: {
        /**
         * Listen address used for inter-manager communication if the node
         * gets promoted to manager, as well as determining the networking
         * interface used for the VXLAN Tunnel Endpoint (VTEP).
         */
        ListenAddr?: string;
        /**
         * Externally reachable address advertised to other nodes. This
         * can either be an address/port combination in the form
         * `192.168.1.1:4567`, or an interface followed by a port number,
         * like `eth0:4567`. If the port number is omitted, the port
         * number from the listen address is used. If `AdvertiseAddr` is
         * not specified, it will be automatically detected when possible.
         */
        AdvertiseAddr?: string;
        /**
         * Address or interface to use for data path traffic (format:
         * `<ip|interface>`), for example,  `192.168.1.1`, or an interface,
         * like `eth0`. If `DataPathAddr` is unspecified, the same address
         * as `AdvertiseAddr` is used.
         *
         * The `DataPathAddr` specifies the address that global scope
         * network drivers will publish towards other nodes in order to
         * reach the containers running on this node. Using this parameter
         * it is possible to separate the container data traffic from the
         * management traffic of the cluster.
         */
        DataPathAddr?: string;
        /** Addresses of manager nodes already participating in the swarm. */
        RemoteAddrs?: string[];
        /** Secret token for joining this swarm. */
        JoinToken?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, ErrorResponse>({
        path: `/swarm/join`,
        method: "POST",
        body: body,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Swarm
     * @name SwarmLeave
     * @summary Leave a swarm
     * @request POST:/swarm/leave
     */
    swarmLeave: (
      query?: {
        /**
         * Force leave swarm, even if this is the last manager or that it will
         * break the cluster.
         * @default false
         */
        force?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, ErrorResponse>({
        path: `/swarm/leave`,
        method: "POST",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Swarm
     * @name SwarmUpdate
     * @summary Update a swarm
     * @request POST:/swarm/update
     */
    swarmUpdate: (
      query: {
        /**
         * The version number of the swarm object being updated. This is
         * required to avoid conflicting writes.
         * @format int64
         */
        version: number;
        /**
         * Rotate the worker join token.
         * @default false
         */
        rotateWorkerToken?: boolean;
        /**
         * Rotate the manager join token.
         * @default false
         */
        rotateManagerToken?: boolean;
        /**
         * Rotate the manager unlock key.
         * @default false
         */
        rotateManagerUnlockKey?: boolean;
      },
      body: SwarmSpec,
      params: RequestParams = {},
    ) =>
      this.request<void, ErrorResponse>({
        path: `/swarm/update`,
        method: "POST",
        query: query,
        body: body,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Swarm
     * @name SwarmUnlockkey
     * @summary Get the unlock key
     * @request GET:/swarm/unlockkey
     */
    swarmUnlockkey: (params: RequestParams = {}) =>
      this.request<
        {
          /** The swarm's unlock key. */
          UnlockKey?: string;
        },
        ErrorResponse
      >({
        path: `/swarm/unlockkey`,
        method: "GET",
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Swarm
     * @name SwarmUnlock
     * @summary Unlock a locked manager
     * @request POST:/swarm/unlock
     */
    swarmUnlock: (
      body: {
        /** The swarm's unlock key. */
        UnlockKey?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, ErrorResponse>({
        path: `/swarm/unlock`,
        method: "POST",
        body: body,
        type: ContentType.Json,
        ...params,
      }),
  };
  services = {
    /**
     * No description
     *
     * @tags Service
     * @name ServiceList
     * @summary List services
     * @request GET:/services
     */
    serviceList: (
      query?: {
        /**
         * A JSON encoded value of the filters (a `map[string][]string`) to
         * process on the services list.
         *
         * Available filters:
         *
         * - `id=<service id>`
         * - `label=<service label>`
         * - `mode=["replicated"|"global"]`
         * - `name=<service name>`
         */
        filters?: string;
        /** Include service status, with count of running and desired tasks. */
        status?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<Service[], ErrorResponse>({
        path: `/services`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Service
     * @name ServiceCreate
     * @summary Create a service
     * @request POST:/services/create
     */
    serviceCreate: (body: ServiceSpec & object, params: RequestParams = {}) =>
      this.request<ServiceCreateResponse, ErrorResponse>({
        path: `/services/create`,
        method: "POST",
        body: body,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Service
     * @name ServiceInspect
     * @summary Inspect a service
     * @request GET:/services/{id}
     */
    serviceInspect: (
      id: string,
      query?: {
        /**
         * Fill empty fields with default values.
         * @default false
         */
        insertDefaults?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<Service, ErrorResponse>({
        path: `/services/${id}`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Service
     * @name ServiceDelete
     * @summary Delete a service
     * @request DELETE:/services/{id}
     */
    serviceDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, ErrorResponse>({
        path: `/services/${id}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Service
     * @name ServiceUpdate
     * @summary Update a service
     * @request POST:/services/{id}/update
     */
    serviceUpdate: (
      id: string,
      query: {
        /**
         * The version number of the service object being updated. This is
         * required to avoid conflicting writes.
         * This version number should be the value as currently set on the
         * service *before* the update. You can find the current version by
         * calling `GET /services/{id}`
         */
        version: number;
        /**
         * If the `X-Registry-Auth` header is not specified, this parameter
         * indicates where to find registry authorization credentials.
         * @default "spec"
         */
        registryAuthFrom?: "spec" | "previous-spec";
        /**
         * Set to this parameter to `previous` to cause a server-side rollback
         * to the previous service spec. The supplied spec will be ignored in
         * this case.
         */
        rollback?: string;
      },
      body: ServiceSpec & object,
      params: RequestParams = {},
    ) =>
      this.request<ServiceUpdateResponse, ErrorResponse>({
        path: `/services/${id}/update`,
        method: "POST",
        query: query,
        body: body,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Get `stdout` and `stderr` logs from a service. See also [`/containers/{id}/logs`](#operation/ContainerLogs). **Note**: This endpoint works only for services with the `local`, `json-file` or `journald` logging drivers.
     *
     * @tags Service
     * @name ServiceLogs
     * @summary Get service logs
     * @request GET:/services/{id}/logs
     */
    serviceLogs: (
      id: string,
      query?: {
        /**
         * Show service context and extra details provided to logs.
         * @default false
         */
        details?: boolean;
        /**
         * Keep connection after returning logs.
         * @default false
         */
        follow?: boolean;
        /**
         * Return logs from `stdout`
         * @default false
         */
        stdout?: boolean;
        /**
         * Return logs from `stderr`
         * @default false
         */
        stderr?: boolean;
        /**
         * Only return logs since this time, as a UNIX timestamp
         * @default 0
         */
        since?: number;
        /**
         * Add timestamps to every log line
         * @default false
         */
        timestamps?: boolean;
        /**
         * Only return this number of log lines from the end of the logs.
         * Specify as an integer or `all` to output all log lines.
         * @default "all"
         */
        tail?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<File, ErrorResponse>({
        path: `/services/${id}/logs`,
        method: "GET",
        query: query,
        ...params,
      }),
  };
  tasks = {
    /**
     * No description
     *
     * @tags Task
     * @name TaskList
     * @summary List tasks
     * @request GET:/tasks
     */
    taskList: (
      query?: {
        /**
         * A JSON encoded value of the filters (a `map[string][]string`) to
         * process on the tasks list.
         *
         * Available filters:
         *
         * - `desired-state=(running | shutdown | accepted)`
         * - `id=<task id>`
         * - `label=key` or `label="key=value"`
         * - `name=<task name>`
         * - `node=<node id or name>`
         * - `service=<service name>`
         */
        filters?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<Task[], ErrorResponse>({
        path: `/tasks`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Task
     * @name TaskInspect
     * @summary Inspect a task
     * @request GET:/tasks/{id}
     */
    taskInspect: (id: string, params: RequestParams = {}) =>
      this.request<Task, ErrorResponse>({
        path: `/tasks/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Get `stdout` and `stderr` logs from a task. See also [`/containers/{id}/logs`](#operation/ContainerLogs). **Note**: This endpoint works only for services with the `local`, `json-file` or `journald` logging drivers.
     *
     * @tags Task
     * @name TaskLogs
     * @summary Get task logs
     * @request GET:/tasks/{id}/logs
     */
    taskLogs: (
      id: string,
      query?: {
        /**
         * Show task context and extra details provided to logs.
         * @default false
         */
        details?: boolean;
        /**
         * Keep connection after returning logs.
         * @default false
         */
        follow?: boolean;
        /**
         * Return logs from `stdout`
         * @default false
         */
        stdout?: boolean;
        /**
         * Return logs from `stderr`
         * @default false
         */
        stderr?: boolean;
        /**
         * Only return logs since this time, as a UNIX timestamp
         * @default 0
         */
        since?: number;
        /**
         * Add timestamps to every log line
         * @default false
         */
        timestamps?: boolean;
        /**
         * Only return this number of log lines from the end of the logs.
         * Specify as an integer or `all` to output all log lines.
         * @default "all"
         */
        tail?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<File, ErrorResponse>({
        path: `/tasks/${id}/logs`,
        method: "GET",
        query: query,
        ...params,
      }),
  };
  secrets = {
    /**
     * No description
     *
     * @tags Secret
     * @name SecretList
     * @summary List secrets
     * @request GET:/secrets
     */
    secretList: (
      query?: {
        /**
         * A JSON encoded value of the filters (a `map[string][]string`) to
         * process on the secrets list.
         *
         * Available filters:
         *
         * - `id=<secret id>`
         * - `label=<key> or label=<key>=value`
         * - `name=<secret name>`
         * - `names=<secret name>`
         */
        filters?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<Secret[], ErrorResponse>({
        path: `/secrets`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Secret
     * @name SecretCreate
     * @summary Create a secret
     * @request POST:/secrets/create
     */
    secretCreate: (body: SecretSpec & object, params: RequestParams = {}) =>
      this.request<IdResponse, ErrorResponse>({
        path: `/secrets/create`,
        method: "POST",
        body: body,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Secret
     * @name SecretInspect
     * @summary Inspect a secret
     * @request GET:/secrets/{id}
     */
    secretInspect: (id: string, params: RequestParams = {}) =>
      this.request<Secret, ErrorResponse>({
        path: `/secrets/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Secret
     * @name SecretDelete
     * @summary Delete a secret
     * @request DELETE:/secrets/{id}
     */
    secretDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, ErrorResponse>({
        path: `/secrets/${id}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Secret
     * @name SecretUpdate
     * @summary Update a Secret
     * @request POST:/secrets/{id}/update
     */
    secretUpdate: (
      id: string,
      query: {
        /**
         * The version number of the secret object being updated. This is
         * required to avoid conflicting writes.
         * @format int64
         */
        version: number;
      },
      body: SecretSpec,
      params: RequestParams = {},
    ) =>
      this.request<void, ErrorResponse>({
        path: `/secrets/${id}/update`,
        method: "POST",
        query: query,
        body: body,
        type: ContentType.Json,
        ...params,
      }),
  };
  configs = {
    /**
     * No description
     *
     * @tags Config
     * @name ConfigList
     * @summary List configs
     * @request GET:/configs
     */
    configList: (
      query?: {
        /**
         * A JSON encoded value of the filters (a `map[string][]string`) to
         * process on the configs list.
         *
         * Available filters:
         *
         * - `id=<config id>`
         * - `label=<key> or label=<key>=value`
         * - `name=<config name>`
         * - `names=<config name>`
         */
        filters?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<Config[], ErrorResponse>({
        path: `/configs`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Config
     * @name ConfigCreate
     * @summary Create a config
     * @request POST:/configs/create
     */
    configCreate: (body: ConfigSpec & object, params: RequestParams = {}) =>
      this.request<IdResponse, ErrorResponse>({
        path: `/configs/create`,
        method: "POST",
        body: body,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Config
     * @name ConfigInspect
     * @summary Inspect a config
     * @request GET:/configs/{id}
     */
    configInspect: (id: string, params: RequestParams = {}) =>
      this.request<Config, ErrorResponse>({
        path: `/configs/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Config
     * @name ConfigDelete
     * @summary Delete a config
     * @request DELETE:/configs/{id}
     */
    configDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, ErrorResponse>({
        path: `/configs/${id}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Config
     * @name ConfigUpdate
     * @summary Update a Config
     * @request POST:/configs/{id}/update
     */
    configUpdate: (
      id: string,
      query: {
        /**
         * The version number of the config object being updated. This is
         * required to avoid conflicting writes.
         * @format int64
         */
        version: number;
      },
      body: ConfigSpec,
      params: RequestParams = {},
    ) =>
      this.request<void, ErrorResponse>({
        path: `/configs/${id}/update`,
        method: "POST",
        query: query,
        body: body,
        type: ContentType.Json,
        ...params,
      }),
  };
  distribution = {
    /**
     * @description Return image digest and platform information by contacting the registry.
     *
     * @tags Distribution
     * @name DistributionInspect
     * @summary Get image information from the registry
     * @request GET:/distribution/{name}/json
     */
    distributionInspect: (name: string, params: RequestParams = {}) =>
      this.request<DistributionInspect, ErrorResponse>({
        path: `/distribution/${name}/json`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };
  session = {
    /**
     * @description Start a new interactive session with a server. Session allows server to call back to the client for advanced capabilities. ### Hijacking This endpoint hijacks the HTTP connection to HTTP2 transport that allows the client to expose gPRC services on that connection. For example, the client sends this request to upgrade the connection: ``` POST /session HTTP/1.1 Upgrade: h2c Connection: Upgrade ``` The Docker daemon responds with a `101 UPGRADED` response follow with the raw stream: ``` HTTP/1.1 101 UPGRADED Connection: Upgrade Upgrade: h2c ```
     *
     * @tags Session
     * @name Session
     * @summary Initialize interactive session
     * @request POST:/session
     */
    session: (params: RequestParams = {}) =>
      this.request<any, void | ErrorResponse>({
        path: `/session`,
        method: "POST",
        ...params,
      }),
  };
}
