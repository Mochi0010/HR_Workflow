import { Handle, Position } from '@xyflow/react';
import { StopCircleIcon } from '../icons/Icons';

export default function EndNode({ data, selected }) {
  return (
    <div className={`custom-node end-node ${selected ? 'selected' : ''}`}>
      <Handle type="target" position={Position.Top} className="handle handle-target" />
      <div className="node-header">
        <span className="node-icon"><StopCircleIcon size={14} color="#e74c3c" /></span>
        <span className="node-type-badge end">End</span>
      </div>
      <div className="node-title">{data.label || 'End'}</div>
      <div className="node-subtitle">{data.endMessage || 'Workflow completion'}</div>
      <div className="node-stats">
        {data.showSummary && <span className="stat-badge green">Summary</span>}
        <span className="stat-badge red">Terminal</span>
      </div>
    </div>
  );
}
