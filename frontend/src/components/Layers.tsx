import React from 'react';

interface Layer {
  name: string;
  isActive: boolean;
  hasFilter: boolean;
  featureCount: number;
}

interface LayersProps {
  layers: Layer[];
  onToggleLayer: (layerName: string) => void;
  onClearFilter: (layerName: string) => void;
}

const Layers: React.FC<LayersProps> = ({
  layers,
  onToggleLayer,
  onClearFilter,
}) => {
  return (
    <div style={{ padding: '16px' }}>
      <h2>Layers</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {layers.map((layer) => (
          <div
            key={layer.name}
            style={{
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: layer.isActive ? '#f0f0f0' : 'transparent',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                checked={layer.isActive}
                onChange={() => onToggleLayer(layer.name)}
              />
              <div>
                <div style={{ fontWeight: 'bold' }}>{layer.name}</div>
                <div style={{ fontSize: '0.8em', color: '#666' }}>
                  {layer.hasFilter ? 'Filtered' : 'All features'} (
                  {layer.featureCount})
                </div>
              </div>
            </div>
            {layer.hasFilter && (
              <button
                onClick={() => onClearFilter(layer.name)}
                style={{
                  padding: '4px 8px',
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.8em',
                }}
              >
                Clear Filters
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Layers;
