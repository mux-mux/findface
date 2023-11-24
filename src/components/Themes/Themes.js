import React, { useEffect } from 'react';

import './Themes.css';

const Themes = () => {
  const switchTheme = (event) => {
    event.currentTarget.checked ? setTheme('theme-dark') : setTheme('theme-light');
  };

  useEffect(() => {
    const themeSlider = document.querySelector('.themeCheckbox');

    const getTheme = () => {
      const currentTheme = localStorage.getItem('theme');

      if (currentTheme) {
        document.documentElement.className = currentTheme;

        currentTheme === 'theme-dark' ? (themeSlider.checked = true) : setTheme('theme-light');
      }
    };
    getTheme();

    themeSlider.addEventListener('change', switchTheme);
  }, []);

  const setTheme = (theme) => {
    document.documentElement.className = theme;
    localStorage.setItem('theme', theme);
  };

  return (
    <div className="theme-switch-wrapper">
      <label className="switch">
        <input type="checkbox" className="themeCheckbox" />
        <span className="slider round"></span>
      </label>
    </div>
  );
};

export default Themes;
