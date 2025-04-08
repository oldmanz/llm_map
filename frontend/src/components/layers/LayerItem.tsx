import React from 'react';
import { Layer } from '../../types/layer';

interface LayerItemProps {
  layer: Layer;
  onToggleLayer: (layerName: string) => void;
  onClearFilter: (layerName: string) => void;
}

const LayerItem: React.FC<LayerItemProps> = ({
  layer,
  onToggleLayer,
  onClearFilter,
}) => {
  return (
    <div className="layer-item">
      <div className="layer-item__content">
        <input
          type="checkbox"
          checked={layer.isActive}
          onChange={() => onToggleLayer(layer.name)}
          className="layer-item__checkbox"
        />
        <div className="layer-item__info">
          <div className="layer-item__name">{layer.name}</div>
          <div className="layer-item__status">
            {layer.hasFilter ? 'Filtered' : 'All features'} (
            {layer.featureCount})
          </div>
        </div>
      </div>
      {layer.hasFilter && (
        <button
          onClick={() => onClearFilter(layer.name)}
          className="layer-item__clear-button"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
};

export default LayerItem;
