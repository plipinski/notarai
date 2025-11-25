import React, { useState } from 'react';

interface Props {
  onSend: (content: string) => void;
  disabled?: boolean;
}

const MessageInput: React.FC<Props> = ({ onSend, disabled }) => {
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    onSend(content.trim());
    setContent('');
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-slate-200 bg-white p-4">
      <div className="flex gap-3">
        <textarea
          className="flex-1 border border-slate-300 rounded p-3 shadow-sm focus:outline-none"
          rows={3}
          placeholder="Send a message..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={disabled}
        />
        <button
          type="submit"
          className="self-end bg-slate-900 text-white px-4 py-2 rounded shadow disabled:opacity-50"
          disabled={disabled}
        >
          Send
        </button>
      </div>
    </form>
  );
};

export default MessageInput;
