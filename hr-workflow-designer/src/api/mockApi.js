const AUTOMATIONS = [
  { id: 'send_email', label: 'Send Email', params: ['to', 'subject'] },
  { id: 'generate_doc', label: 'Generate Document', params: ['template', 'recipient'] },
  { id: 'assign_badge', label: 'Assign Badge', params: ['badge_name', 'employee_id'] },
  { id: 'notify_slack', label: 'Notify Slack Channel', params: ['channel', 'message'] },
  { id: 'schedule_meeting', label: 'Schedule Meeting', params: ['title', 'attendees', 'date'] },
];

export async function getAutomations() {
  await new Promise((r) => setTimeout(r, 300));
  return [...AUTOMATIONS];
}

export async function simulateWorkflow(workflowJson) {
  await new Promise((r) => setTimeout(r, 800));
  const { nodes, edges } = workflowJson;

  if (!nodes || nodes.length === 0)
    return { success: false, error: 'No nodes in workflow', steps: [] };

  const adjacency = {};
  edges.forEach((e) => {
    if (!adjacency[e.source]) adjacency[e.source] = [];
    adjacency[e.source].push(e.target);
  });

  const startNode = nodes.find((n) => n.type === 'startNode');
  if (!startNode)
    return { success: false, error: 'No Start Node found', steps: [] };

  const visited = new Set();
  const queue = [startNode.id];
  const steps = [];
  let stepNum = 1;

  while (queue.length > 0) {
    const currentId = queue.shift();
    if (visited.has(currentId)) continue;
    visited.add(currentId);
    const node = nodes.find((n) => n.id === currentId);
    if (!node) continue;
    steps.push(generateStepResult(node, stepNum));
    stepNum++;
    (adjacency[currentId] || []).forEach((id) => {
      if (!visited.has(id)) queue.push(id);
    });
  }

  return { success: true, totalSteps: steps.length, steps };
}

function generateStepResult(node, stepNum) {
  const data = node.data || {};
  const title = data.label || data.title || `Step ${stepNum}`;
  const statusOpts = ['completed', 'completed', 'completed', 'pending'];
  const status = statusOpts[Math.floor(Math.random() * statusOpts.length)];
  const base = {
    step: stepNum,
    nodeId: node.id,
    nodeType: node.type,
    title,
    status,
    timestamp: new Date(Date.now() + stepNum * 60000).toISOString(),
  };

  switch (node.type) {
    case 'startNode':
      return { ...base, message: `Workflow started: "${title}"`, status: 'completed' };
    case 'taskNode':
      return { ...base, message: `Task "${title}" assigned to ${data.assignee || 'Unassigned'}`, details: data.description || '' };
    case 'approvalNode':
      return { ...base, message: `Approval requested from ${data.approverRole || 'Manager'}`, details: `Auto-approve threshold: ${data.autoApproveThreshold || 'N/A'}` };
    case 'automatedNode':
      return { ...base, message: `Executed: ${data.actionLabel || data.actionId || 'Unknown'}`, status: 'completed' };
    case 'endNode':
      return { ...base, message: data.endMessage || 'Workflow completed', status: 'completed' };
    default:
      return { ...base, message: `Executed: ${title}` };
  }
}
