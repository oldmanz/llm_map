import React, { ChangeEvent, FormEvent } from 'react';

interface ChatInputProps {
  message: string;
  onMessageChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onSend: (event: FormEvent<HTMLFormElement>) => void;
  ids: Array<number>;
}

const ChatInput: React.FC<ChatInputProps> = ({
  message,
  onMessageChange,
  onSend,
  ids,
}) => {
  return (
    <>
      <form onSubmit={onSend} style={{ display: 'flex', gap: '8px' }}>
        <input
          type="text"
          value={message}
          onChange={onMessageChange}
          placeholder="Type your message..."
          style={{ flex: 1, padding: '8px' }}
        />
        <button type="submit" style={{ padding: '8px 16px' }}>
          Send
        </button>
      </form>
      <ul>
        {ids.map((id, index) => (
          <li key={index}>{id}</li>
        ))}
      </ul>
    </>
  );
};

export default ChatInput;
