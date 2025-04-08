import React from 'react';
import LayerItem from './LayerItem';
import { Layer } from '../../types/layer';
import '../../styles/components/Layers.css';

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
    <div className="layers">
      <h2 className="layers__title">Layers</h2>
      <div className="layers__list">
        {layers.map((layer) => (
          <LayerItem
            key={layer.name}
            layer={layer}
            onToggleLayer={onToggleLayer}
            onClearFilter={onClearFilter}
          />
        ))}
      </div>
    </div>
  );
};

export default Layers;
