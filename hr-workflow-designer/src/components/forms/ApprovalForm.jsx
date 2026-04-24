export default function ApprovalForm({ data, onUpdate }) {
  function handleChange(field, value) {
    onUpdate({ [field]: value });
  }

  return (
    <div className="node-form">
      <div className="form-group">
        <label htmlFor="approval-title">Title</label>
        <input
          id="approval-title"
          type="text"
          value={data.label || ''}
          onChange={(e) => handleChange('label', e.target.value)}
          placeholder="e.g., Manager Approval"
        />
      </div>

      <div className="form-group">
        <label htmlFor="approval-role">Approver Role</label>
        <select
          id="approval-role"
          value={data.approverRole || 'Manager'}
          onChange={(e) => handleChange('approverRole', e.target.value)}
        >
          <option value="Manager">Manager</option>
          <option value="HRBP">HRBP</option>
          <option value="Director">Director</option>
          <option value="VP">VP</option>
          <option value="CEO">CEO</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="approval-threshold">Auto-Approve Threshold</label>
        <input
          id="approval-threshold"
          type="number"
          min="0"
          value={data.autoApproveThreshold || ''}
          onChange={(e) => handleChange('autoApproveThreshold', e.target.value)}
          placeholder="e.g., 5000"
        />
        <span className="form-hint">Auto-approve if value is at or below this threshold</span>
      </div>
    </div>
  );
}
