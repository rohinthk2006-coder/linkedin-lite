import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Send, Search, MessageSquare, Circle } from 'lucide-react';

export const MessagesView = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeConvId, setActiveConvId] = useState(null);
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConnections();
  }, [user?.id]);

  const fetchConnections = async () => {
    setLoading(true);
    try {
      const res = await api.get('/connections');
      if (res.data.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
        const dynamicConvs = res.data.data.map((conn) => {
          const partner = conn.sender?.id === user?.id ? conn.receiver : conn.sender;
          return {
            id: conn.id,
            participant: {
              id: partner?.id,
              name: `${partner?.firstName || 'Connected'} ${partner?.lastName || 'Member'}`.trim(),
              role: partner?.headline || 'LinkSphere Member',
              avatar: partner?.profileImage,
              online: true,
              headline: partner?.headline || 'LinkSphere Member'
            },
            unreadCount: 0,
            lastMessage: {
              text: "Connected on LinkSphere",
              timestamp: "Recently",
              senderId: partner?.id
            },
            messages: [
              {
                id: 1,
                senderId: partner?.id,
                text: `Hi ${user?.firstName || 'there'}! Excited to connect on LinkSphere.`,
                timestamp: "Recently"
              }
            ]
          };
        });
        setConversations(dynamicConvs);
        setActiveConvId(dynamicConvs[0]?.id || null);
      } else {
        setConversations([]);
        setActiveConvId(null);
      }
    } catch (err) {
      console.error('Failed to load connections for messages:', err);
      setConversations([]);
      setActiveConvId(null);
    } finally {
      setLoading(false);
    }
  };

  const activeConv = conversations.find((c) => c.id === activeConvId) || conversations[0] || null;

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConv) return;

    const newMsg = {
      id: Date.now(),
      senderId: user?.id,
      text: inputText.trim(),
      timestamp: "Just now"
    };

    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === activeConvId) {
          return {
            ...conv,
            messages: [...conv.messages, newMsg],
            lastMessage: {
              text: newMsg.text,
              timestamp: newMsg.timestamp,
              senderId: newMsg.senderId
            }
          };
        }
        return conv;
      })
    );

    setInputText('');
  };

  const filteredConversations = conversations.filter((c) =>
    c.participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.participant.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white dark:bg-[#131b2e] rounded-3xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col md:flex-row h-[75vh]">
      {/* Left Pane: Conversation List */}
      <div className="w-full md:w-80 border-r border-gray-100 dark:border-slate-800 flex flex-col h-full shrink-0">
        <div className="p-4 border-b border-gray-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-extrabold text-lg text-gray-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              <span>Messages</span>
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400">
              {conversations.length} Active
            </span>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:border-blue-500"
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="overflow-y-auto flex-1 divide-y divide-gray-50 dark:divide-slate-800/50">
          {loading ? (
            <div className="p-8 text-center text-xs text-gray-400 dark:text-slate-500">
              Loading conversations...
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="p-8 text-center text-xs text-gray-400 dark:text-slate-500">
              No conversations yet. Connect with professionals to message them.
            </div>
          ) : (
            filteredConversations.map((conv) => {
              const isSelected = conv.id === activeConvId;
              return (
                <div
                  key={conv.id}
                  onClick={() => setActiveConvId(conv.id)}
                  className={`p-3.5 flex items-start space-x-3 cursor-pointer transition ${
                    isSelected
                      ? 'bg-blue-50/80 dark:bg-blue-950/40 border-l-4 border-blue-600'
                      : 'hover:bg-gray-50/80 dark:hover:bg-slate-900/40'
                  }`}
                >
                  <div className="relative shrink-0">
                    {conv.participant.avatar ? (
                      <img
                        src={conv.participant.avatar}
                        alt={conv.participant.name}
                        className="w-11 h-11 rounded-full object-cover border border-gray-200 dark:border-slate-700"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                        {conv.participant.name?.charAt(0)}
                      </div>
                    )}
                    {conv.participant.online && (
                      <span className="w-3 h-3 bg-emerald-500 border-2 border-white dark:border-[#131b2e] rounded-full absolute bottom-0 right-0" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs text-gray-900 dark:text-white truncate">
                        {conv.participant.name}
                      </h4>
                      <span className="text-[10px] text-gray-400 dark:text-slate-500">
                        {conv.lastMessage.timestamp}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 dark:text-slate-400 truncate mt-0.5">
                      {conv.participant.role}
                    </p>
                    <p className={`text-xs truncate mt-1 ${isSelected ? 'text-gray-800 dark:text-slate-200 font-medium' : 'text-gray-600 dark:text-slate-400'}`}>
                      {conv.lastMessage.text}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Right Pane: Chat Window */}
      {activeConv ? (
        <div className="flex-1 flex flex-col h-full bg-gray-50/30 dark:bg-slate-900/30">
          {/* Chat Top Header */}
          <div className="p-4 border-b border-gray-100 dark:border-slate-800 bg-white dark:bg-[#131b2e] flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                {activeConv.participant.avatar ? (
                  <img
                    src={activeConv.participant.avatar}
                    alt={activeConv.participant.name}
                    className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-slate-700"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    {activeConv.participant.name?.charAt(0)}
                  </div>
                )}
                {activeConv.participant.online && (
                  <span className="w-2.5 h-2.5 bg-emerald-500 border border-white dark:border-[#131b2e] rounded-full absolute bottom-0 right-0" />
                )}
              </div>
              <div>
                <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                  {activeConv.participant.name}
                </h3>
                <p className="text-[11px] text-gray-500 dark:text-slate-400">
                  {activeConv.participant.headline}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full flex items-center gap-1">
                <Circle className="w-2 h-2 fill-emerald-500 text-emerald-500" />
                <span>{activeConv.participant.online ? 'Online' : 'Away'}</span>
              </span>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {activeConv.messages.map((msg) => {
              const isMe = msg.senderId === user?.id;
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-md px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                      isMe
                        ? 'bg-blue-600 text-white rounded-br-xs shadow-xs'
                        : 'bg-white dark:bg-[#131b2e] text-gray-800 dark:text-slate-200 border border-gray-200/70 dark:border-slate-800 rounded-bl-xs shadow-2xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-gray-400 dark:text-slate-500 mt-1 px-1">
                    {msg.timestamp}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Chat Input Box */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-[#131b2e] flex items-center space-x-2"
          >
            <input
              type="text"
              placeholder={`Write a message to ${activeConv.participant.name}...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 text-xs px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-hidden focus:border-blue-500"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl transition cursor-pointer shadow-xs shrink-0"
              title="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center p-8 text-center text-gray-400">
          <div className="max-w-xs space-y-2">
            <MessageSquare className="w-8 h-8 mx-auto text-gray-300 dark:text-slate-600" />
            <p className="font-semibold text-gray-600 dark:text-slate-300 text-sm">No conversation selected</p>
            <p className="text-xs text-gray-400 dark:text-slate-500">Connect with other professionals or select a conversation to start chatting.</p>
          </div>
        </div>
      )}
    </div>
  );
};
