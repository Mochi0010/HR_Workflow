import { ReactFlowProvider } from '@xyflow/react';
import NodeSidebar from './components/canvas/NodeSidebar';
import WorkflowCanvas from './components/canvas/WorkflowCanvas';
import NodeFormPanel from './components/forms/NodeFormPanel';
import SandboxPanel from './components/sandbox/SandboxPanel';
import { useWorkflow } from './hooks/useWorkflow';
import { BoltIcon, TrashIcon } from './components/icons/Icons';
import './App.css';

function App() {
  const {
    nodes,
    edges,
    selectedNode,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onNodeClick,
    onPaneClick,
    addNode,
    updateNodeData,
    deleteNode,
    clearWorkflow,
    loadWorkflow,
  } = useWorkflow();

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-brand">
          <span className="brand-icon"><BoltIcon size={16} /></span>
          <h1>WorkflowStudio</h1>
        </div>
        <div className="header-center">
          <span className="header-title">HR Workflow Designer</span>
          <span className="header-subtitle">Design and test internal workflows</span>
        </div>
        <div className="header-actions">
          <span className="node-count">{nodes.length} nodes · {edges.length} edges</span>
          <button className="btn-ghost" onClick={clearWorkflow} disabled={nodes.length === 0}>
            <TrashIcon size={12} />
            <span>Clear</span>
          </button>
        </div>
      </header>

      <main className="app-main">
        <NodeSidebar />

        <div className="canvas-area">
          <WorkflowCanvas
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            addNode={addNode}
          />

          <SandboxPanel
            nodes={nodes}
            edges={edges}
            onLoadWorkflow={loadWorkflow}
          />
        </div>

        <NodeFormPanel
          selectedNode={selectedNode}
          onUpdateNodeData={updateNodeData}
          onDeleteNode={deleteNode}
        />
      </main>
    </div>
  );
}

export default function AppWrapper() {
  return (
    <ReactFlowProvider>
      <App />
    </ReactFlowProvider>
  );
}
