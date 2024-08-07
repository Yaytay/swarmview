import { Check } from "./checks/checks";
import { Node, Task } from "./docker-schema";
import { nodeMemorylimit } from "./checks/node-checks/other/1.0.0-memory-limit";
import { swarmMemorylimit } from "./checks/node-checks/other/1.0.1-total-memory-limit";
import ChecksUi from "./ChecksUi";

interface NodeChecksProps {
  node: Node
  , nodes: Node[]
  , tasks: Task[]
}
function NodeChecks(props: NodeChecksProps) {

  const checks: Check[] = [
    nodeMemorylimit
    , swarmMemorylimit
  ]

  const args = {node: props.node, nodes: props.nodes, tasks: props.tasks}

  return (
    <ChecksUi id='node.checks' checks={checks} args={args} />
  )
}

export default NodeChecks