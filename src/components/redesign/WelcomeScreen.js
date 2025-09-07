import React, { useState, useRef } from 'react';
import { FileText, Upload, Plus, Clock, BookOpen, Award, ArrowRight, Folder } from 'lucide-react';

function WelcomeScreen({ onStart, onLoadProject }) {
  const [showNewProject, setShowNewProject] = useState(false);
  const [projectInfo, setProjectInfo] = useState({
    name: '',
    subject: '',
    class: '',
    totalMarks: '',
    duration: '',
    instructions: ''
  });
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  const recentProjects = JSON.parse(localStorage.getItem('qpg_recent_projects') || '[]');

  const validateForm = () => {
    const newErrors = {};
    if (!projectInfo.name.trim()) newErrors.name = 'Project name is required';
    if (!projectInfo.subject.trim()) newErrors.subject = 'Subject is required';
    if (!projectInfo.class.trim()) newErrors.class = 'Class/Grade is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateProject = () => {
    if (validateForm()) {
      // Save to recent projects
      const recent = JSON.parse(localStorage.getItem('qpg_recent_projects') || '[]');
      const newProject = {
        ...projectInfo,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString()
      };
      recent.unshift(newProject);
      if (recent.length > 5) recent.pop();
      localStorage.setItem('qpg_recent_projects', JSON.stringify(recent));
      
      onStart(projectInfo);
    }
  };

  const handleLoadFile = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        onLoadProject(data);
      } catch (error) {
        alert('Invalid file format. Please select a valid QPG file.');
      }
    };
    reader.readAsText(file);
  };

  const handleInputChange = (field, value) => {
    setProjectInfo({ ...projectInfo, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  if (showNewProject) {
    return (
      <div className="welcome-container" style={{ maxWidth: '600px', width: '100%' }}>
        <div className="card glass" style={{ animation: 'slideIn 0.3s ease' }}>
          <div className="card-header">
            <button 
              onClick={() => setShowNewProject(false)}
              className="btn btn-ghost btn-sm mb-4"
            >
              ← Back
            </button>
            <h2 className="text-2xl font-bold text-primary">New Question Paper</h2>
            <p className="text-muted mt-2">Enter basic information about your question paper</p>
          </div>
          
          <div className="card-body">
            <form onSubmit={(e) => { e.preventDefault(); handleCreateProject(); }}>
              <div className="grid grid-cols-2 gap-4">
                <div className="input-group" style={{ gridColumn: 'span 2' }}>
                  <label className="input-label">
                    Paper Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`input-field ${errors.name ? 'input-error' : ''}`}
                    placeholder="e.g., Mid-Term Examination 2024"
                    value={projectInfo.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                  {errors.name && <div className="input-error-message">{errors.name}</div>}
                </div>

                <div className="input-group">
                  <label className="input-label">
                    Subject <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`input-field ${errors.subject ? 'input-error' : ''}`}
                    placeholder="e.g., Mathematics"
                    value={projectInfo.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                  />
                  {errors.subject && <div className="input-error-message">{errors.subject}</div>}
                </div>

                <div className="input-group">
                  <label className="input-label">
                    Class/Grade <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`input-field ${errors.class ? 'input-error' : ''}`}
                    placeholder="e.g., Grade 10"
                    value={projectInfo.class}
                    onChange={(e) => handleInputChange('class', e.target.value)}
                  />
                  {errors.class && <div className="input-error-message">{errors.class}</div>}
                </div>

                <div className="input-group">
                  <label className="input-label">Total Marks</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g., 100"
                    value={projectInfo.totalMarks}
                    onChange={(e) => handleInputChange('totalMarks', e.target.value)}
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Duration</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g., 3 Hours"
                    value={projectInfo.duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                  />
                </div>

                <div className="input-group" style={{ gridColumn: 'span 2' }}>
                  <label className="input-label">Instructions (Optional)</label>
                  <textarea
                    className="input-field"
                    rows="3"
                    placeholder="Enter general instructions for students..."
                    value={projectInfo.instructions}
                    onChange={(e) => handleInputChange('instructions', e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={() => setShowNewProject(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                >
                  Create Project
                  <ArrowRight size={20} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="welcome-container" style={{ maxWidth: '900px', width: '100%' }}>
      <div className="text-center mb-6">
        <div className="flex justify-center mb-4">
          <div className="p-4 rounded-full bg-white shadow-lg">
            <FileText size={48} className="text-primary" />
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-2">Question Paper Generator</h1>
        <p className="text-muted">Professional question papers made easy</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div
          onClick={() => setShowNewProject(true)}
          className="card glass cursor-pointer hover:scale-105 transition-transform"
          style={{ minHeight: '200px' }}
        >
          <div className="card-body flex flex-col items-center justify-center text-center">
            <div className="p-3 rounded-full bg-primary bg-opacity-10 mb-3">
              <Plus size={32} className="text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Create New</h3>
            <p className="text-sm text-muted">Start a new question paper from scratch</p>
          </div>
        </div>

        <div
          onClick={() => fileInputRef.current?.click()}
          className="card glass cursor-pointer hover:scale-105 transition-transform"
          style={{ minHeight: '200px' }}
        >
          <div className="card-body flex flex-col items-center justify-center text-center">
            <div className="p-3 rounded-full bg-secondary bg-opacity-10 mb-3">
              <Upload size={32} className="text-secondary" />
            </div>
            <h3 className="font-semibold mb-2">Load Project</h3>
            <p className="text-sm text-muted">Continue working on existing paper</p>
          </div>
        </div>

        <div className="card glass" style={{ minHeight: '200px', opacity: 0.7 }}>
          <div className="card-body flex flex-col items-center justify-center text-center">
            <div className="p-3 rounded-full bg-gray-100 mb-3">
              <Folder size={32} className="text-gray-400" />
            </div>
            <h3 className="font-semibold mb-2 text-gray-500">Templates</h3>
            <p className="text-sm text-gray-400">Coming soon...</p>
          </div>
        </div>
      </div>

      {recentProjects.length > 0 && (
        <div className="card glass">
          <div className="card-header">
            <h3 className="font-semibold flex items-center gap-2">
              <Clock size={20} />
              Recent Projects
            </h3>
          </div>
          <div className="card-body p-0">
            {recentProjects.slice(0, 3).map((project, index) => (
              <div
                key={project.id || index}
                onClick={() => onLoadProject(project)}
                className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded bg-primary bg-opacity-10">
                    <BookOpen size={20} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{project.name}</h4>
                    <p className="text-sm text-muted">
                      {project.subject} • {project.class} • 
                      {project.questions?.length || 0} questions
                    </p>
                  </div>
                </div>
                <div className="text-sm text-muted">
                  {new Date(project.lastModified || project.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept=".qpg,.json"
        onChange={handleLoadFile}
        className="hidden"
      />

      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="card p-4 text-center">
          <Award size={24} className="text-warning mx-auto mb-2" />
          <h4 className="font-semibold text-sm mb-1">Professional</h4>
          <p className="text-xs text-muted">Export-ready formats</p>
        </div>
        <div className="card p-4 text-center">
          <Clock size={24} className="text-info mx-auto mb-2" />
          <h4 className="font-semibold text-sm mb-1">Save Time</h4>
          <p className="text-xs text-muted">Quick and efficient</p>
        </div>
        <div className="card p-4 text-center">
          <BookOpen size={24} className="text-secondary mx-auto mb-2" />
          <h4 className="font-semibold text-sm mb-1">Multi-Language</h4>
          <p className="text-xs text-muted">Hindi, English, Odia</p>
        </div>
      </div>
    </div>
  );
}

export default WelcomeScreen;