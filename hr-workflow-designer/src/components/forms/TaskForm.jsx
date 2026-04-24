import { useState } from 'react';

export default function TaskForm({ data, onUpdate }) {
  const [customFields, setCustomFields] = useState(data.customFields || []);

  function handleChange(field, value) {
    onUpdate({ [field]: value });
  }

  function addCustomField() {
    const updated = [...customFields, { key: '', value: '' }];
    setCustomFields(updated);
    onUpdate({ customFields: updated });
  }

  function updateCustomField(index, field, value) {
    const updated = customFields.map((cf, i) =>
      i === index ? { ...cf, [field]: value } : cf
    );
    setCustomFields(updated);
    onUpdate({ customFields: updated });
  }

  function removeCustomField(index) {
    const updated = customFields.filter((_, i) => i !== index);
    setCustomFields(updated);
    onUpdate({ customFields: updated });
  }

  return (
    <div className="node-form">
      <div className="form-group">
        <label htmlFor="task-title">
          Title <span className="required">*</span>
        </label>
        <input
          id="task-title"
          type="text"
          value={data.label || ''}
          onChange={(e) => handleChange('label', e.target.value)}
          placeholder="e.g., Collect Documents"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="task-description">Description</label>
        <textarea
          id="task-description"
          value={data.description || ''}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Describe the task..."
          rows={3}
        />
      </div>

      <div className="form-group">
        <label htmlFor="task-assignee">Assignee</label>
        <input
          id="task-assignee"
          type="text"
          value={data.assignee || ''}
          onChange={(e) => handleChange('assignee', e.target.value)}
          placeholder="e.g., John Doe"
        />
      </div>

      <div className="form-group">
        <label htmlFor="task-duedate">Due Date</label>
        <input
          id="task-duedate"
          type="date"
          value={data.dueDate || ''}
          onChange={(e) => handleChange('dueDate', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Custom Fields (Key-Value)</label>
        {customFields.map((cf, i) => (
          <div key={i} className="kv-row">
            <input
              type="text"
              value={cf.key}
              onChange={(e) => updateCustomField(i, 'key', e.target.value)}
              placeholder="Key"
              className="kv-input"
            />
            <input
              type="text"
              value={cf.value}
              onChange={(e) => updateCustomField(i, 'value', e.target.value)}
              placeholder="Value"
              className="kv-input"
            />
            <button
              type="button"
              className="btn-icon btn-danger"
              onClick={() => removeCustomField(i)}
              title="Remove"
            >
              ✕
            </button>
          </div>
        ))}
        <button type="button" className="btn-secondary btn-small" onClick={addCustomField}>
          + Add Custom Field
        </button>
      </div>
    </div>
  );
}
