import React, { KeyboardEvent, FormEvent, useState } from 'react';
import { ApiCalls } from '../../utils/apiCalls';

const Actions: React.FC = () => {
    const [action, setAction] = useState('');

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        ApiCalls.executeAction(action);
        console.log('Form submitted');
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setAction(e.target.value);
      };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          const formEvent = {
            preventDefault: () => {},
          } as FormEvent<HTMLFormElement>;
          onSubmit(formEvent);
        }
      };

    return (
        <div>
        <form onSubmit={onSubmit} style={{ display: 'flex', gap: '8px' }}>
        <textarea
            placeholder="Type your Action..."
            onKeyDown={handleKeyDown}
            onChange={handleInputChange}
            style={{
                flex: 1,
                padding: '8px',
                minHeight: '100px',
                resize: 'both',
            }}
            />
            <button type="submit" style={{ padding: '8px 16px' }}>
            Submit
            </button>
        </form>
        </div>
    );
};

export default Actions;