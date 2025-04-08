import React, { useState } from 'react';
import TabButton from './TabButton';
import TabContent from './TabContent';
import { Layer } from '../../types/layer';
import '../../styles/components/SidePanel.css';

interface SidePanelProps {
  message: string;
  onMessageChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSend: (event: React.FormEvent<HTMLFormElement>) => void;
  ids: number[];
  submittedQuery: string;
  onSaveQuery: () => void;
  onLoadQuery: (ids: number[], primaryLayer: string) => void;
  layers: Layer[];
  onToggleLayer: (layerName: string) => void;
  onClearFilter: (layerName: string) => void;
}

const SidePanel: React.FC<SidePanelProps> = ({
  message,
  onMessageChange,
  onSend,
  ids,
  submittedQuery,
  onSaveQuery,
  onLoadQuery,
  layers,
  onToggleLayer,
  onClearFilter,
}) => {
  const [activeTab, setActiveTab] = useState<'search' | 'saved' | 'layers'>(
    'search',
  );

  return (
    <div className="side-panel">
      <div className="side-panel__tabs">
        <TabButton
          label="Search"
          isActive={activeTab === 'search'}
          onClick={() => setActiveTab('search')}
        />
        <TabButton
          label="Saved Queries"
          isActive={activeTab === 'saved'}
          onClick={() => setActiveTab('saved')}
        />
        <TabButton
          label="Layers"
          isActive={activeTab === 'layers'}
          onClick={() => setActiveTab('layers')}
        />
      </div>

      <div className="side-panel__content">
        <TabContent
          activeTab={activeTab}
          message={message}
          onMessageChange={onMessageChange}
          onSend={onSend}
          ids={ids}
          submittedQuery={submittedQuery}
          onSaveQuery={onSaveQuery}
          onLoadQuery={onLoadQuery}
          layers={layers}
          onToggleLayer={onToggleLayer}
          onClearFilter={onClearFilter}
        />
      </div>
    </div>
  );
};

export default SidePanel;
