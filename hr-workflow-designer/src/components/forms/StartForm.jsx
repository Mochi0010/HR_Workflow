import { useState } from 'react';

export default function StartForm({ data, onUpdate }) {
  const [metadata, setMetadata] = useState(data.metadata || []);

  function handleTitleChange(e) {
    onUpdate({ label: e.target.value });
  }

  function addMetadataField() {
    const updated = [...metadata, { key: '', value: '' }];
    setMetadata(updated);
    onUpdate({ metadata: updated });
  }

  function updateMetadata(index, field, value) {
    const updated = metadata.map((m, i) =>
      i === index ? { ...m, [field]: value } : m
    );
    setMetadata(updated);
    onUpdate({ metadata: updated });
  }

  function removeMetadata(index) {
    const updated = metadata.filter((_, i) => i !== index);
    setMetadata(updated);
    onUpdate({ metadata: updated });
  }

  return (
    <div className="node-form">
      <div className="form-group">
        <label htmlFor="start-title">Start Title</label>
        <input
          id="start-title"
          type="text"
          value={data.label || ''}
          onChange={handleTitleChange}
          placeholder="e.g., Begin Onboarding"
        />
      </div>

      <div className="form-group">
        <label>Metadata (Key-Value Pairs)</label>
        {metadata.map((m, i) => (
          <div key={i} className="kv-row">
            <input
              type="text"
              value={m.key}
              onChange={(e) => updateMetadata(i, 'key', e.target.value)}
              placeholder="Key"
              className="kv-input"
            />
            <input
              type="text"
              value={m.value}
              onChange={(e) => updateMetadata(i, 'value', e.target.value)}
              placeholder="Value"
              className="kv-input"
            />
            <button
              type="button"
              className="btn-icon btn-danger"
              onClick={() => removeMetadata(i)}
              title="Remove"
            >
              ✕
            </button>
          </div>
        ))}
        <button type="button" className="btn-secondary btn-small" onClick={addMetadataField}>
          + Add Metadata
        </button>
      </div>
    </div>
  );
}
