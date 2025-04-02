import React, { ChangeEvent, FormEvent } from 'react';

interface ChatInputProps {
  message: string;
  onMessageChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  onSaveQuery: () => void;
  onSend: (event: FormEvent<HTMLFormElement>) => void;
  ids: Array<number>;
  submittedQuery: string;
}

const ChatInput: React.FC<ChatInputProps> = ({
  message,
  onMessageChange,
  onSend,
  ids,
  submittedQuery,
  onSaveQuery,
}) => {
  return (
    <>
      <form onSubmit={onSend} style={{ display: 'flex', gap: '8px' }}>
        <textarea
          value={message}
          onChange={onMessageChange}
          placeholder="Type your message..."
          style={{
            flex: 1,
            padding: '8px',
            minHeight: '100px', // Set an initial height
            resize: 'both', // Allow resizing both horizontally and vertically
          }}
        />
        <button type="submit" style={{ padding: '8px 16px' }}>
          Send
        </button>
      </form>
      {submittedQuery && (
        <div>
          <div id="query-container">
            <h3>Query:</h3>
            <div>{submittedQuery}</div>
            <button style={{ padding: '8px 16px' }} onClick={onSaveQuery}>
              Save Query
            </button>
          </div>
          <div id="count-container">
            <h3>Count:</h3>
            <div>{ids.length}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatInput;
