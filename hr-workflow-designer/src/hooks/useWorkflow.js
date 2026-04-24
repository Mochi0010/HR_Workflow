import { useState, useCallback } from 'react';
import { useNodesState, useEdgesState, addEdge } from '@xyflow/react';
import { v4 as uuidv4 } from 'uuid';

const DEFAULT_DATA = {
  startNode: { label: 'Start', metadata: [] },
  taskNode: { label: 'New Task', description: '', assignee: '', dueDate: '', customFields: [] },
  approvalNode: { label: 'Approval', approverRole: 'Manager', autoApproveThreshold: '' },
  automatedNode: { label: 'Automated Step', actionId: '', actionLabel: '', actionParams: {} },
  endNode: { label: 'End', endMessage: 'Workflow completed', showSummary: false },
};

export function useWorkflow() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  const onConnect = useCallback((conn) => {
    setEdges((eds) => addEdge({ ...conn, type: 'smoothstep', style: { stroke: '#c8c8d0', strokeWidth: 1.5 } }, eds));
  }, [setEdges]);

  const addNode = useCallback((type, position) => {
    const id = uuidv4();
    setNodes((nds) => [...nds, { id, type, position, data: { ...(DEFAULT_DATA[type] || { label: 'Node' }) } }]);
    return id;
  }, [setNodes]);

  const updateNodeData = useCallback((nodeId, newData) => {
    setNodes((nds) => nds.map((n) => n.id === nodeId ? { ...n, data: { ...n.data, ...newData } } : n));
  }, [setNodes]);

  const deleteNode = useCallback((nodeId) => {
    setNodes((nds) => nds.filter((n) => n.id !== nodeId));
    setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
    if (selectedNodeId === nodeId) setSelectedNodeId(null);
  }, [setNodes, setEdges, selectedNodeId]);

  const onNodeClick = useCallback((_e, node) => setSelectedNodeId(node.id), []);
  const onPaneClick = useCallback(() => setSelectedNodeId(null), []);
  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || null;

  const clearWorkflow = useCallback(() => { setNodes([]); setEdges([]); setSelectedNodeId(null); }, [setNodes, setEdges]);
  const loadWorkflow = useCallback((n, e) => { setNodes(n); setEdges(e); setSelectedNodeId(null); }, [setNodes, setEdges]);

  return {
    nodes, edges, selectedNode, selectedNodeId,
    onNodesChange, onEdgesChange, onConnect, onNodeClick, onPaneClick,
    addNode, updateNodeData, deleteNode, clearWorkflow, loadWorkflow, setNodes, setEdges,
  };
}
