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
      className={`tab-button ${isActive ? 'active' : ''}`}
      onClick={onClick}
      style={{
        flex: 1,
        padding: '12px',
        border: 'none',
        cursor: 'pointer',
        background: isActive ? '#f0f0f0' : 'transparent',
        fontWeight: isActive ? 'bold' : 'normal',
      }}
    >
      {label}
    </button>
  );
};

export default TabButton;
