import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from '../components/App';

// Mock MapLibre GL
jest.mock('maplibre-gl', () => ({
  Map: jest.fn().mockImplementation(() => ({
    on: jest.fn(),
    remove: jest.fn(),
    addLayer: jest.fn(),
    removeLayer: jest.fn(),
    setFilter: jest.fn(),
    getLayer: jest.fn(),
    getSource: jest.fn(),
    addSource: jest.fn(),
    removeSource: jest.fn(),
    setPaintProperty: jest.fn(),
    setLayoutProperty: jest.fn(),
    fitBounds: jest.fn(),
    getBounds: jest.fn(),
    getCenter: jest.fn(),
    getZoom: jest.fn(),
    setCenter: jest.fn(),
    setZoom: jest.fn(),
    setStyle: jest.fn(),
    loadImage: jest.fn(),
    addImage: jest.fn(),
  })),
  NavigationControl: jest.fn(),
}));

describe('App', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  // it('renders without crashing', async () => {
  //   render(<App />);

  //   // Wait for initial render and API calls
  //   await waitFor(() => {
  //     expect(screen.getByText('LLM Map')).toBeInTheDocument();
  //   });
  // });

  // it('renders the map container', async () => {
  //   render(<App />);

  //   await waitFor(() => {
  //     expect(screen.getByTestId('map-container')).toBeInTheDocument();
  //   });
  // });

  it('renders the side panel', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId('side-panel')).toBeInTheDocument();
    });
  });
});
