import React, { createContext, useContext, useReducer, useEffect } from 'react';

const ThemeContext = createContext();

// Theme reducer
const themeReducer = (state, action) => {
  switch (action.type) {
    case 'TOGGLE_THEME':
      return {
        ...state,
        theme: state.theme === 'light' ? 'dark' : 'light',
      };
    case 'SET_THEME':
      return {
        ...state,
        theme: action.payload,
      };
    case 'TOGGLE_ELDERLY_MODE':
      return {
        ...state,
        elderlyMode: !state.elderlyMode,
      };
    case 'SET_ELDERLY_MODE':
      return {
        ...state,
        elderlyMode: action.payload,
      };
    case 'TOGGLE_HIGH_CONTRAST':
      return {
        ...state,
        highContrast: !state.highContrast,
      };
    case 'SET_HIGH_CONTRAST':
      return {
        ...state,
        highContrast: action.payload,
      };
    case 'SET_LANGUAGE':
      return {
        ...state,
        language: action.payload,
      };
    case 'SET_FONT_SIZE':
      return {
        ...state,
        fontSize: action.payload,
      };
    default:
      return state;
  }
};

// Initial state
const getInitialState = () => {
  const savedTheme = localStorage.getItem('ayursutra-theme');
  const savedElderlyMode = localStorage.getItem('ayursutra-elderly-mode') === 'true';
  const savedHighContrast = localStorage.getItem('ayursutra-high-contrast') === 'true';
  const savedLanguage = localStorage.getItem('ayursutra-language') || 'en';
  const savedFontSize = localStorage.getItem('ayursutra-font-size') || 'normal';

  return {
    theme: savedTheme || 'light',
    elderlyMode: savedElderlyMode,
    highContrast: savedHighContrast,
    language: savedLanguage,
    fontSize: savedFontSize,
  };
};

export const ThemeProvider = ({ children }) => {
  const [state, dispatch] = useReducer(themeReducer, getInitialState());

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    
    // Apply theme
    root.classList.remove('light', 'dark');
    root.classList.add(state.theme);
    
    // Apply elderly mode
    if (state.elderlyMode) {
      root.classList.add('elderly-mode');
    } else {
      root.classList.remove('elderly-mode');
    }
    
    // Apply high contrast
    if (state.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    // Apply font size
    root.style.fontSize = state.fontSize === 'large' ? '18px' : 
                         state.fontSize === 'extra-large' ? '20px' : '16px';
    
    // Save to localStorage
    localStorage.setItem('ayursutra-theme', state.theme);
    localStorage.setItem('ayursutra-elderly-mode', state.elderlyMode);
    localStorage.setItem('ayursutra-high-contrast', state.highContrast);
    localStorage.setItem('ayursutra-language', state.language);
    localStorage.setItem('ayursutra-font-size', state.fontSize);
  }, [state]);

  // Toggle theme
  const toggleTheme = () => {
    dispatch({ type: 'TOGGLE_THEME' });
  };

  // Set theme
  const setTheme = (theme) => {
    dispatch({ type: 'SET_THEME', payload: theme });
  };

  // Toggle elderly mode
  const toggleElderlyMode = () => {
    dispatch({ type: 'TOGGLE_ELDERLY_MODE' });
  };

  // Set elderly mode
  const setElderlyMode = (enabled) => {
    dispatch({ type: 'SET_ELDERLY_MODE', payload: enabled });
  };

  // Toggle high contrast
  const toggleHighContrast = () => {
    dispatch({ type: 'TOGGLE_HIGH_CONTRAST' });
  };

  // Set high contrast
  const setHighContrast = (enabled) => {
    dispatch({ type: 'SET_HIGH_CONTRAST', payload: enabled });
  };

  // Set language
  const setLanguage = (language) => {
    dispatch({ type: 'SET_LANGUAGE', payload: language });
  };

  // Set font size
  const setFontSize = (size) => {
    dispatch({ type: 'SET_FONT_SIZE', payload: size });
  };

  // Get accessibility classes
  const getAccessibilityClasses = () => {
    const classes = [];
    
    if (state.elderlyMode) {
      classes.push('elderly-mode');
    }
    
    if (state.highContrast) {
      classes.push('high-contrast');
    }
    
    if (state.fontSize === 'large') {
      classes.push('text-lg');
    } else if (state.fontSize === 'extra-large') {
      classes.push('text-xl');
    }
    
    return classes.join(' ');
  };

  const value = {
    ...state,
    toggleTheme,
    setTheme,
    toggleElderlyMode,
    setElderlyMode,
    toggleHighContrast,
    setHighContrast,
    setLanguage,
    setFontSize,
    getAccessibilityClasses,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;