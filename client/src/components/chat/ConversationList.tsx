import React from 'react';
import { Conversation } from '../../types';

interface Props {
  conversations: Conversation[];
  activeId?: string;
  onSelect: (id: string) => void;
  onNew: () => void;
}

const ConversationList: React.FC<Props> = ({ conversations, activeId, onSelect, onNew }) => {
  return (
    <div className="p-3 space-y-2">
      <button
        className="w-full bg-slate-900 text-white rounded px-3 py-2 text-sm"
        onClick={onNew}
      >
        New conversation
      </button>
      <div className="space-y-1">
        {conversations.map((c) => (
          <button
            key={c._id}
            onClick={() => onSelect(c._id)}
            className={`w-full text-left px-3 py-2 rounded text-sm hover:bg-slate-100 ${
              activeId === c._id ? 'bg-slate-200 font-medium' : 'bg-white'
            }`}
          >
            {c.title || 'Untitled'}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ConversationList;
