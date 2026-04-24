import StartForm from './StartForm';
import TaskForm from './TaskForm';
import ApprovalForm from './ApprovalForm';
import AutomatedForm from './AutomatedForm';
import EndForm from './EndForm';
import {
  PlayIcon,
  ClipboardIcon,
  CheckCircleIcon,
  GearIcon,
  StopCircleIcon,
  CursorIcon,
  TrashIcon,
} from '../icons/Icons';

const FORM_MAP = {
  startNode: { Component: StartForm, label: 'Start Node', color: '#22c55e', Icon: PlayIcon },
  taskNode: { Component: TaskForm, label: 'Task Node', color: '#3b82f6', Icon: ClipboardIcon },
  approvalNode: { Component: ApprovalForm, label: 'Approval Node', color: '#f59e0b', Icon: CheckCircleIcon },
  automatedNode: { Component: AutomatedForm, label: 'Automated Step', color: '#a855f7', Icon: GearIcon },
  endNode: { Component: EndForm, label: 'End Node', color: '#ef4444', Icon: StopCircleIcon },
};

export default function NodeFormPanel({ selectedNode, onUpdateNodeData, onDeleteNode }) {
  if (!selectedNode) {
    return (
      <div className="form-panel empty-panel">
        <div className="empty-state">
          <span className="empty-icon"><CursorIcon size={40} color="#475569" /></span>
          <h3>No Node Selected</h3>
          <p>Click on a node in the canvas to edit its properties</p>
        </div>
      </div>
    );
  }

  const formDef = FORM_MAP[selectedNode.type];
  if (!formDef) {
    return (
      <div className="form-panel">
        <p>Unknown node type: {selectedNode.type}</p>
      </div>
    );
  }

  const { Component: FormComponent, label, color, Icon } = formDef;

  function handleUpdate(newData) {
    onUpdateNodeData(selectedNode.id, newData);
  }

  return (
    <div className="form-panel">
      <div className="form-panel-header" style={{ borderLeftColor: color }}>
        <span className="form-panel-icon"><Icon size={20} color={color} /></span>
        <div>
          <h3 className="form-panel-title">{label}</h3>
          <span className="form-panel-id">ID: {selectedNode.id.slice(0, 8)}...</span>
        </div>
      </div>

      <div className="form-panel-body">
        <FormComponent data={selectedNode.data} onUpdate={handleUpdate} />
      </div>

      <div className="form-panel-footer">
        <button
          className="btn-danger-full"
          onClick={() => onDeleteNode(selectedNode.id)}
        >
          <TrashIcon size={14} />
          <span>Delete Node</span>
        </button>
      </div>
    </div>
  );
}
