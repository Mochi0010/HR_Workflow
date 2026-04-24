import { Handle, Position } from '@xyflow/react';
import { GearIcon } from '../icons/Icons';

export default function AutomatedNode({ data, selected }) {
  const paramCount = data.actionParams ? Object.keys(data.actionParams).filter(k => data.actionParams[k]).length : 0;

  return (
    <div className={`custom-node automated-node ${selected ? 'selected' : ''}`}>
      <Handle type="target" position={Position.Top} className="handle handle-target" />
      <div className="node-header">
        <span className="node-icon"><GearIcon size={14} color="#7c5cfc" /></span>
        <span className="node-type-badge automated">Auto</span>
      </div>
      <div className="node-title">{data.label || 'Automated Step'}</div>
      <div className="node-subtitle">{data.actionLabel || 'System action step'}</div>
      <div className="node-stats">
        {data.actionLabel && <span className="stat-badge blue">{data.actionId}</span>}
        {paramCount > 0 && <span className="stat-badge green">{paramCount} params</span>}
      </div>
      <Handle type="source" position={Position.Bottom} className="handle handle-source" />
    </div>
  );
}
