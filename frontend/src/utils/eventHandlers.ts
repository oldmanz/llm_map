import { KeyboardEvent } from 'react';

export class EventHandlers {

  static handleKeyDown = (
    e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
  callback: () => void
) => {
  if (e.key === 'Enter') {
    callback();
    }
  };
}
