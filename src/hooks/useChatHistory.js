import { useState, useCallback } from 'react';

const STORAGE_KEY = 'ks_chat_history';

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function autoTitle(messages) {
  const first = messages.find(m => m.role === 'user');
  if (!first) return 'New Conversation';
  const q = first.content.trim();
  return q.length > 60 ? q.slice(0, 57) + '…' : q;
}

export function useChatHistory() {
  const [conversations, setConversations] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
  });

  const persist = useCallback((list) => {
    setConversations(list);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); } catch (e) {}
  }, []);

  const saveConversation = useCallback((messages, customTitle) => {
    if (!messages || messages.length === 0) return null;
    const id = genId();
    const entry = {
      id,
      title: customTitle || autoTitle(messages),
      messages,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messageCount: messages.length,
    };
    const updated = [entry, ...conversations];
    persist(updated);
    return id;
  }, [conversations, persist]);

  const updateConversation = useCallback((id, messages, customTitle) => {
    const updated = conversations.map(c =>
      c.id === id
        ? { ...c, messages, title: customTitle || c.title, updatedAt: new Date().toISOString(), messageCount: messages.length }
        : c
    );
    persist(updated);
  }, [conversations, persist]);

  const loadConversation = useCallback((id) => {
    return conversations.find(c => c.id === id) || null;
  }, [conversations]);

  const deleteConversation = useCallback((id) => {
    persist(conversations.filter(c => c.id !== id));
  }, [conversations, persist]);

  const clearAll = useCallback(() => {
    if (window.confirm('Delete all chat history? This cannot be undone.')) {
      persist([]);
    }
  }, [persist]);

  return {
    conversations,
    saveConversation,
    updateConversation,
    loadConversation,
    deleteConversation,
    clearAll,
  };
}
