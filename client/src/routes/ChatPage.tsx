import React, { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import ChatLayout from '../components/chat/ChatLayout';
import ConversationList from '../components/chat/ConversationList';
import MessageList from '../components/chat/MessageList';
import MessageInput from '../components/chat/MessageInput';
import { api } from '../utils/apiClient';
import { Conversation, Message } from '../types';

const ChatPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [activeConversationId, setActiveConversationId] = useState<string | undefined>();

  const { data: conversations = [] } = useQuery<Conversation[]>({
    queryKey: ['conversations'],
    queryFn: async () => {
      const res = await api.get('/conversations');
      return res.data;
    }
  });

  const { data: messages = [] } = useQuery<Message[]>({
    queryKey: ['messages', activeConversationId],
    enabled: Boolean(activeConversationId),
    queryFn: async () => {
      const res = await api.get(`/conversations/${activeConversationId}/messages`);
      return res.data;
    }
  });

  useEffect(() => {
    if (!activeConversationId && conversations.length) {
      setActiveConversationId(conversations[0]._id);
    }
  }, [conversations, activeConversationId]);

  const createConversation = async () => {
    const res = await api.post('/conversations', { title: 'New chat' });
    queryClient.invalidateQueries({ queryKey: ['conversations'] });
    setActiveConversationId(res.data._id);
  };

  const sendMessage = async (content: string) => {
    if (!activeConversationId) return;
    await api.post(`/conversations/${activeConversationId}/messages`, { content });
    queryClient.invalidateQueries({ queryKey: ['messages', activeConversationId] });
  };

  return (
    <ChatLayout
      sidebar={
        <ConversationList
          conversations={conversations}
          activeId={activeConversationId}
          onSelect={setActiveConversationId}
          onNew={createConversation}
        />
      }
    >
      <div className="flex flex-col h-full">
        {activeConversationId ? (
          <>
            <MessageList messages={messages} />
            <MessageInput onSend={sendMessage} />
          </>
        ) : (
          <div className="p-8 text-slate-500">Create a conversation to start chatting.</div>
        )}
      </div>
    </ChatLayout>
  );
};

export default ChatPage;
