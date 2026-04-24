import { NODE_TYPE_DEFS } from '../nodes/nodeTypes';
import {
  PlayIcon,
  ClipboardIcon,
  CheckCircleIcon,
  GearIcon,
  StopCircleIcon,
  InfoIcon,
} from '../icons/Icons';

const ICON_MAP = {
  play: PlayIcon,
  clipboard: ClipboardIcon,
  check: CheckCircleIcon,
  gear: GearIcon,
  stop: StopCircleIcon,
};

export default function NodeSidebar() {
  function onDragStart(event, nodeType) {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  }

  return (
    <div className="node-sidebar">
      <div className="sidebar-header">
        <h2>Nodes</h2>
        <p className="sidebar-hint">Drag nodes onto the canvas</p>
      </div>

      <div className="sidebar-nodes">
        {NODE_TYPE_DEFS.map((def) => {
          const IconComponent = ICON_MAP[def.iconType];
          return (
            <div
              key={def.type}
              className="sidebar-node-item"
              draggable
              onDragStart={(e) => onDragStart(e, def.type)}
              style={{ '--node-accent': def.color }}
            >
              <div className="sidebar-node-icon">
                {IconComponent && <IconComponent size={18} color={def.color} />}
              </div>
              <div className="sidebar-node-info">
                <span className="sidebar-node-label">{def.label}</span>
                <span className="sidebar-node-desc">{def.description}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="sidebar-footer">
        <div className="sidebar-tip">
          <span className="tip-icon"><InfoIcon size={14} color="#64748b" /></span>
          <span>Connect nodes by dragging between handles</span>
        </div>
      </div>
    </div>
  );
}
