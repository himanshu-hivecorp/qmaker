import React, { useState, useRef } from 'react';
import { 
  FileText, Upload, Zap, Briefcase, ArrowRight, 
  Clock, BookOpen, Globe, ChevronRight, Star,
  CheckCircle, Folder, X, Sparkles, Settings,
  PenTool, FileDown, Hash, Timer, Github
} from 'lucide-react';

function WelcomeScreenNew({ onStart, onLoadProject }) {
  const [mode, setMode] = useState(null); // null, 'basic', 'professional'
  const [step, setStep] = useState('choose'); // 'choose', 'form'
  const [projectInfo, setProjectInfo] = useState({
    name: '',
    subject: '',
    class: '',
    totalMarks: '',
    duration: '',
    instructions: '',
    language: 'english',
    defaultMarks: '1'
  });
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);
  const [showGitHubCard, setShowGitHubCard] = useState(false);

  const recentProjects = JSON.parse(localStorage.getItem('qpg_recent_projects') || '[]');

  const validateForm = () => {
    const newErrors = {};
    if (!projectInfo.name.trim()) newErrors.name = 'Paper name is required';
    
    // Only validate other fields in professional mode
    if (mode === 'professional') {
      if (!projectInfo.subject.trim()) newErrors.subject = 'Subject is required';
      if (!projectInfo.class.trim()) newErrors.class = 'Class/Grade is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBasicStart = () => {
    setMode('basic');
    setStep('form');
    setProjectInfo({
      ...projectInfo,
      subject: 'General',
      class: 'Standard',
      totalMarks: '',
      duration: '',
      instructions: '',
      defaultMarks: '1'
    });
  };

  const handleProfessionalStart = () => {
    setMode('professional');
    setStep('form');
  };

  const handleCreateProject = () => {
    if (validateForm()) {
      // Save to recent projects
      const recent = JSON.parse(localStorage.getItem('qpg_recent_projects') || '[]');
      const newProject = {
        ...projectInfo,
        mode,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString()
      };
      recent.unshift(newProject);
      if (recent.length > 5) recent.pop();
      localStorage.setItem('qpg_recent_projects', JSON.stringify(recent));
      
      onStart({ ...projectInfo, mode });
    }
  };

  const handleInputChange = (field, value) => {
    setProjectInfo({ ...projectInfo, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const handleLoadFile = (event) => {
    const file = event.target.files[0];
    if (file) {
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
    }
  };

  const handleBack = () => {
    if (step === 'form') {
      setStep('choose');
      setMode(null);
      setErrors({});
    }
  };

  // Choose Mode Screen
  if (step === 'choose') {
    return (
      <div className="w-full max-w-4xl mx-auto relative">
        {/* GitHub Link in Top Right */}
        <div className="absolute -top-2 -right-8 z-10">
          <div className="relative">
            <a
              href="https://github.com/himanshu-hivecorp"
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => setShowGitHubCard(true)}
              onMouseLeave={() => setShowGitHubCard(false)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-all shadow-md"
            >
              <Github size={16} />
              <span className="text-xs font-medium">GitHub</span>
            </a>
            
            {/* Hover Card */}
            {showGitHubCard && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 p-4 animate-fade-in">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Github size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Himanshu</h3>
                    <p className="text-xs text-gray-500">Creator of Qmaker</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Full-stack developer passionate about creating tools that make life easier.
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>💼 HiveCorp</span>
                  <span>•</span>
                  <span>🌍 India</span>
                </div>
                <a
                  href="https://github.com/himanshu-hivecorp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm"
                >
                  <Github size={16} />
                  Follow on GitHub
                </a>
              </div>
            )}
          </div>
        </div>
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4">
            <FileText size={32} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-1">
            Qmaker
          </h1>
          <p className="text-lg text-indigo-600 font-medium mb-2">
            Make Perfect Question Papers in Minutes
          </p>
          <p className="text-gray-600">Choose how you'd like to start</p>
        </div>

        {/* Main Options */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Basic Mode */}
          <button
            onClick={handleBasicStart}
            className="group relative bg-white rounded-2xl border-2 border-gray-200 p-6 hover:border-green-400 hover:shadow-xl transition-all duration-300 text-left"
          >
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                Quick Start
              </span>
            </div>
            
            <div className="mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Zap size={24} className="text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Basic Mode</h3>
              <p className="text-gray-600 text-sm mb-4">
                Start creating questions immediately with just a paper name
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle size={16} className="text-green-500" />
                <span>Just enter paper name</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle size={16} className="text-green-500" />
                <span>Start adding questions instantly</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle size={16} className="text-green-500" />
                <span>Perfect for quick tests</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <span className="text-sm font-medium text-green-600 group-hover:text-green-700 flex items-center gap-1">
                Get Started <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </button>

          {/* Professional Mode */}
          <button
            onClick={handleProfessionalStart}
            className="group relative bg-white rounded-2xl border-2 border-gray-200 p-6 hover:border-indigo-400 hover:shadow-xl transition-all duration-300 text-left"
          >
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full">
                Full Features
              </span>
            </div>
            
            <div className="mb-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Briefcase size={24} className="text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Professional Mode</h3>
              <p className="text-gray-600 text-sm mb-4">
                Create formal examination papers with complete details
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle size={16} className="text-indigo-500" />
                <span>Subject & class details</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle size={16} className="text-indigo-500" />
                <span>Marking scheme & duration</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle size={16} className="text-indigo-500" />
                <span>Instructions & formatting</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <span className="text-sm font-medium text-indigo-600 group-hover:text-indigo-700 flex items-center gap-1">
                Configure <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </button>
        </div>

        {/* Secondary Options */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center gap-3 p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:shadow-md transition-all"
          >
            <Upload size={20} className="text-gray-600" />
            <span className="font-medium text-gray-700">Load Project</span>
          </button>
          
          <button
            className="flex items-center justify-center gap-3 p-4 bg-gray-50 rounded-xl border-2 border-gray-200 cursor-not-allowed opacity-60"
            disabled
          >
            <Folder size={20} className="text-gray-400" />
            <span className="font-medium text-gray-500">Templates (Soon)</span>
          </button>
        </div>

        {/* Recent Projects */}
        {recentProjects.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <Clock size={16} />
              Recent Projects
            </h3>
            <div className="space-y-2">
              {recentProjects.slice(0, 3).map((project, index) => (
                <button
                  key={project.id || index}
                  onClick={() => onLoadProject(project)}
                  className="w-full flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-indigo-300 hover:shadow-sm transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${project.mode === 'basic' ? 'bg-green-500' : 'bg-indigo-500'}`} />
                    <div>
                      <p className="font-medium text-gray-800">{project.name}</p>
                      <p className="text-xs text-gray-500">
                        {project.mode === 'basic' ? 'Basic' : 'Professional'} • 
                        {project.language === 'hindi' ? ' हिंदी' : project.language === 'odia' ? ' ଓଡ଼ିଆ' : ' English'}
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-gray-400" />
                </button>
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
        
        {/* Copyright Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            Made with ❤️ by{' '}
            <a 
              href="https://github.com/himanshu-hivecorp" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Himanshu
            </a>
            {' '}| © 2025 Qmaker
          </p>
        </div>
      </div>
    );
  }

  // Form Screen
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        {/* Form Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={handleBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowRight size={20} className="text-gray-500 rotate-180" />
              </button>
              <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  {mode === 'basic' ? (
                    <>
                      <Zap size={20} className="text-green-600" />
                      Basic Setup
                    </>
                  ) : (
                    <>
                      <Briefcase size={20} className="text-indigo-600" />
                      Professional Setup
                    </>
                  )}
                </h2>
                <p className="text-sm text-gray-600">
                  {mode === 'basic' 
                    ? 'Just enter a name and start creating' 
                    : 'Configure your examination paper'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {mode === 'basic' ? (
            // Basic Mode - Minimal Form
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Paper Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className={`w-full px-4 py-3 text-lg border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.name ? 'border-red-300' : 'border-gray-200'
                  }`}
                  placeholder="e.g., Weekly Test 1, Practice Questions, Quiz"
                  value={projectInfo.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  autoFocus
                />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Question Language
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { 
                      value: 'english', 
                      label: 'English', 
                      nativeName: 'English',
                      sample: 'A, B, C, D',
                      questionPrefix: 'Q',
                      example: 'Question 1'
                    },
                    { 
                      value: 'hindi', 
                      label: 'Hindi', 
                      nativeName: 'हिंदी',
                      sample: 'क, ख, ग, घ',
                      questionPrefix: 'प्र',
                      example: 'प्रश्न १'
                    },
                    { 
                      value: 'odia', 
                      label: 'Odia', 
                      nativeName: 'ଓଡ଼ିଆ',
                      sample: 'କ, ଖ, ଗ, ଘ',
                      questionPrefix: 'ପ୍ର',
                      example: 'ପ୍ରଶ୍ନ ୧'
                    }
                  ].map(lang => (
                    <button
                      key={lang.value}
                      type="button"
                      onClick={() => handleInputChange('language', lang.value)}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        projectInfo.language === lang.value
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">{lang.label}</span>
                        {projectInfo.language === lang.value && (
                          <CheckCircle size={16} className="text-green-500" />
                        )}
                      </div>
                      <div className="text-lg font-semibold text-gray-800 mb-1">{lang.nativeName}</div>
                      <div className="text-xs text-gray-600 space-y-1">
                        <div>Options: {lang.sample}</div>
                        <div>{lang.example}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Sparkles size={20} className="text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-900">Quick Start Benefits</p>
                    <p className="text-xs text-green-700 mt-1">
                      Start adding questions immediately. You can always add more details later if needed.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Professional Mode - Full Form
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Paper Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.name ? 'border-red-300' : 'border-gray-200'
                  }`}
                  placeholder="e.g., Mid-Term Examination 2025"
                  value={projectInfo.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  autoFocus
                />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      errors.subject ? 'border-red-300' : 'border-gray-200'
                    }`}
                    placeholder="e.g., Mathematics"
                    value={projectInfo.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                  />
                  {errors.subject && <p className="text-xs text-red-500 mt-1">{errors.subject}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Class/Grade <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      errors.class ? 'border-red-300' : 'border-gray-200'
                    }`}
                    placeholder="e.g., Grade 10"
                    value={projectInfo.class}
                    onChange={(e) => handleInputChange('class', e.target.value)}
                  />
                  {errors.class && <p className="text-xs text-red-500 mt-1">{errors.class}</p>}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                    <Hash size={14} /> Total Marks
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., 100"
                    value={projectInfo.totalMarks}
                    onChange={(e) => handleInputChange('totalMarks', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                    <Timer size={14} /> Duration
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., 3 Hours"
                    value={projectInfo.duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                    <Star size={14} /> Per Question
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Marks"
                    value={projectInfo.defaultMarks}
                    onChange={(e) => handleInputChange('defaultMarks', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Question Language
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { 
                      value: 'english', 
                      label: 'English', 
                      nativeName: 'English',
                      sample: 'A, B, C, D',
                      questionPrefix: 'Q',
                      example: 'Question 1'
                    },
                    { 
                      value: 'hindi', 
                      label: 'Hindi', 
                      nativeName: 'हिंदी',
                      sample: 'क, ख, ग, घ',
                      questionPrefix: 'प्र',
                      example: 'प्रश्न १'
                    },
                    { 
                      value: 'odia', 
                      label: 'Odia', 
                      nativeName: 'ଓଡ଼ିଆ',
                      sample: 'କ, ଖ, ଗ, ଘ',
                      questionPrefix: 'ପ୍ର',
                      example: 'ପ୍ରଶ୍ନ ୧'
                    }
                  ].map(lang => (
                    <button
                      key={lang.value}
                      type="button"
                      onClick={() => handleInputChange('language', lang.value)}
                      className={`p-3 rounded-lg border-2 transition-all text-left ${
                        projectInfo.language === lang.value
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-gray-700">{lang.label}</span>
                        {projectInfo.language === lang.value && (
                          <CheckCircle size={14} className="text-indigo-500" />
                        )}
                      </div>
                      <div className="text-base font-semibold text-gray-800">{lang.nativeName}</div>
                      <div className="text-xs text-gray-600 mt-2 space-y-0.5">
                        <div>{lang.sample}</div>
                        <div className="text-gray-500">{lang.example}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Instructions (Optional)
                </label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows="3"
                  placeholder="Enter general instructions for students..."
                  value={projectInfo.instructions}
                  onChange={(e) => handleInputChange('instructions', e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-100">
            <button
              onClick={handleBack}
              className="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleCreateProject}
              className={`px-6 py-2 text-white rounded-lg font-medium transition-all flex items-center gap-2 ${
                mode === 'basic'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {mode === 'basic' ? 'Start Creating' : 'Create Project'}
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Copyright Footer */}
      <div className="mt-8 text-center">
        <p className="text-xs text-gray-500">
          Made with ❤️ by{' '}
          <a 
            href="https://github.com/himanshu-hivecorp" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Himanshu
          </a>
          {' '}| © 2025 Qmaker
        </p>
      </div>
    </div>
  );
}

export default WelcomeScreenNew;