// Local Storage Manager
// All data is stored locally in the user's browser
// No server storage - data stays private to the user

const STORAGE_KEYS = {
  CURRENT_PROJECT: 'qpg_current_project',
  QUESTION_PAPER: 'questionPaperProject',
  QUESTIONS_BACKUP: 'qpg_questions_backup',
  PROJECT_META: 'qpg_project_meta',
  USER_PREFERENCES: 'qpg_user_preferences',
  RECENT_PROJECTS: 'qpg_recent_projects'
};

// Save project data
export const saveProject = (projectData, currentStep, completedSteps) => {
  try {
    const saveData = {
      projectData,
      currentStep,
      completedSteps,
      lastSaved: new Date().toISOString(),
      version: '2.0'
    };
    
    // Save main project data
    localStorage.setItem(STORAGE_KEYS.CURRENT_PROJECT, JSON.stringify(saveData));
    
    // Backup questions separately
    if (projectData.questions && projectData.questions.length > 0) {
      localStorage.setItem(STORAGE_KEYS.QUESTIONS_BACKUP, JSON.stringify(projectData.questions));
    }
    
    // Save metadata for quick access
    localStorage.setItem(STORAGE_KEYS.PROJECT_META, JSON.stringify({
      name: projectData.name || 'Untitled',
      lastModified: new Date().toISOString(),
      questionCount: projectData.questions?.length || 0,
      mode: projectData.mode || 'basic',
      language: projectData.language || 'english'
    }));
    
    // Add to recent projects
    updateRecentProjects(projectData);
    
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
};

// Load project data
export const loadProject = () => {
  try {
    // Try multiple sources
    const sources = [
      STORAGE_KEYS.CURRENT_PROJECT,
      STORAGE_KEYS.QUESTION_PAPER
    ];
    
    for (const key of sources) {
      const data = localStorage.getItem(key);
      if (data) {
        const parsed = JSON.parse(data);
        
        // If it's the question paper format, convert it
        if (key === STORAGE_KEYS.QUESTION_PAPER) {
          return {
            projectData: parsed,
            currentStep: 'editor',
            completedSteps: ['welcome', 'template']
          };
        }
        
        return parsed;
      }
    }
    
    // Try to recover from backup
    const backup = localStorage.getItem(STORAGE_KEYS.QUESTIONS_BACKUP);
    if (backup) {
      return {
        projectData: { questions: JSON.parse(backup) },
        currentStep: 'editor',
        completedSteps: ['welcome']
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return null;
  }
};

// Clear all project data
export const clearProject = () => {
  const keysToRemove = [
    STORAGE_KEYS.CURRENT_PROJECT,
    STORAGE_KEYS.QUESTION_PAPER,
    STORAGE_KEYS.QUESTIONS_BACKUP,
    STORAGE_KEYS.PROJECT_META
  ];
  
  keysToRemove.forEach(key => localStorage.removeItem(key));
};

// Save user preferences
export const savePreferences = (preferences) => {
  localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(preferences));
};

// Load user preferences
export const loadPreferences = () => {
  try {
    const prefs = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
    return prefs ? JSON.parse(prefs) : null;
  } catch (error) {
    return null;
  }
};

// Update recent projects list
const updateRecentProjects = (projectData) => {
  try {
    const recent = localStorage.getItem(STORAGE_KEYS.RECENT_PROJECTS);
    let recentList = recent ? JSON.parse(recent) : [];
    
    // Add current project to top
    const projectSummary = {
      name: projectData.name || 'Untitled',
      date: new Date().toISOString(),
      questionCount: projectData.questions?.length || 0,
      mode: projectData.mode
    };
    
    // Remove duplicates and limit to 5 recent projects
    recentList = [projectSummary, ...recentList.filter(p => p.name !== projectSummary.name)].slice(0, 5);
    
    localStorage.setItem(STORAGE_KEYS.RECENT_PROJECTS, JSON.stringify(recentList));
  } catch (error) {
    console.error('Error updating recent projects:', error);
  }
};

// Get recent projects
export const getRecentProjects = () => {
  try {
    const recent = localStorage.getItem(STORAGE_KEYS.RECENT_PROJECTS);
    return recent ? JSON.parse(recent) : [];
  } catch (error) {
    return [];
  }
};

// Check available storage space
export const checkStorageSpace = () => {
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    return navigator.storage.estimate().then(estimate => {
      const percentUsed = (estimate.usage / estimate.quota) * 100;
      return {
        used: estimate.usage,
        quota: estimate.quota,
        percentUsed: percentUsed.toFixed(2),
        hasSpace: percentUsed < 90
      };
    });
  }
  // Fallback for browsers that don't support storage estimation
  return Promise.resolve({ hasSpace: true, percentUsed: 0 });
};

// Export all data for backup
export const exportAllData = () => {
  const allData = {};
  Object.keys(STORAGE_KEYS).forEach(key => {
    const data = localStorage.getItem(STORAGE_KEYS[key]);
    if (data) {
      allData[key] = JSON.parse(data);
    }
  });
  return allData;
};

// Import data from backup
export const importData = (backupData) => {
  try {
    Object.keys(backupData).forEach(key => {
      if (STORAGE_KEYS[key]) {
        localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(backupData[key]));
      }
    });
    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
};

export default {
  saveProject,
  loadProject,
  clearProject,
  savePreferences,
  loadPreferences,
  getRecentProjects,
  checkStorageSpace,
  exportAllData,
  importData
};