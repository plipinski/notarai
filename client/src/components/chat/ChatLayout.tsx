import React from 'react';

interface Props {
  sidebar: React.ReactNode;
  children: React.ReactNode;
}

const ChatLayout: React.FC<Props> = ({ sidebar, children }) => {
  return (
    <div className="grid grid-cols-[280px_1fr] h-[calc(100vh-64px)]">
      <aside className="border-r border-slate-200 bg-white overflow-y-auto">{sidebar}</aside>
      <section className="flex flex-col bg-slate-50 h-full">{children}</section>
    </div>
  );
};

export default ChatLayout;
