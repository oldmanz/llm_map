import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import '../styles/Map.css';
import { ApiCalls } from '../utils/apiCalls';

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

  // Function to initialize the map
  const initializeMap = () => {
    if (!mapContainerRef.current) return;

    mapRef.current = new maplibregl.Map({
      container: mapContainerRef.current,
      style: `https://api.maptiler.com/maps/basic/style.json?key=${apiKey}`,
      center: [lon, lat],
      zoom: zoom,
    });

    mapRef.current.on('load', () => {
      if (geoJsonData) {
        mapRef.current?.addSource('parks', {
          type: 'geojson',
          data: geoJsonData,
        });

        addLayer('parks-layer', 'parks');
        addPopupToLayer('parks-layer');
      }
    });
  };

  // Function to add a layer with a consistent style
  const addLayer = (layerId: string, sourceId: string) => {
    mapRef.current?.addLayer({
      id: layerId,
      type: 'fill',
      source: sourceId,
      paint: {
        'fill-color': '#0000FF',
        'fill-opacity': 0.4,
      },
    });
  };

  // Function to add a popup to a layer
  const addPopupToLayer = (layerId: string) => {
    if (!mapRef.current) return;

    mapRef.current.on('click', layerId, async (e) => {
      const features = e.features;
      if (features && features.length > 0) {
        const properties = await ApiCalls.getParkPopupProperties(
          features[0].properties.id,
        );
        const coordinates = e.lngLat;

        // Create popup content from properties
        const popupContent = Object.entries(properties)
          .map(([key, value]) => `<strong>${key}:</strong> ${value}`)
          .join('<br>');

        // Display the popup
        new maplibregl.Popup()
          .setLngLat(coordinates)
          .setHTML(popupContent)
          .addTo(mapRef.current!);
      }
    });

    // Change cursor to pointer on hover
    mapRef.current.on('mouseenter', layerId, () => {
      if (mapRef.current) {
        mapRef.current.getCanvas().style.cursor = 'pointer';
      }
    });

    mapRef.current.on('mouseleave', layerId, () => {
      if (mapRef.current) {
        mapRef.current.getCanvas().style.cursor = '';
      }
    });
  };

  // Function to update the GeoJSON layer
  const updateMapLayer = () => {
    if (mapRef.current && geoJsonData) {
      if (mapRef.current.getSource('parks')) {
        (mapRef.current.getSource('parks') as maplibregl.GeoJSONSource).setData(
          geoJsonData,
        );
      } else {
        mapRef.current.addSource('parks', {
          type: 'geojson',
          data: geoJsonData,
        });

        addLayer('parks-layer', 'parks');
        addPopupToLayer('parks-layer');
      }
    }
  };

  useEffect(() => {
    initializeMap();

    return () => {
      mapRef.current?.remove();
    };
  }, [apiKey, lat, lon, zoom]);

  useEffect(() => {
    updateMapLayer();
  }, [geoJsonData]);

  return <div ref={mapContainerRef} className="map-container" />;
};

export default Map;
