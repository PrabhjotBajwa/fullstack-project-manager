import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

interface Project {
  id: string;
  title: string;
  description: string;
  taskCount: number;
}

const DashboardPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await api.get('/projects');
      setProjects(response.data);
    } catch (err) {
      setError('Failed to fetch projects.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/projects', { title, description });
      setProjects([response.data, ...projects]);
      setTitle('');
      setDescription('');
    } catch (err) {
      setError('Failed to create project.');
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this project and all its tasks?')) {
      try {
        await api.delete(`/projects/${id}`);
        setProjects(projects.filter(p => p.id !== id));
      } catch (err) {
        setError('Failed to delete project.');
      }
    }
  };

  return (
    <div className="container">
      <div className="row">
        {/* Create Project Form */}
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h4 className="card-title">Create New Project</h4>
              <form onSubmit={handleCreateProject}>
                <div className="mb-3">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description (Optional)</label>
                  <textarea
                    className="form-control"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">Create</button>
              </form>
            </div>
          </div>
        </div>

        {/* Project List */}
        <div className="col-md-8">
          <h2>Your Projects</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          {loading ? <LoadingSpinner /> : (
            <div className="list-group shadow-sm">
              {projects.length === 0 ? (
                <p className="list-group-item">You have no projects. Create one to get started!</p>
              ) : (
                projects.map(project => (
                  <div key={project.id} className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                    <Link to={`/project/${project.id}`} className="text-decoration-none text-dark w-100">
                      <h5 className="mb-1">{project.title}</h5>
                      <p className="mb-1 text-muted">{project.description || 'No description'}</p>
                      <small>{project.taskCount} task(s)</small>
                    </Link>
                    <button 
                      className="btn btn-sm btn-outline-danger ms-3"
                      onClick={() => handleDeleteProject(project.id)}
                    >
                      Delete
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;