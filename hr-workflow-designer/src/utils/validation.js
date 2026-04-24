export function validateWorkflow(nodes, edges) {
  const errors = [];

  if (!nodes || nodes.length === 0) {
    errors.push('Workflow is empty — add at least one node');
    return { valid: false, errors };
  }

  const startNodes = nodes.filter((n) => n.type === 'startNode');
  if (startNodes.length === 0) errors.push('Workflow must have a Start node');
  else if (startNodes.length > 1) errors.push('Workflow must have exactly one Start node');

  const endNodes = nodes.filter((n) => n.type === 'endNode');
  if (endNodes.length === 0) errors.push('Workflow must have an End node');
  else if (endNodes.length > 1) errors.push('Workflow must have exactly one End node');

  const adjacency = {};
  const reverseAdj = {};
  nodes.forEach((n) => { adjacency[n.id] = []; reverseAdj[n.id] = []; });
  edges.forEach((e) => {
    if (adjacency[e.source]) adjacency[e.source].push(e.target);
    if (reverseAdj[e.target]) reverseAdj[e.target].push(e.source);
  });

  nodes.forEach((node) => {
    if (node.type === 'startNode') {
      if (adjacency[node.id].length === 0)
        errors.push(`Start node "${node.data?.label || node.id}" has no outgoing connections`);
    } else if (node.type === 'endNode') {
      if (reverseAdj[node.id].length === 0)
        errors.push(`End node "${node.data?.label || node.id}" has no incoming connections`);
    } else {
      if (adjacency[node.id].length === 0 && reverseAdj[node.id].length === 0)
        errors.push(`Node "${node.data?.label || node.id}" is disconnected`);
    }
  });

  if (hasCycle(nodes, adjacency))
    errors.push('Workflow contains a cycle — workflows must be acyclic');

  if (startNodes.length === 1 && endNodes.length === 1) {
    const reachable = getReachable(startNodes[0].id, adjacency);
    if (!reachable.has(endNodes[0].id))
      errors.push('End node is not reachable from Start node');
  }

  nodes.forEach((node) => {
    const d = node.data || {};
    if (node.type === 'taskNode' && (!d.label || !d.label.trim()))
      errors.push('Task node requires a title');
    if (node.type === 'approvalNode' && (!d.label || !d.label.trim()))
      errors.push('Approval node requires a title');
  });

  return { valid: errors.length === 0, errors };
}

function hasCycle(nodes, adjacency) {
  const W = 0, G = 1, B = 2;
  const color = {};
  nodes.forEach((n) => (color[n.id] = W));
  function dfs(id) {
    color[id] = G;
    for (const nb of adjacency[id] || []) {
      if (color[nb] === G) return true;
      if (color[nb] === W && dfs(nb)) return true;
    }
    color[id] = B;
    return false;
  }
  for (const n of nodes) if (color[n.id] === W && dfs(n.id)) return true;
  return false;
}

function getReachable(startId, adjacency) {
  const visited = new Set();
  const queue = [startId];
  while (queue.length > 0) {
    const c = queue.shift();
    if (visited.has(c)) continue;
    visited.add(c);
    (adjacency[c] || []).forEach((n) => { if (!visited.has(n)) queue.push(n); });
  }
  return visited;
}
