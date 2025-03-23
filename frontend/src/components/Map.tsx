import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import '../styles/Map.css';
import { ApiCalls } from '../utils/apiCalls';

interface MapProps {
  lat: number;
  lon: number;
  zoom: number;
  apiKey: string;
  geoJsonData: Record<string, any>; // A map of layer names to GeoJSON data
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
      // Add all layers dynamically
      Object.keys(geoJsonData).forEach((layerName) => {
        addSourceAndLayer(layerName, geoJsonData[layerName]);
        addPopupToLayer(layerName);
      });
    });
  };

  // Function to add a point layer (circle layer)
  const addPointLayer = (layerId: string) => {
    if (!mapRef.current) return;

    mapRef.current.addLayer({
      id: layerId,
      type: 'circle',
      source: layerId,
      paint: {
        'circle-radius': 6,
        'circle-color': '#FF0000', // Red color for points
        'circle-stroke-width': 1,
        'circle-stroke-color': '#FFFFFF', // White border
      },
    });
  };

  // Function to add a polygon layer (fill layer)
  const addPolygonLayer = (layerId: string) => {
    if (!mapRef.current) return;

    mapRef.current.addLayer({
      id: layerId,
      type: 'fill',
      source: layerId,
      paint: {
        'fill-color': '#0000FF', // Blue color for polygons
        'fill-opacity': 0.4,
      },
    });
  };

  // Function to add a source and layer dynamically
  const addSourceAndLayer = (layerId: string, data: any) => {
    if (!mapRef.current) return;

    // Add the GeoJSON source
    if (!mapRef.current.getSource(layerId)) {
      mapRef.current.addSource(layerId, {
        type: 'geojson',
        data: data,
      });
    }

    // Determine the layer type dynamically based on the first feature's geometry type
    const firstFeature = data.features?.[0];
    const geometryType = firstFeature?.geometry?.type;

    // Add the layer with appropriate styling
    if (!mapRef.current.getLayer(layerId)) {
      if (geometryType === 'Point') {
        addPointLayer(layerId); // Add a point layer
      } else if (
        geometryType === 'Polygon' ||
        geometryType === 'MultiPolygon'
      ) {
        addPolygonLayer(layerId); // Add a polygon layer
      } else {
        console.warn(`Unsupported geometry type: ${geometryType}`);
      }
    }
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

  // Function to update the GeoJSON layers dynamically
  const updateMapLayers = () => {
    if (!mapRef.current) return;

    Object.keys(geoJsonData).forEach((layerName) => {
      if (mapRef.current && mapRef.current.getSource(layerName)) {
        (
          mapRef.current.getSource(layerName) as maplibregl.GeoJSONSource
        ).setData(geoJsonData[layerName]);
      } else {
        addSourceAndLayer(layerName, geoJsonData[layerName]);
        addPopupToLayer(layerName);
      }
    });
  };

  useEffect(() => {
    initializeMap();

    return () => {
      mapRef.current?.remove();
    };
  }, [apiKey, lat, lon, zoom]);

  useEffect(() => {
    updateMapLayers();
  }, [geoJsonData]);

  return <div ref={mapContainerRef} className="map-container" />;
};

export default Map;
