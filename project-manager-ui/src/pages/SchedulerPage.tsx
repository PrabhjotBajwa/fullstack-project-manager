import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

// This is the example JSON from the assignment PDF
const exampleJson = `{
  "tasks": [
    { "title": "Design API", "estimatedHours": 5, "dueDate": "2025-10-25", "dependencies": [] },
    { "title": "Implement Backend", "estimatedHours": 12, "dueDate": "2025-10-28", "dependencies": ["Design API"] },
    { "title": "Build Frontend", "estimatedHours": 10, "dueDate": "2025-10-30", "dependencies": ["Design API"] },
    { "title": "End-to-End Test", "estimatedHours": 8, "dueDate": "2025-10-31", "dependencies": ["Implement Backend", "Build Frontend"] }
  ]
}`;

const SchedulerPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [jsonInput, setJsonInput] = useState(exampleJson);
  const [recommendedOrder, setRecommendedOrder] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setRecommendedOrder([]);
    setLoading(true);

    let requestBody;
    try {
      // 1. Parse the JSON from the text area
      requestBody = JSON.parse(jsonInput);
    } catch (parseError) {
      setError('Invalid JSON format. Please check your input.');
      setLoading(false);
      return;
    }

    try {
      // 2. Call the Smart Scheduler API
      const response = await api.post(`/v1/projects/${projectId}/schedule`, requestBody);
      
      if (response.data.error) {
        // Handle logical errors (like cycles) from the API
        setError(response.data.error);
      } else {
        // Success! Set the recommended order
        setRecommendedOrder(response.data.recommendedOrder);
      }
    } catch (apiError: any) {
      setError(apiError.response?.data?.error || 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '800px' }}>
      <Link to={`/project/${projectId}`} className="btn btn-outline-secondary btn-sm mb-3">
        &larr; Back to Project
      </Link>
      
      <div className="card shadow-sm">
        <div className="card-body">
          <h2 className="card-title">Smart Scheduler</h2>
          <p className="card-text text-muted">
            Define your tasks and their dependencies in the JSON format below to get a recommended work order.
          </p>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="jsonInput" className="form-label">Task Definitions (JSON)</label>
              <textarea
                id="jsonInput"
                className="form-control"
                rows={12}
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Generating...' : 'Generate Schedule'}
            </button>
          </form>
          
          {/* --- Results Section --- */}
          {error && (
            <div className="alert alert-danger mt-4">
              <strong>Error:</strong> {error}
            </div>
          )}
          
          {recommendedOrder.length > 0 && (
            <div className="mt-4">
              <h4>Recommended Order:</h4>
              <ol className="list-group list-group-numbered">
                {recommendedOrder.map(taskTitle => (
                  <li key={taskTitle} className="list-group-item">{taskTitle}</li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SchedulerPage;