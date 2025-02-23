import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import '../styles/Map.css';

interface MapProps {
  lat: number;
  lon: number;
  zoom: number;
  apiKey: string;
  geoJsonData: any; // Adjust the type as needed
}

const Map: React.FC<MapProps> = ({ lat, lon, zoom, apiKey, geoJsonData }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (mapContainerRef.current) {
      mapRef.current = new maplibregl.Map({
        container: mapContainerRef.current,
        style: `https://api.maptiler.com/maps/basic/style.json?key=${apiKey}`,
        center: [lon, lat],
        zoom: zoom,
      });

      mapRef.current.on('load', () => {
        if (geoJsonData) {
          mapRef.current?.addSource('properties', {
            type: 'geojson',
            data: geoJsonData,
          });

          mapRef.current?.addLayer({
            id: 'properties-layer',
            type: 'fill',
            source: 'properties',
            paint: {
              'fill-color': '#888888',
              'fill-opacity': 0.4,
            },
          });
        }
      });
    }

    return () => {
      mapRef.current?.remove();
    };
  }, [apiKey, lat, lon, zoom]);

  useEffect(() => {
    if (mapRef.current && geoJsonData) {
      if (mapRef.current.getSource('properties')) {
        (
          mapRef.current.getSource('properties') as maplibregl.GeoJSONSource
        ).setData(geoJsonData);
      } else {
        mapRef.current.addSource('properties', {
          type: 'geojson',
          data: geoJsonData,
        });

        mapRef.current.addLayer({
          id: 'properties-layer',
          type: 'fill',
          source: 'properties',
          paint: {
            'fill-color': '#0000FF',
            'fill-opacity': 0.4,
          },
        });
      }
    }
  }, [geoJsonData]);

  return <div ref={mapContainerRef} className="map-container" />;
};

export default Map;
