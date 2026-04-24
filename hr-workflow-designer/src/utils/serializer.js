// Workflow serialization/deserialization utilities

/**
 * Serialize workflow graph to a clean JSON format for API consumption
 */
export function serializeWorkflow(nodes, edges) {
  const serializedNodes = nodes.map((node) => ({
    id: node.id,
    type: node.type,
    position: { x: node.position.x, y: node.position.y },
    data: { ...node.data },
  }));

  const serializedEdges = edges.map((edge) => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    sourceHandle: edge.sourceHandle || null,
    targetHandle: edge.targetHandle || null,
  }));

  return {
    version: '1.0',
    name: 'HR Workflow',
    createdAt: new Date().toISOString(),
    nodes: serializedNodes,
    edges: serializedEdges,
  };
}

/**
 * Deserialize a workflow JSON back to React Flow nodes/edges
 */
export function deserializeWorkflow(json) {
  if (!json || !json.nodes || !json.edges) {
    throw new Error('Invalid workflow JSON format');
  }

  const nodes = json.nodes.map((node) => ({
    id: node.id,
    type: node.type,
    position: node.position,
    data: { ...node.data },
  }));

  const edges = json.edges.map((edge) => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    sourceHandle: edge.sourceHandle,
    targetHandle: edge.targetHandle,
    type: 'smoothstep',
    animated: true,
  }));

  return { nodes, edges };
}

/**
 * Export workflow as downloadable JSON file
 */
export function downloadWorkflowJson(nodes, edges, filename = 'workflow.json') {
  const data = serializeWorkflow(nodes, edges);
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
