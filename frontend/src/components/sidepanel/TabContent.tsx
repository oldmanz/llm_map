import React from 'react';
import ChatInput from '../ChatInput';
import SavedQueries from '../SavedQueries';
import Layers from '../layers/Layers';
import { Layer } from '../../types/layer';

interface TabContentProps {
  activeTab: 'search' | 'saved' | 'layers';
  message: string;
  onMessageChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSend: (event: React.FormEvent<HTMLFormElement>) => void;
  ids: number[];
  submittedQuery: string;
  onSaveQuery: () => void;
  onLoadQuery: (id: number) => void;
  layers: Layer[];
  onToggleLayer: (layerName: string) => void;
  onClearFilter: (layerName: string) => void;
}

const TabContent: React.FC<TabContentProps> = ({
  activeTab,
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
  switch (activeTab) {
    case 'search':
      return (
        <ChatInput
          message={message}
          onMessageChange={onMessageChange}
          onSend={onSend}
          ids={ids}
          submittedQuery={submittedQuery}
          onSaveQuery={onSaveQuery}
        />
      );
    case 'saved':
      return (
        <SavedQueries
          savedQueries={[]} // This should be passed from parent
          onLoadQuery={onLoadQuery}
          onDeleteQuery={() => {}} // This should be passed from parent
        />
      );
    case 'layers':
      return (
        <Layers
          layers={layers}
          onToggleLayer={onToggleLayer}
          onClearFilter={onClearFilter}
        />
      );
    default:
      return null;
  }
};

export default TabContent;
