import React, { useState, useEffect } from 'react';
import '../styles/App.css';
import Map from './Map';
import Button from './Button';
import ChatInput from './ChatInput';

const App: React.FC = () => {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState('');
  const [ids, setIds] = useState<Array<number>>([]);
  const [geoJsonData, setGeoJsonData] = useState<{
    type: string;
    features: any[];
  } | null>(null);

  const handleClick = () => {
    setCount(count + 1);
  };

  const handleChatSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      const urlSafeMessage = encodeURIComponent(message);
      const response = await fetch(
        `http://127.0.0.1:8001/query?nl_query=${urlSafeMessage}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      const data = await response.json();
      setIds(data.ids);

      const filteredFeatures =
        geoJsonData?.features.filter((feature: any) =>
          data.ids.includes(feature.properties.id),
        ) || [];

      // Update the geoJsonData state with the filtered features
      setGeoJsonData({
        type: 'FeatureCollection',
        features: filteredFeatures,
      });
      console.log('Server response:', data);
    } catch (error) {
      console.error('Error sending message:', error);
    }

    setMessage('');
  };

  const handleInputChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    // Fetch GeoJSON data when the component mounts
    const fetchGeoJsonData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8001/properties');
        const data = await response.json();
        setGeoJsonData(data);
      } catch (error) {
        console.error('Error fetching GeoJSON data:', error);
      }
    };

    fetchGeoJsonData();
  }, []);

  return (
    <div className="container">
      <h1>LLM Map</h1>
      <Map
        lat={43.6541821442}
        lon={-70.2669021666}
        zoom={14}
        apiKey="VrNApkggJ2WBH6PCzcJz"
        geoJsonData={geoJsonData}
      />
      <Button
        title="Click rasdfgasefergere!!!!"
        count={count}
        handleClick={handleClick}
      />

      <ChatInput
        message={message}
        onMessageChange={handleInputChange}
        onSend={handleChatSubmit}
        ids={ids}
      />
    </div>
  );
};

export default App;
