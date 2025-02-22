import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import '../styles/Map.css';

interface MapProps {
  lat: number;
  lon: number;
  zoom: number;
  apiKey: string;
}

const Map: React.FC<MapProps> = ({ lat, lon, zoom, apiKey}) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (mapContainer.current) {
      const map = new maplibregl.Map({
        container: mapContainer.current,
        style: `https://api.maptiler.com/maps/bright/style.json?key=${apiKey}`,
        center: [lon, lat], // Use props for center
        zoom: zoom, // Use props for zoom
      });

      return () => map.remove();
    }
  }, [lat, lon, zoom, apiKey]); // Add dependencies

  return <div ref={mapContainer} className="map-container" />;
};

export default Map;