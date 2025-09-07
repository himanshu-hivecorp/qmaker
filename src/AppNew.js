import React, { useState, useEffect } from 'react';
import WelcomeScreenNew from './components/redesign/WelcomeScreenNew';
import TemplateSelectorClean from './components/redesign/TemplateSelectorClean';
import QuestionEditorClean from './components/redesign/QuestionEditorClean';
import QuestionEditorSimple from './components/redesign/QuestionEditorSimple';
import ReviewExport from './components/redesign/ReviewExport';
import HeaderMinimal from './components/redesign/HeaderMinimal';
import './styles/modern.css';

function AppNew() {
  const [currentStep, setCurrentStep] = useState('welcome');
  const [projectData, setProjectData] = useState({
    name: '',
    subject: '',
    class: '',
    totalMarks: '',
    duration: '',
    instructions: '',
    template: null,
    questions: [],
    layoutSettings: {
      fontSize: 'medium',
      questionSize: '16',
      optionSize: '14',
      fontFamily: 'Inter, sans-serif',
      lineSpacing: '1.6',
      questionSpacing: '28',
      marginSize: '40',
      primaryColor: '#4F46E5',
      accentColor: '#10B981'
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [hasSavedProject, setHasSavedProject] = useState(false);

  useEffect(() => {
    // Load saved settings
    const loadSavedSettings = () => {
      const savedLanguage = localStorage.getItem('qpg_language');
      const savedLayout = localStorage.getItem('qpg_layout');
      
      if (savedLanguage || savedLayout) {
        setProjectData(prev => ({
          ...prev,
          language: savedLanguage || prev.language || 'english',
          optionLayout: savedLayout || prev.optionLayout || 'vertical'
        }));
      }
    };

    // Check for multiple saved data sources
    const savedState = localStorage.getItem('qpg_current_project');
    const savedQuestions = localStorage.getItem('questionPaperProject');
    
    if (savedState || savedQuestions) {
      try {
        // Priority: questionPaperProject (from editor) > qpg_current_project
        if (savedQuestions) {
          const questionsData = JSON.parse(savedQuestions);
          if (questionsData.questions && questionsData.questions.length > 0) {
            setProjectData(prevData => ({
              ...prevData,
              ...questionsData,
              questions: questionsData.questions,
              language: localStorage.getItem('qpg_language') || questionsData.language || 'english',
              optionLayout: localStorage.getItem('qpg_layout') || questionsData.optionLayout || 'vertical'
            }));
            setHasSavedProject(true);
            // If we have questions, go directly to editor
            if (questionsData.questions.length > 0 && currentStep === 'welcome') {
              setCurrentStep('editor');
            }
          }
        } else if (savedState) {
          const parsed = JSON.parse(savedState);
          setProjectData({
            ...parsed.projectData,
            language: localStorage.getItem('qpg_language') || parsed.projectData.language || 'english',
            optionLayout: localStorage.getItem('qpg_layout') || parsed.projectData.optionLayout || 'vertical'
          });
          setCurrentStep(parsed.currentStep);
          setCompletedSteps(parsed.completedSteps || []);
          setHasSavedProject(true);
        }
      } catch (error) {
        console.error('Error loading saved state:', error);
      }
    } else {
      loadSavedSettings();
    }
    
    // Listen for settings changes
    const handleSettingsChange = () => {
      loadSavedSettings();
    };
    
    window.addEventListener('settingsChanged', handleSettingsChange);
    return () => window.removeEventListener('settingsChanged', handleSettingsChange);
  }, []);

  useEffect(() => {
    // Comprehensive auto-save to localStorage
    // All data stays on user's browser, no server storage
    const saveData = {
      projectData,
      currentStep,
      completedSteps,
      lastSaved: new Date().toISOString(),
      version: '2.0'
    };
    
    // Save to multiple keys for redundancy
    localStorage.setItem('qpg_current_project', JSON.stringify(saveData));
    
    // Also save questions separately for extra safety
    if (projectData.questions && projectData.questions.length > 0) {
      localStorage.setItem('qpg_questions_backup', JSON.stringify(projectData.questions));
    }
    
    // Save project metadata
    localStorage.setItem('qpg_project_meta', JSON.stringify({
      name: projectData.name,
      lastModified: new Date().toISOString(),
      questionCount: projectData.questions?.length || 0,
      mode: projectData.mode
    }));
  }, [projectData, currentStep, completedSteps]);

  const handleStepComplete = (step) => {
    if (!completedSteps.includes(step)) {
      setCompletedSteps([...completedSteps, step]);
    }
  };

  const handleProjectStart = (projectInfo) => {
    setProjectData({
      ...projectData,
      ...projectInfo
    });
    handleStepComplete('welcome');
    
    // Skip template selection for basic mode and use default modern template
    if (projectInfo.mode === 'basic') {
      const defaultTemplate = {
        id: 'modern',
        name: 'Modern Clean',
        settings: {
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          fontSize: '16px',
          questionSize: '16',
          optionSize: '14',
          lineSpacing: '1.6',
          questionSpacing: '28',
          marginSize: '40',
          primaryColor: '#059669',
          accentColor: '#10b981'
        }
      };
      setProjectData(prev => ({
        ...prev,
        ...projectInfo,
        template: defaultTemplate,
        layoutSettings: {
          ...prev.layoutSettings,
          ...defaultTemplate.settings
        }
      }));
      handleStepComplete('template');
      setCurrentStep('editor');
    } else {
      setCurrentStep('template');
    }
  };

  const handleTemplateSelect = (template) => {
    setProjectData({
      ...projectData,
      template,
      layoutSettings: {
        ...projectData.layoutSettings,
        ...template.settings
      }
    });
    handleStepComplete('template');
    setCurrentStep('editor');
  };

  const handleQuestionsUpdate = (questions) => {
    setProjectData({
      ...projectData,
      questions
    });
  };

  const handleBack = () => {
    // For basic mode, skip template step when going back
    if (currentStep === 'editor' && projectData.mode === 'basic') {
      setCurrentStep('welcome');
    } else {
      const steps = ['welcome', 'template', 'editor', 'export'];
      const currentIndex = steps.indexOf(currentStep);
      if (currentIndex > 0) {
        setCurrentStep(steps[currentIndex - 1]);
      }
    }
  };

  const handleNext = () => {
    // For basic mode, skip template step when appropriate
    const steps = projectData.mode === 'basic' 
      ? ['welcome', 'editor', 'export']
      : ['welcome', 'template', 'editor', 'export'];
    
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      handleStepComplete(currentStep);
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const handleLoadProject = (loadedData) => {
    setProjectData(loadedData.projectData || loadedData);
    setCurrentStep(loadedData.currentStep || 'editor');
    setCompletedSteps(loadedData.completedSteps || ['welcome', 'template']);
  };

  const handleNewProject = () => {
    // Clear all localStorage data for a fresh start
    localStorage.removeItem('qpg_current_project');
    localStorage.removeItem('questionPaperProject');
    localStorage.removeItem('qpg_questions_backup');
    localStorage.removeItem('qpg_project_meta');
    
    setProjectData({
      name: '',
      subject: '',
      class: '',
      totalMarks: '',
      duration: '',
      instructions: '',
      template: null,
      questions: [],
      layoutSettings: {
        fontSize: 'medium',
        questionSize: '16',
        optionSize: '14',
        fontFamily: 'Inter, sans-serif',
        lineSpacing: '1.6',
        questionSpacing: '28',
        marginSize: '40',
        primaryColor: '#4F46E5',
        accentColor: '#10B981'
      }
    });
    setCurrentStep('welcome');
    setCompletedSteps([]);
    setHasSavedProject(false);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'welcome':
        return (
          <WelcomeScreenNew
            onStart={handleProjectStart}
            onLoadProject={handleLoadProject}
          />
        );
      
      case 'template':
        return (
          <TemplateSelectorClean
            onSelectTemplate={handleTemplateSelect}
            onBack={handleBack}
            projectData={projectData}
          />
        );
      
      case 'editor':
        // Use simple editor for basic mode, full editor for professional mode
        const EditorComponent = projectData.mode === 'basic' ? QuestionEditorSimple : QuestionEditorClean;
        return (
          <EditorComponent
            projectData={projectData}
            onUpdateQuestions={handleQuestionsUpdate}
            onUpdateProject={setProjectData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      
      case 'export':
        return (
          <ReviewExport
            projectData={projectData}
            onBack={handleBack}
            onNewProject={handleNewProject}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {currentStep !== 'welcome' && (
        <HeaderMinimal
          projectName={projectData.name}
          currentStep={currentStep}
          onHome={handleNewProject}
          onUpdateProject={setProjectData}
          projectData={projectData}
        />
      )}
      
      <main className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center min-h-[calc(100vh-120px)]">
          {renderStep()}
        </div>
      </main>
    </div>
  );
}

export default AppNew;