"use client";
import { useState, useCallback } from "react";

let _id = 0;

export function useNotification(maxVisible = 5) {
  const [notifications, setNotifications] = useState([]);

  const add = useCallback((message, type = "info", duration = 4000) => {
    const id = ++_id;
    setNotifications(prev => [...prev, { id, message, type, duration }].slice(-maxVisible));
    if (duration > 0) {
      setTimeout(() => remove(id), duration);
    }
    return id;
  }, [maxVisible]);

  const remove = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const info    = useCallback((msg, d) => add(msg, "info",    d), [add]);
  const success = useCallback((msg, d) => add(msg, "success", d), [add]);
  const warning = useCallback((msg, d) => add(msg, "warning", d), [add]);
  const error   = useCallback((msg, d) => add(msg, "error",   d), [add]);
  const clear   = useCallback(() => setNotifications([]), []);

  return { notifications, add, remove, info, success, warning, error, clear };
}