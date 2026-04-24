import { Handle, Position } from '@xyflow/react';
import { CheckCircleIcon } from '../icons/Icons';

export default function ApprovalNode({ data, selected }) {
  return (
    <div className={`custom-node approval-node ${selected ? 'selected' : ''}`}>
      <Handle type="target" position={Position.Top} className="handle handle-target" />
      <div className="node-header">
        <span className="node-icon"><CheckCircleIcon size={14} color="#f5a623" /></span>
        <span className="node-type-badge approval">Approval</span>
      </div>
      <div className="node-title">{data.label || 'Approval'}</div>
      <div className="node-subtitle">Manager approval step</div>
      <div className="node-stats">
        {data.approverRole && <span className="stat-badge orange">{data.approverRole}</span>}
        {data.autoApproveThreshold && (
          <span className="stat-badge green">≤ {data.autoApproveThreshold}</span>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} className="handle handle-source" />
    </div>
  );
}
