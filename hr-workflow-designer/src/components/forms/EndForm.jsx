export default function EndForm({ data, onUpdate }) {
  return (
    <div className="node-form">
      <div className="form-group">
        <label htmlFor="end-message">End Message</label>
        <input
          id="end-message"
          type="text"
          value={data.endMessage || ''}
          onChange={(e) => onUpdate({ endMessage: e.target.value })}
          placeholder="e.g., Onboarding complete!"
        />
      </div>

      <div className="form-group">
        <label className="toggle-label" htmlFor="end-summary">
          <span>Show Summary</span>
          <div className="toggle-switch">
            <input
              id="end-summary"
              type="checkbox"
              checked={data.showSummary || false}
              onChange={(e) => onUpdate({ showSummary: e.target.checked })}
            />
            <span className="toggle-slider"></span>
          </div>
        </label>
        <span className="form-hint">Display a summary of all completed steps</span>
      </div>
    </div>
  );
}
