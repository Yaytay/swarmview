import { Check } from "./checks/checks";
import { Node, Task } from "./docker-schema";
import { other_1_0_0_nodeMemorylimit } from "./checks/node-checks/other/1.0.0-memory-limit";
import { other_1_0_1_swarmMemorylimit } from "./checks/node-checks/other/1.0.1-total-memory-limit";
import ChecksUi from "./ChecksUi";

interface NodeChecksProps {
  node: Node
  , nodes: Node[]
  , tasks: Task[]
}
function NodeChecks(props: NodeChecksProps) {

  const checks: Check[] = [
    other_1_0_0_nodeMemorylimit
    , other_1_0_1_swarmMemorylimit
  ]

  const args = {node: props.node, nodes: props.nodes, tasks: props.tasks}

  return (
    <ChecksUi id='node.checks' checks={checks} suppressionLabel={args.node?.Spec?.Labels?.['swarmview.suppress']} args={args} />
  )
}

export default NodeChecks