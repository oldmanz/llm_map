import React, { useState } from 'react';
import '../styles/App.css';
import Map from './Map';
import Button from './Button';
import ChatInput from './ChatInput';

const App: React.FC = () => {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState('');
  const [ids, setIds] = useState<Array<number>>([]);

  const handleClick = () => {
    setCount(count + 1);
  };

  const handleChatsubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
      console.log('Server response:', data);
    } catch (error) {
      console.error('Error sending message:', error);
    }

    setMessage(''); // Clear input after sending
  };

  const handleInputChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setMessage(e.target.value);
  };

  return (
    <div className="container">
      <h1>LLM Map</h1>
      <Map
        lat={33.221776}
        lon={-117.316235}
        zoom={15}
        apiKey="VrNApkggJ2WBH6PCzcJz"
      />
      <Button title="Click Me!" count={count} handleClick={handleClick} />
      <Button title="Don't Touch Me!" count={count} handleClick={handleClick} />
      <ChatInput
        message={message}
        onMessageChange={handleInputChange}
        onSend={handleChatsubmit}
        ids={ids}
      />
    </div>
  );
};

export default App;
