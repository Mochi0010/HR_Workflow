import { useCallback, useRef } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import nodeTypes from '../nodes/nodeTypes';

export default function WorkflowCanvas({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeClick,
  onPaneClick,
  addNode,
}) {
  const reactFlowWrapper = useRef(null);
  const reactFlowInstance = useRef(null);

  const onInit = useCallback((instance) => {
    reactFlowInstance.current = instance;
  }, []);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) return;

      const bounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = reactFlowInstance.current.screenToFlowPosition({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });

      addNode(type, position);
    },
    [addNode]
  );

  return (
    <div className="canvas-wrapper" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        onInit={onInit}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        fitView
        deleteKeyCode={['Backspace', 'Delete']}
        snapToGrid
        snapGrid={[16, 16]}
        connectionLineStyle={{ stroke: '#d0d0d8', strokeWidth: 1.5 }}
        defaultEdgeOptions={{
          type: 'smoothstep',
          animated: false,
          style: { stroke: '#c8c8d0', strokeWidth: 1.5 },
        }}
      >
        <Background color="#e0e0e4" gap={24} size={1} variant="dots" />
        <Controls
          className="flow-controls"
          showInteractive={false}
        />
        <MiniMap
          className="flow-minimap"
          nodeColor={(node) => {
            switch (node.type) {
              case 'startNode': return '#34a853';
              case 'taskNode': return '#4a90d9';
              case 'approvalNode': return '#f5a623';
              case 'automatedNode': return '#7c5cfc';
              case 'endNode': return '#e74c3c';
              default: return '#b0b0bc';
            }
          }}
          maskColor="rgba(247, 247, 248, 0.7)"
        />
      </ReactFlow>
    </div>
  );
}
