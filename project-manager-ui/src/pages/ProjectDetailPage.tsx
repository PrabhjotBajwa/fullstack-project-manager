import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

interface Task {
  id: string;
  title: string;
  isCompleted: boolean;
  dueDate: string | null;
}

interface ProjectDetails {
  id: string;
  title: string;
  description: string;
  tasks: Task[];
}

const ProjectDetailPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProject = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(`/projects/${projectId}`);
      setProject(response.data);
    } catch (err) {
      setError('Failed to fetch project details.');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !project) return;
    try {
      const response = await api.post(`/projects/${project.id}/tasks`, { title: newTaskTitle });
      setProject({
        ...project,
        tasks: [...project.tasks, response.data]
      });
      setNewTaskTitle('');
    } catch (err) {
      setError('Failed to add task.');
    }
  };

  const handleToggleTask = async (task: Task) => {
    if (!project) return;
    const updatedTask = { ...task, isCompleted: !task.isCompleted };
    try {
      await api.put(`/tasks/${task.id}`, updatedTask);
      setProject({
        ...project,
        tasks: project.tasks.map(t => (t.id === task.id ? updatedTask : t))
      });
    } catch (err) {
      setError('Failed to update task.');
    }
  };
  
  const handleDeleteTask = async (taskId: string) => {
    if (!project) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      setProject({
        ...project,
        tasks: project.tasks.filter(t => t.id !== taskId)
      });
    } catch (err) {
      setError('Failed to delete task.');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="container alert alert-danger">{error}</div>;
  if (!project) return <div className="container">Project not found.</div>;

  return (
    <div className="container" style={{ maxWidth: '800px' }}>
      
      {/* --- MODIFY THIS BLOCK --- */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Link to="/dashboard" className="btn btn-outline-secondary btn-sm">
          &larr; Back to Dashboard
        </Link>
        
        {/* --- ADD THIS BUTTON --- */}
        <Link to={`/project/${projectId}/schedule`} className="btn btn-info">
          Smart Scheduler
        </Link>
      </div>
      {/* --- END OF MODIFICATION --- */}

      <div className="card shadow-sm">
        <div className="card-body">
          <h2 className="card-title">{project.title}</h2>
          <p className="text-muted">{project.description}</p>
          
          <hr />
          
          <h4>Tasks</h4>
          
          {/* Add Task Form */}
          <form onSubmit={handleAddTask} className="mb-3">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Enter new task title..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-primary">Add Task</button>
            </div>
          </form>
          
          {/* Task List */}
          <ul className="list-group">
            {project.tasks.length === 0 ? (
              <li className="list-group-item">No tasks for this project yet.</li>
            ) : (
              project.tasks.map(task => (
                <li key={task.id} className="list-group-item d-flex justify-content-between align-items-center">
                  <span 
                    onClick={() => handleToggleTask(task)}
                    style={{ 
                      cursor: 'pointer',
                      textDecoration: task.isCompleted ? 'line-through' : 'none' 
                    }}
                  >
                    {task.title}
                  </span>
                  <button 
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDeleteTask(task.id)}
                  >
                    Delete
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;