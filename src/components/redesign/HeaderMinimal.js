import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText, Save, Home, HelpCircle, Settings, Menu, X,
  Globe, Palette, FileText as FileIcon, LogOut,
  ChevronRight, Check, Moon, Sun, Type, Layout
} from 'lucide-react';

function HeaderMinimal({ projectName, onHome, currentStep, onUpdateProject, projectData }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuSettings, setMenuSettings] = useState({
    language: projectData?.language || localStorage.getItem('qpg_language') || 'english',
    theme: localStorage.getItem('theme') || 'light',
    fontSize: localStorage.getItem('fontSize') || 'medium',
    layout: projectData?.optionLayout || localStorage.getItem('qpg_layout') || 'vertical'
  });
  const [hasChanges, setHasChanges] = useState(false);
  const [showAboutTooltip, setShowAboutTooltip] = useState(false);
  const menuRef = useRef(null);
  
  // Apply saved settings on component mount
  useEffect(() => {
    // Apply saved theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    }
    
    // Apply saved font size
    const savedFontSize = localStorage.getItem('fontSize') || 'medium';
    document.documentElement.style.fontSize = 
      savedFontSize === 'small' ? '14px' :
      savedFontSize === 'large' ? '18px' : '16px';
  }, []);
  const getStepName = () => {
    switch(currentStep) {
      case 'template': return 'Template Selection';
      case 'editor': return 'Question Editor';
      case 'export': return 'Review & Export';
      default: return '';
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sync menu settings with projectData changes
  useEffect(() => {
    if (projectData) {
      setMenuSettings(prev => ({
        ...prev,
        language: projectData.language || prev.language,
        layout: projectData.optionLayout || prev.layout
      }));
    }
  }, [projectData?.language, projectData?.optionLayout]);

  // Track changes
  useEffect(() => {
    const hasAnyChanges = 
      menuSettings.language !== (projectData?.language || localStorage.getItem('qpg_language') || 'english') ||
      menuSettings.theme !== (localStorage.getItem('theme') || 'light') ||
      menuSettings.fontSize !== (localStorage.getItem('fontSize') || 'medium') ||
      menuSettings.layout !== (projectData?.optionLayout || localStorage.getItem('qpg_layout') || 'vertical');
    setHasChanges(hasAnyChanges);
  }, [menuSettings, projectData]);

  // Apply settings
  const handleApplySettings = () => {
    // Apply and save language setting
    localStorage.setItem('qpg_language', menuSettings.language);
    if (onUpdateProject) {
      onUpdateProject(prevData => ({
        ...prevData,
        language: menuSettings.language
      }));
    }

    // Apply and save theme
    localStorage.setItem('theme', menuSettings.theme);
    if (menuSettings.theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }

    // Apply and save font size
    localStorage.setItem('fontSize', menuSettings.fontSize);
    const fontSize = 
      menuSettings.fontSize === 'small' ? '14px' :
      menuSettings.fontSize === 'large' ? '18px' : '16px';
    document.documentElement.style.fontSize = fontSize;
    // Also apply to body for better coverage
    document.body.style.fontSize = fontSize;

    // Apply and save layout
    localStorage.setItem('qpg_layout', menuSettings.layout);
    if (onUpdateProject) {
      onUpdateProject(prevData => ({
        ...prevData,
        optionLayout: menuSettings.layout
      }));
    }
    
    // Save all settings to localStorage for persistence
    localStorage.setItem('qpg_all_settings', JSON.stringify(menuSettings));

    setHasChanges(false);
    // Show success feedback
    const savedIndicator = document.querySelector('.save-indicator');
    if (savedIndicator) {
      savedIndicator.classList.add('animate-pulse');
      setTimeout(() => savedIndicator.classList.remove('animate-pulse'), 1000);
    }
    
    // Force re-render of the app to apply changes
    window.dispatchEvent(new Event('settingsChanged'));
  };

  const handleResetSettings = () => {
    setMenuSettings({
      language: 'english',
      theme: 'light',
      fontSize: 'medium',
      layout: 'vertical'
    });
  };

  return (
    <header className="bg-white border-b border-gray-200 relative">
      <div className="px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Menu"
            >
              <Menu size={20} className="text-gray-600" />
            </button>
            
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-indigo-50 rounded-lg">
                <FileText size={20} className="text-indigo-600" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  Qmaker {projectName && `- ${projectName}`}
                </h1>
                {getStepName() && (
                  <p className="text-xs text-gray-500">{getStepName()}</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* Save Status */}
            <div className="save-indicator flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-lg">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-xs text-green-700 font-medium">Saved</span>
            </div>

            {/* Action Buttons */}
            <button 
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Home"
              onClick={onHome}
            >
              <Home size={18} className="text-gray-600" />
            </button>
            
            <button 
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Settings"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Settings size={18} className="text-gray-600" />
            </button>
            
            {/* Help/About Button with Tooltip */}
            <div className="relative">
              <button 
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="About Qmaker"
                onMouseEnter={() => setShowAboutTooltip(true)}
                onMouseLeave={() => setShowAboutTooltip(false)}
              >
                <HelpCircle size={18} className="text-gray-600" />
              </button>
              
              {/* About Tooltip */}
              {showAboutTooltip && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4 z-50 animate-fade-in">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <FileText size={16} className="text-white" />
                    </div>
                    Qmaker
                  </h3>
                  <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400 mb-2">
                    Make Perfect Question Papers in Minutes
                  </p>
                  <div className="space-y-1.5 text-xs text-gray-600 dark:text-gray-300">
                    <p>Version 2.0</p>
                    <p>
                      Created by{' '}
                      <a 
                        href="https://github.com/himanshu-hivecorp" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium"
                      >
                        Himanshu
                      </a>
                    </p>
                    <p className="text-gray-500 dark:text-gray-400">© 2025 Qmaker</p>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Professional MCQ paper generator with multi-language support, 
                      auto-save, and beautiful PDF exports.
                    </p>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <a
                      href="https://github.com/himanshu-hivecorp"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-md hover:bg-gray-800 transition-colors text-center"
                    >
                      GitHub
                    </a>
                    <button
                      onClick={() => setShowAboutTooltip(false)}
                      className="flex-1 px-3 py-1.5 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200 text-xs rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Slide-out Menu Panel */}
      <div 
        ref={menuRef}
        className={`fixed top-0 left-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 z-50 ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Menu Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Settings & Navigation</h2>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Menu Content */}
        <div className="p-4 space-y-6 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 140px)' }}>
          {/* Navigation Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Navigation</h3>
            <div className="space-y-1">
              <button
                onClick={() => { onHome && onHome(); setIsMenuOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Home size={18} />
                <span className="text-sm">Home</span>
              </button>
              <button
                className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FileIcon size={18} />
                <span className="text-sm">My Projects</span>
              </button>
            </div>
          </div>

          {/* Language Settings */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Language</h3>
            <select
              value={menuSettings.language}
              onChange={(e) => setMenuSettings({ ...menuSettings, language: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            >
              <option value="english">English</option>
              <option value="hindi">हिन्दी (Hindi)</option>
              <option value="odia">ଓଡ଼ିଆ (Odia)</option>
            </select>
          </div>

          {/* Theme Settings */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Theme</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setMenuSettings({ ...menuSettings, theme: 'light' })}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                  menuSettings.theme === 'light' 
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700' 
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Sun size={16} />
                <span className="text-sm">Light</span>
              </button>
              <button
                onClick={() => setMenuSettings({ ...menuSettings, theme: 'dark' })}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                  menuSettings.theme === 'dark' 
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700' 
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Moon size={16} />
                <span className="text-sm">Dark</span>
              </button>
            </div>
          </div>

          {/* Font Size Settings */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Font Size</h3>
            <div className="flex gap-2">
              {['small', 'medium', 'large'].map((size) => (
                <button
                  key={size}
                  onClick={() => setMenuSettings({ ...menuSettings, fontSize: size })}
                  className={`flex-1 px-3 py-2 rounded-lg border capitalize transition-colors text-sm ${
                    menuSettings.fontSize === size 
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700' 
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Layout Settings */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Option Layout</h3>
            <select
              value={menuSettings.layout}
              onChange={(e) => setMenuSettings({ ...menuSettings, layout: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            >
              <option value="vertical">Vertical</option>
              <option value="horizontal">Horizontal</option>
              <option value="grid">Grid (2x2)</option>
            </select>
          </div>
        </div>

        {/* Menu Footer with Apply Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
          <div className="flex gap-2">
            <button
              onClick={handleResetSettings}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              Reset
            </button>
            <button
              onClick={handleApplySettings}
              disabled={!hasChanges}
              className={`flex-1 px-4 py-2 rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2 ${
                hasChanges 
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {hasChanges && <Check size={16} />}
              Apply Changes
            </button>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </header>
  );
}

export default HeaderMinimal;