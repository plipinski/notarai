import React, { useEffect, useRef } from 'react';
import { Message } from '../../types';

interface Props {
  messages: Message[];
}

const MessageList: React.FC<Props> = ({ messages }) => {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
      {messages.map((msg) => (
        <div key={msg._id} className="flex flex-col gap-2">
          <div className="text-xs uppercase text-slate-500">{msg.role}</div>
          <div
            className={`p-3 rounded-lg max-w-3xl whitespace-pre-wrap ${
              msg.role === 'assistant' ? 'bg-white border border-slate-200' : 'bg-slate-900 text-white'
            }`}
          >
            {msg.content}
          </div>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
};

export default MessageList;
