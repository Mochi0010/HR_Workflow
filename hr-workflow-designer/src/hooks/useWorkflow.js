import { useState, useCallback } from 'react';
import {
  useNodesState,
  useEdgesState,
  addEdge,
} from '@xyflow/react';
import { v4 as uuidv4 } from 'uuid';

const DEFAULT_NODE_DATA = {
  startNode: { label: 'Start', metadata: [] },
  taskNode: { label: 'New Task', description: '', assignee: '', dueDate: '', customFields: [] },
  approvalNode: { label: 'Approval', approverRole: 'Manager', autoApproveThreshold: '' },
  automatedNode: { label: 'Automated Step', actionId: '', actionLabel: '', actionParams: {} },
  endNode: { label: 'End', endMessage: 'Workflow completed', showSummary: false },
};

/**
 * Custom hook for managing the workflow canvas state
 * Provides nodes/edges state, CRUD operations, and selected node tracking
 */
export function useWorkflow() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  const onConnect = useCallback(
    (connection) => {
      setEdges((eds) =>
        addEdge(
          {
            ...connection,
            type: 'smoothstep',
            animated: true,
            style: { stroke: '#6366f1', strokeWidth: 2 },
          },
          eds
        )
      );
    },
    [setEdges]
  );

  const addNode = useCallback(
    (type, position) => {
      const id = uuidv4();
      const data = { ...(DEFAULT_NODE_DATA[type] || { label: 'Node' }) };
      const newNode = {
        id,
        type,
        position,
        data,
      };
      setNodes((nds) => [...nds, newNode]);
      return id;
    },
    [setNodes]
  );

  const updateNodeData = useCallback(
    (nodeId, newData) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, ...newData } }
            : node
        )
      );
    },
    [setNodes]
  );

  const deleteNode = useCallback(
    (nodeId) => {
      setNodes((nds) => nds.filter((n) => n.id !== nodeId));
      setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
      if (selectedNodeId === nodeId) setSelectedNodeId(null);
    },
    [setNodes, setEdges, selectedNodeId]
  );

  const onNodeClick = useCallback((_event, node) => {
    setSelectedNodeId(node.id);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, []);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || null;

  const clearWorkflow = useCallback(() => {
    setNodes([]);
    setEdges([]);
    setSelectedNodeId(null);
  }, [setNodes, setEdges]);

  const loadWorkflow = useCallback(
    (newNodes, newEdges) => {
      setNodes(newNodes);
      setEdges(newEdges);
      setSelectedNodeId(null);
    },
    [setNodes, setEdges]
  );

  return {
    nodes,
    edges,
    selectedNode,
    selectedNodeId,
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
    setNodes,
    setEdges,
  };
}
