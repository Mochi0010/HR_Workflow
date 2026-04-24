// Mock API layer for HR Workflow Designer
// Simulates GET /automations and POST /simulate endpoints

const AUTOMATIONS = [
  {
    id: 'send_email',
    label: 'Send Email',
    params: ['to', 'subject'],
  },
  {
    id: 'generate_doc',
    label: 'Generate Document',
    params: ['template', 'recipient'],
  },
  {
    id: 'assign_badge',
    label: 'Assign Badge',
    params: ['badge_name', 'employee_id'],
  },
  {
    id: 'notify_slack',
    label: 'Notify Slack Channel',
    params: ['channel', 'message'],
  },
  {
    id: 'schedule_meeting',
    label: 'Schedule Meeting',
    params: ['title', 'attendees', 'date'],
  },
];

/**
 * GET /automations
 * Returns available automated actions
 */
export async function getAutomations() {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  return [...AUTOMATIONS];
}

/**
 * POST /simulate
 * Accepts a serialized workflow and returns step-by-step execution results
 */
export async function simulateWorkflow(workflowJson) {
  await new Promise((resolve) => setTimeout(resolve, 800));

  const { nodes, edges } = workflowJson;

  if (!nodes || nodes.length === 0) {
    return {
      success: false,
      error: 'No nodes in workflow',
      steps: [],
    };
  }

  // Build adjacency map
  const adjacency = {};
  edges.forEach((edge) => {
    if (!adjacency[edge.source]) adjacency[edge.source] = [];
    adjacency[edge.source].push(edge.target);
  });

  // Find start node
  const startNode = nodes.find((n) => n.type === 'startNode');
  if (!startNode) {
    return {
      success: false,
      error: 'No Start Node found',
      steps: [],
    };
  }

  // Walk the graph from start node (BFS)
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

    const stepResult = generateStepResult(node, stepNum);
    steps.push(stepResult);
    stepNum++;

    const nextNodes = adjacency[currentId] || [];
    nextNodes.forEach((nextId) => {
      if (!visited.has(nextId)) queue.push(nextId);
    });
  }

  return {
    success: true,
    totalSteps: steps.length,
    steps,
  };
}

function generateStepResult(node, stepNum) {
  const data = node.data || {};
  const title = data.label || data.title || `Step ${stepNum}`;

  const statusOptions = ['completed', 'completed', 'completed', 'pending'];
  const status = statusOptions[Math.floor(Math.random() * statusOptions.length)];

  const baseStep = {
    step: stepNum,
    nodeId: node.id,
    nodeType: node.type,
    title,
    status,
    timestamp: new Date(Date.now() + stepNum * 60000).toISOString(),
  };

  switch (node.type) {
    case 'startNode':
      return { ...baseStep, message: `Workflow started: "${title}"`, status: 'completed' };
    case 'taskNode':
      return {
        ...baseStep,
        message: `Task "${title}" assigned to ${data.assignee || 'Unassigned'}`,
        details: data.description || 'No description provided',
      };
    case 'approvalNode':
      return {
        ...baseStep,
        message: `Approval requested from ${data.approverRole || 'Manager'}`,
        details: `Auto-approve threshold: ${data.autoApproveThreshold || 'N/A'}`,
      };
    case 'automatedNode':
      return {
        ...baseStep,
        message: `Automated action executed: ${data.actionLabel || data.actionId || 'Unknown'}`,
        status: 'completed',
      };
    case 'endNode':
      return {
        ...baseStep,
        message: data.endMessage || 'Workflow completed',
        status: 'completed',
      };
    default:
      return { ...baseStep, message: `Executed: ${title}` };
  }
}
