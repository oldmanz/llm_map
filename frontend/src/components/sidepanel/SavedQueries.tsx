import React from 'react';

interface SavedQuery {
  id: number;
  nl_query: string;
  timestamp: string;
}

interface SavedQueriesProps {
  savedQueries: SavedQuery[];
  onLoadQuery: (id: number) => void;
  onDeleteQuery: (id: number) => void;
}

const SavedQueries: React.FC<SavedQueriesProps> = ({
  savedQueries,
  onLoadQuery,
  onDeleteQuery,
}) => {
  return (
    <div style={{ padding: '16px' }}>
      <h2>Saved Queries</h2>
      {savedQueries.length === 0 ? (
        <p>No saved queries yet.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {savedQueries.map((query) => (
            <li
              key={query.id}
              style={{
                padding: '12px',
                marginBottom: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <div style={{ marginBottom: '4px' }}>{query.nl_query}</div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => onLoadQuery(query.id)}
                  style={{ padding: '4px 8px' }}
                >
                  Load
                </button>
                <button
                  onClick={() => onDeleteQuery(query.id)}
                  style={{ padding: '4px 8px', color: 'red' }}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SavedQueries;
