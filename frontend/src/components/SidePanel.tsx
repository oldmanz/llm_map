import React, { useState, useEffect } from 'react';
import ChatInput from './ChatInput';
import SavedQueries from './SavedQueries';
import { ApiCalls } from '../utils/apiCalls';

interface SavedQuery {
  id: number;
  nl_query: string;
  timestamp: string;
}

interface SidePanelProps {
  message: string;
  onMessageChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSend: (event: React.FormEvent<HTMLFormElement>) => void;
  ids: number[];
  submittedQuery: string;
  onSaveQuery: () => void;
  onLoadQuery: (ids: number[], primaryLayer: string) => void;
}

const SidePanel: React.FC<SidePanelProps> = ({
  message,
  onMessageChange,
  onSend,
  ids,
  submittedQuery,
  onSaveQuery,
  onLoadQuery,
}) => {
  const [activeTab, setActiveTab] = useState<'search' | 'saved'>('search');
  const [savedQueries, setSavedQueries] = useState<SavedQuery[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSavedQueries = async () => {
      setLoading(true);
      console.log('Fetching saved queries...');
      try {
        const queries = await ApiCalls.getSavedQueries();
        console.log('Received queries:', queries);
        setSavedQueries(queries);
      } catch (error) {
        console.error('Error fetching saved queries:', error);
      } finally {
        setLoading(false);
      }
    };

    if (activeTab === 'saved') {
      fetchSavedQueries();
    }
  }, [activeTab]);

  const handleSaveQuery = () => {
    if (submittedQuery) {
      const newQuery: SavedQuery = {
        id: Date.now(),
        nl_query: submittedQuery,
        timestamp: new Date().toISOString(),
      };
      setSavedQueries([...savedQueries, newQuery]);
    }
  };

  const handleLoadQuery = async (id: number) => {
    try {
      const response = await ApiCalls.loadSavedQuery(id);
      console.log('Loaded query response:', response);
      onLoadQuery(response.ids, response.primary_layer);
    } catch (error) {
      console.error('Error loading query:', error);
    }
  };

  const handleDeleteQuery = async (id: number) => {
    try {
      await ApiCalls.deleteSavedQuery(id);
      setSavedQueries(savedQueries.filter((query) => query.id !== id));
    } catch (error) {
      console.error('Error deleting query:', error);
    }
  };

  return (
    <div style={{ width: '400px', borderLeft: '1px solid #ddd' }}>
      <div style={{ display: 'flex', borderBottom: '1px solid #ddd' }}>
        <button
          style={{
            flex: 1,
            padding: '12px',
            background: activeTab === 'search' ? '#f0f0f0' : 'transparent',
            border: 'none',
            cursor: 'pointer',
          }}
          onClick={() => setActiveTab('search')}
        >
          Search
        </button>
        <button
          style={{
            flex: 1,
            padding: '12px',
            background: activeTab === 'saved' ? '#f0f0f0' : 'transparent',
            border: 'none',
            cursor: 'pointer',
          }}
          onClick={() => setActiveTab('saved')}
        >
          Saved Queries
        </button>
      </div>

      <div style={{ padding: '16px' }}>
        {activeTab === 'search' ? (
          <ChatInput
            message={message}
            onMessageChange={onMessageChange}
            onSend={onSend}
            ids={ids}
            submittedQuery={submittedQuery}
            onSaveQuery={onSaveQuery}
          />
        ) : (
          <SavedQueries
            savedQueries={savedQueries}
            onLoadQuery={handleLoadQuery}
            onDeleteQuery={handleDeleteQuery}
          />
        )}
      </div>
    </div>
  );
};

export default SidePanel;
