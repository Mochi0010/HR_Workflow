import { Handle, Position } from '@xyflow/react';
import { ClipboardIcon } from '../icons/Icons';

export default function TaskNode({ data, selected }) {
  const fieldCount = (data.customFields?.length || 0) + (data.description ? 1 : 0);

  return (
    <div className={`custom-node task-node ${selected ? 'selected' : ''}`}>
      <Handle type="target" position={Position.Top} className="handle handle-target" />
      <div className="node-header">
        <span className="node-icon"><ClipboardIcon size={14} color="#4a90d9" /></span>
        <span className="node-type-badge task">Task</span>
      </div>
      <div className="node-title">{data.label || 'Task'}</div>
      <div className="node-subtitle">{data.description || 'Human task step'}</div>
      <div className="node-stats">
        {data.assignee && <span className="stat-badge blue">{data.assignee}</span>}
        {data.dueDate && <span className="stat-badge orange">{data.dueDate}</span>}
        {fieldCount > 0 && <span className="stat-badge green">{fieldCount} fields</span>}
      </div>
      <Handle type="source" position={Position.Bottom} className="handle handle-source" />
    </div>
  );
}
