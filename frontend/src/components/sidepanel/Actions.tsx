import React, { KeyboardEvent, FormEvent, useState } from 'react';
import { ApiCalls } from '../../utils/apiCalls';

interface ActionsProps {
  onActionResponse: (response: any) => void;
}

const Actions: React.FC<ActionsProps> = ({ onActionResponse }) => {
    const [actionMessage, setActionMessage] = useState('');

    const onSubmitMapAction = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const response = await ApiCalls.getAction(actionMessage);
        onActionResponse(response);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setActionMessage(e.target.value);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const formEvent = {
                preventDefault: () => {},
            } as FormEvent<HTMLFormElement>;
            onSubmitMapAction(formEvent);
        }
    };

    return (
        <div>
            <form onSubmit={onSubmitMapAction} style={{ display: 'flex', gap: '8px' }}>
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