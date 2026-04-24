import { Handle, Position } from '@xyflow/react';
import { PlayIcon } from '../icons/Icons';

export default function StartNode({ data, selected }) {
  return (
    <div className={`custom-node start-node ${selected ? 'selected' : ''}`}>
      <div className="node-header">
        <span className="node-icon"><PlayIcon size={14} color="#34a853" /></span>
        <span className="node-type-badge start">Start</span>
      </div>
      <div className="node-title">{data.label || 'Start'}</div>
      <div className="node-subtitle">Workflow entry point</div>
      {data.metadata && data.metadata.length > 0 && (
        <div className="node-stats">
          <span className="stat-badge green">{data.metadata.length} fields</span>
        </div>
      )}
      <Handle type="source" position={Position.Bottom} className="handle handle-source" />
    </div>
  );
}
