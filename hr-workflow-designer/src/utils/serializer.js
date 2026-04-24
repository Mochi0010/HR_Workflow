export function serializeWorkflow(nodes, edges) {
  return {
    version: '1.0',
    name: 'HR Workflow',
    createdAt: new Date().toISOString(),
    nodes: nodes.map((n) => ({ id: n.id, type: n.type, position: { x: n.position.x, y: n.position.y }, data: { ...n.data } })),
    edges: edges.map((e) => ({ id: e.id, source: e.source, target: e.target, sourceHandle: e.sourceHandle || null, targetHandle: e.targetHandle || null })),
  };
}

export function deserializeWorkflow(json) {
  if (!json || !json.nodes || !json.edges) throw new Error('Invalid workflow JSON');
  return {
    nodes: json.nodes.map((n) => ({ id: n.id, type: n.type, position: n.position, data: { ...n.data } })),
    edges: json.edges.map((e) => ({ id: e.id, source: e.source, target: e.target, sourceHandle: e.sourceHandle, targetHandle: e.targetHandle, type: 'smoothstep' })),
  };
}

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
