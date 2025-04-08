import React from 'react';
import '../../styles/components/TabButton.css';

interface TabButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ label, isActive, onClick }) => {
  return (
    <button
      className={`tab-button ${isActive ? 'tab-button--active' : ''}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default TabButton;
