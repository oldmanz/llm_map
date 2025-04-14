import React, { KeyboardEvent, FormEvent, useState } from 'react';
import { ApiCalls } from '../../utils/apiCalls';

interface ActionsProps {
  onActionResponse: (response: any) => { error?: string; success?: string };
}
interface Message {
    message: string;
    response: any;
    error?: string;
    success?: string;
}

const Actions: React.FC<ActionsProps> = ({ onActionResponse }) => {
    const [actionMessage, setActionMessage] = useState('');
    const [messageHistory, setMessageHistory] = useState<Array<Message>>([]);

    const onSubmitMapAction = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const response = await ApiCalls.getAction(actionMessage);


        const result = onActionResponse(response);
        
        const message: Message = { 
            message: actionMessage, 
            response,
            error: result?.error,
            success: result?.success
        };
        
        setMessageHistory(prev => [...prev, message]);
        setActionMessage('');
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            <form onSubmit={onSubmitMapAction} style={{ display: 'flex', gap: '8px' }}>
                <textarea
                    placeholder="Type your Action..."
                    onKeyDown={handleKeyDown}
                    onChange={handleInputChange}
                    value={actionMessage}
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

            <div style={{ 
                flex: 1, 
                overflowY: 'auto', 
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                minHeight: '200px',
                maxHeight: '300px'
            }}>
                {messageHistory.map((item, index) => (
                    <div key={index} style={{ marginBottom: '12px' }}>
                        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                            You: {item.message}
                        </div>
                        <div style={{ color: item.error ? 'red' : item.success ? 'green' : '#666' }}>
                            Response: 
                            {item.success && <div style={{ color: 'green' }}>{item.success}</div>}
                            {item.error && <div style={{ color: 'red' }}>{item.error}</div>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Actions;