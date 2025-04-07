import React, { useEffect } from 'react';

import './variables.css';
import './Themes.css';

const Themes = () => {
  useEffect(() => {
    const THEME_DARK = 'theme-dark';
    const THEME_LIGHT = 'theme-light';

    const themeSlider = document.querySelector('.themeCheckbox');
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const setTheme = (theme) => {
      localStorage.setItem('theme', theme);
      document.documentElement.className = theme;
      themeSlider.checked = theme === THEME_DARK;
    };

    const initializeTheme = () => {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        setTheme(savedTheme);
      } else {
        const systemPrefersDark = window.matchMedia(
          '(prefers-color-scheme: dark)'
        ).matches;
        setTheme(systemPrefersDark ? THEME_DARK : THEME_LIGHT);
      }
    };

    const toggleTheme = () => {
      const currentTheme = localStorage.getItem('theme');
      setTheme(currentTheme === THEME_DARK ? THEME_LIGHT : THEME_DARK);
    };

    const systemTheme = (event) => {
      setTheme(event.matches ? THEME_DARK : THEME_LIGHT);
    };

    const setupEventListeners = () => {
      themeSlider.addEventListener('change', toggleTheme);
      mediaQuery.addEventListener('change', systemTheme);
    };

    const removeEventListeners = () => {
      themeSlider.removeEventListener('change', toggleTheme);
      mediaQuery.removeEventListener('change', systemTheme);
    };

    const init = () => {
      initializeTheme();
      setupEventListeners();
    };

    init();

    return () => removeEventListeners();
  }, []);

  return (
    <div className="theme-switch-wrapper flex-1">
      <label className="switch">
        <input type="checkbox" className="themeCheckbox" />
        <span className="slider round"></span>
        <span className="visually-hidden">
          Switch light/dark theme. Dark theme if checked
        </span>
      </label>
    </div>
  );
};

export default Themes;
