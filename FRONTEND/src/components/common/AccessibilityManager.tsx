import React, { useEffect } from 'react';

export const AccessibilityManager: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    const handleFirstTab = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        document.body.classList.add('user-is-tabbing');
      }
    };

    const handleMouseDown = () => {
      document.body.classList.remove('user-is-tabbing');
    };

    window.addEventListener('keydown', handleFirstTab);
    window.addEventListener('mousedown', handleMouseDown);

    return () => {
      window.removeEventListener('keydown', handleFirstTab);
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-iris focus:text-white focus:rounded-lg focus:font-medium focus:shadow-lg focus:outline-none"
      >
        Skip to main content
      </a>
      <div id="main-content">
        {children}
      </div>
    </>
  );
};

export default AccessibilityManager;