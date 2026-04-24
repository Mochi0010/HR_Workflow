import { useAutomations } from '../../hooks/useAutomations';

export default function AutomatedForm({ data, onUpdate }) {
  const { automations, loading } = useAutomations();

  function handleActionChange(e) {
    const actionId = e.target.value;
    const action = automations.find((a) => a.id === actionId);
    // Reset params when action changes
    const newParams = {};
    if (action) {
      action.params.forEach((p) => (newParams[p] = ''));
    }
    onUpdate({
      actionId,
      actionLabel: action ? action.label : '',
      actionParams: newParams,
    });
  }

  function handleParamChange(paramName, value) {
    onUpdate({
      actionParams: { ...data.actionParams, [paramName]: value },
    });
  }

  const selectedAction = automations.find((a) => a.id === data.actionId);

  return (
    <div className="node-form">
      <div className="form-group">
        <label htmlFor="auto-title">Title</label>
        <input
          id="auto-title"
          type="text"
          value={data.label || ''}
          onChange={(e) => onUpdate({ label: e.target.value })}
          placeholder="e.g., Send Welcome Email"
        />
      </div>

      <div className="form-group">
        <label htmlFor="auto-action">Action</label>
        {loading ? (
          <div className="loading-text">Loading actions...</div>
        ) : (
          <select
            id="auto-action"
            value={data.actionId || ''}
            onChange={handleActionChange}
          >
            <option value="">— Select an action —</option>
            {automations.map((action) => (
              <option key={action.id} value={action.id}>
                {action.label}
              </option>
            ))}
          </select>
        )}
      </div>

      {selectedAction && (
        <div className="form-group">
          <label>Action Parameters</label>
          <div className="params-group">
            {selectedAction.params.map((param) => (
              <div key={param} className="param-row">
                <label htmlFor={`param-${param}`} className="param-label">
                  {param}
                </label>
                <input
                  id={`param-${param}`}
                  type="text"
                  value={(data.actionParams && data.actionParams[param]) || ''}
                  onChange={(e) => handleParamChange(param, e.target.value)}
                  placeholder={`Enter ${param}`}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
