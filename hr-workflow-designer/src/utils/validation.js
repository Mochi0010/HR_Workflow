// Workflow graph validation utilities

/**
 * Validates a workflow graph structure
 * @param {Array} nodes - React Flow nodes
 * @param {Array} edges - React Flow edges
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateWorkflow(nodes, edges) {
  const errors = [];

  if (!nodes || nodes.length === 0) {
    errors.push('Workflow is empty — add at least one node');
    return { valid: false, errors };
  }

  // Check for exactly one Start node
  const startNodes = nodes.filter((n) => n.type === 'startNode');
  if (startNodes.length === 0) {
    errors.push('Workflow must have a Start node');
  } else if (startNodes.length > 1) {
    errors.push('Workflow must have exactly one Start node');
  }

  // Check for exactly one End node
  const endNodes = nodes.filter((n) => n.type === 'endNode');
  if (endNodes.length === 0) {
    errors.push('Workflow must have an End node');
  } else if (endNodes.length > 1) {
    errors.push('Workflow must have exactly one End node');
  }

  // Build adjacency for connectivity check
  const adjacency = {};
  const reverseAdjacency = {};
  nodes.forEach((n) => {
    adjacency[n.id] = [];
    reverseAdjacency[n.id] = [];
  });
  edges.forEach((e) => {
    if (adjacency[e.source]) adjacency[e.source].push(e.target);
    if (reverseAdjacency[e.target]) reverseAdjacency[e.target].push(e.source);
  });

  // Check disconnected nodes
  nodes.forEach((node) => {
    if (node.type === 'startNode') {
      if (adjacency[node.id].length === 0) {
        errors.push(`Start node "${node.data?.label || node.id}" has no outgoing connections`);
      }
    } else if (node.type === 'endNode') {
      if (reverseAdjacency[node.id].length === 0) {
        errors.push(`End node "${node.data?.label || node.id}" has no incoming connections`);
      }
    } else {
      if (adjacency[node.id].length === 0 && reverseAdjacency[node.id].length === 0) {
        errors.push(`Node "${node.data?.label || node.id}" is disconnected`);
      }
    }
  });

  // Check for cycles using DFS
  if (hasCycle(nodes, adjacency)) {
    errors.push('Workflow contains a cycle — workflows must be acyclic');
  }

  // Check reachability from Start to End
  if (startNodes.length === 1 && endNodes.length === 1) {
    const reachable = getReachableNodes(startNodes[0].id, adjacency);
    if (!reachable.has(endNodes[0].id)) {
      errors.push('End node is not reachable from Start node');
    }

    // Check if there are unreachable nodes
    nodes.forEach((node) => {
      if (!reachable.has(node.id) && node.type !== 'startNode') {
        // Only warn, don't error
      }
    });
  }

  // Validate required fields per node type
  nodes.forEach((node) => {
    const data = node.data || {};
    switch (node.type) {
      case 'taskNode':
        if (!data.label || data.label.trim() === '') {
          errors.push(`Task node requires a title`);
        }
        break;
      case 'approvalNode':
        if (!data.label || data.label.trim() === '') {
          errors.push(`Approval node requires a title`);
        }
        break;
      default:
        break;
    }
  });

  return { valid: errors.length === 0, errors };
}

function hasCycle(nodes, adjacency) {
  const WHITE = 0, GRAY = 1, BLACK = 2;
  const color = {};
  nodes.forEach((n) => (color[n.id] = WHITE));

  function dfs(nodeId) {
    color[nodeId] = GRAY;
    for (const neighbor of adjacency[nodeId] || []) {
      if (color[neighbor] === GRAY) return true;
      if (color[neighbor] === WHITE && dfs(neighbor)) return true;
    }
    color[nodeId] = BLACK;
    return false;
  }

  for (const node of nodes) {
    if (color[node.id] === WHITE) {
      if (dfs(node.id)) return true;
    }
  }
  return false;
}

function getReachableNodes(startId, adjacency) {
  const visited = new Set();
  const queue = [startId];
  while (queue.length > 0) {
    const current = queue.shift();
    if (visited.has(current)) continue;
    visited.add(current);
    (adjacency[current] || []).forEach((n) => {
      if (!visited.has(n)) queue.push(n);
    });
  }
  return visited;
}
