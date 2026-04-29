import { useState, useCallback } from 'react';

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ks_bookmarks') || '[]'); }
    catch { return []; }
  });

  const saveBookmarks = useCallback((bm) => {
    setBookmarks(bm);
    try { localStorage.setItem('ks_bookmarks', JSON.stringify(bm)); } catch (e) {}
  }, []);

  const isBookmarked = useCallback((id) => bookmarks.some(b => b.id === id), [bookmarks]);

  const toggleBookmark = useCallback((item) => {
    const exists = bookmarks.some(b => b.id === item.id);
    saveBookmarks(exists ? bookmarks.filter(b => b.id !== item.id) : [...bookmarks, item]);
  }, [bookmarks, saveBookmarks]);

  const clearAll = useCallback(() => {
    if (window.confirm('Remove all bookmarks?')) saveBookmarks([]);
  }, [saveBookmarks]);

  return { bookmarks, isBookmarked, toggleBookmark, clearAll };
}
