import StartNode from './StartNode';
import TaskNode from './TaskNode';
import ApprovalNode from './ApprovalNode';
import AutomatedNode from './AutomatedNode';
import EndNode from './EndNode';

const nodeTypes = {
  startNode: StartNode,
  taskNode: TaskNode,
  approvalNode: ApprovalNode,
  automatedNode: AutomatedNode,
  endNode: EndNode,
};

export const NODE_TYPE_DEFS = [
  { type: 'startNode', label: 'Start', iconType: 'play', color: '#34a853', description: 'Workflow entry point' },
  { type: 'taskNode', label: 'Task', iconType: 'clipboard', color: '#4a90d9', description: 'Human task step' },
  { type: 'approvalNode', label: 'Approval', iconType: 'check', color: '#f5a623', description: 'Manager approval' },
  { type: 'automatedNode', label: 'Automated', iconType: 'gear', color: '#7c5cfc', description: 'System action' },
  { type: 'endNode', label: 'End', iconType: 'stop', color: '#e74c3c', description: 'Workflow completion' },
];

export default nodeTypes;
