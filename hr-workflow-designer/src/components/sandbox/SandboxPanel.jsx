import { useState } from 'react';
import { validateWorkflow } from '../../utils/validation';
import { serializeWorkflow, downloadWorkflowJson } from '../../utils/serializer';
import { simulateWorkflow } from '../../api/mockApi';
import {
  FlaskIcon,
  XIcon,
  PlayIcon,
  SearchIcon,
  DownloadIcon,
  UploadIcon,
  AlertTriangleIcon,
  XCircleIcon,
  CheckIcon,
  ClockIcon,
  BarChartIcon,
  CodeIcon,
} from '../icons/Icons';

export default function SandboxPanel({ nodes, edges, onLoadWorkflow }) {
  const [isOpen, setIsOpen] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [results, setResults] = useState(null);
  const [validationErrors, setValidationErrors] = useState([]);
  const [activeTab, setActiveTab] = useState('simulate');

  async function handleSimulate() {
    const validation = validateWorkflow(nodes, edges);
    setValidationErrors(validation.errors);

    if (!validation.valid) {
      setResults(null);
      return;
    }

    setSimulating(true);
    try {
      const workflow = serializeWorkflow(nodes, edges);
      const result = await simulateWorkflow(workflow);
      setResults(result);
    } catch (err) {
      setResults({ success: false, error: err.message, steps: [] });
    } finally {
      setSimulating(false);
    }
  }

  function handleValidate() {
    const validation = validateWorkflow(nodes, edges);
    setValidationErrors(validation.errors);
    setResults(null);
  }

  function handleExport() {
    downloadWorkflowJson(nodes, edges);
  }

  function handleImport(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target.result);
        if (json.nodes && json.edges) {
          const restoredEdges = json.edges.map((edge) => ({
            ...edge,
            type: 'smoothstep',
            animated: true,
            style: { stroke: '#6366f1', strokeWidth: 2 },
          }));
          onLoadWorkflow(json.nodes, restoredEdges);
          setValidationErrors([]);
          setResults(null);
        }
      } catch (err) {
        setValidationErrors(['Failed to parse JSON file: ' + err.message]);
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  }

  function getStatusIcon(status) {
    switch (status) {
      case 'completed': return <CheckIcon size={14} color="#22c55e" />;
      case 'pending': return <ClockIcon size={14} color="#f59e0b" />;
      case 'failed': return <XCircleIcon size={14} color="#ef4444" />;
      default: return <ClockIcon size={14} color="#64748b" />;
    }
  }

  function getStatusClass(status) {
    switch (status) {
      case 'completed': return 'step-completed';
      case 'pending': return 'step-pending';
      case 'failed': return 'step-failed';
      default: return '';
    }
  }

  return (
    <>
      <button
        className="sandbox-toggle"
        onClick={() => setIsOpen(!isOpen)}
        title="Test Workflow"
      >
        {isOpen ? <XIcon size={14} /> : <FlaskIcon size={16} />}
        <span>{isOpen ? 'Close' : 'Sandbox'}</span>
      </button>

      {isOpen && (
        <div className="sandbox-panel">
          <div className="sandbox-header">
            <h3>Workflow Sandbox</h3>
            <div className="sandbox-tabs">
              <button
                className={`tab-btn ${activeTab === 'simulate' ? 'active' : ''}`}
                onClick={() => setActiveTab('simulate')}
              >
                Simulate
              </button>
              <button
                className={`tab-btn ${activeTab === 'validate' ? 'active' : ''}`}
                onClick={() => setActiveTab('validate')}
              >
                Validate
              </button>
              <button
                className={`tab-btn ${activeTab === 'export' ? 'active' : ''}`}
                onClick={() => setActiveTab('export')}
              >
                Export / Import
              </button>
            </div>
          </div>

          <div className="sandbox-body">
            {activeTab === 'simulate' && (
              <div className="simulate-tab">
                <button
                  className="btn-primary"
                  disabled={simulating || nodes.length === 0}
                  onClick={handleSimulate}
                >
                  {simulating ? (
                    <><span className="spinner"></span> Running simulation...</>
                  ) : (
                    <><PlayIcon size={14} color="#fff" /> Run Simulation</>
                  )}
                </button>

                {validationErrors.length > 0 && (
                  <div className="error-list">
                    <h4><AlertTriangleIcon size={14} color="#f59e0b" /> Validation Errors</h4>
                    {validationErrors.map((err, i) => (
                      <div key={i} className="error-item">{err}</div>
                    ))}
                  </div>
                )}

                {results && results.success && (
                  <div className="simulation-results">
                    <h4>Execution Log — {results.totalSteps} steps</h4>
                    <div className="steps-timeline">
                      {results.steps.map((step) => (
                        <div key={step.step} className={`step-item ${getStatusClass(step.status)}`}>
                          <div className="step-indicator">
                            <span className="step-status-icon">{getStatusIcon(step.status)}</span>
                            <div className="step-line"></div>
                          </div>
                          <div className="step-content">
                            <div className="step-header">
                              <span className="step-number">Step {step.step}</span>
                              <span className={`step-badge badge-${step.nodeType}`}>
                                {step.nodeType.replace('Node', '')}
                              </span>
                            </div>
                            <div className="step-title">{step.title}</div>
                            <div className="step-message">{step.message}</div>
                            {step.details && (
                              <div className="step-details">{step.details}</div>
                            )}
                            <div className="step-time">
                              {new Date(step.timestamp).toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {results && !results.success && (
                  <div className="error-list">
                    <h4><XCircleIcon size={14} color="#ef4444" /> Simulation Failed</h4>
                    <div className="error-item">{results.error}</div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'validate' && (
              <div className="validate-tab">
                <button className="btn-primary" onClick={handleValidate} disabled={nodes.length === 0}>
                  <SearchIcon size={14} color="#fff" /> Validate Workflow
                </button>

                {validationErrors.length > 0 ? (
                  <div className="error-list">
                    <h4><AlertTriangleIcon size={14} color="#f59e0b" /> Issues Found ({validationErrors.length})</h4>
                    {validationErrors.map((err, i) => (
                      <div key={i} className="error-item">{err}</div>
                    ))}
                  </div>
                ) : validationErrors.length === 0 && nodes.length > 0 ? (
                  <div className="success-message">
                    <CheckIcon size={16} color="#22c55e" />
                    <span>Workflow structure is valid</span>
                  </div>
                ) : null}

                <div className="workflow-stats">
                  <h4>Workflow Overview</h4>
                  <div className="stats-grid">
                    <div className="stat-item">
                      <span className="stat-value">{nodes.length}</span>
                      <span className="stat-label">Nodes</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-value">{edges.length}</span>
                      <span className="stat-label">Connections</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-value">{nodes.filter(n => n.type === 'taskNode').length}</span>
                      <span className="stat-label">Tasks</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-value">{nodes.filter(n => n.type === 'approvalNode').length}</span>
                      <span className="stat-label">Approvals</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'export' && (
              <div className="export-tab">
                <button className="btn-primary" onClick={handleExport} disabled={nodes.length === 0}>
                  <DownloadIcon size={14} color="#fff" /> Export as JSON
                </button>
                <div className="import-section">
                  <label className="btn-secondary import-label" htmlFor="import-file">
                    <UploadIcon size={14} /> Import JSON
                  </label>
                  <input
                    id="import-file"
                    type="file"
                    accept=".json"
                    onChange={handleImport}
                    className="import-input"
                  />
                </div>

                {nodes.length > 0 && (
                  <div className="json-preview">
                    <h4><CodeIcon size={14} /> Workflow JSON Preview</h4>
                    <pre>{JSON.stringify(serializeWorkflow(nodes, edges), null, 2)}</pre>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
