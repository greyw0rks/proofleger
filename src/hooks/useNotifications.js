"use client";
import { useState, useEffect } from "react";
import { subscribe, dismiss } from "@/lib/notification-queue";

export function useNotifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const unsub = subscribe(setNotifications);
    return unsub;
  }, []);

  return { notifications, dismiss };
}