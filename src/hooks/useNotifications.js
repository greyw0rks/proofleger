"use client";
import { useState, useEffect } from "react";
import { subscribeNotifications, removeNotification } from "@/lib/notifications";

export function useNotifications() {
  const [notes, setNotes] = useState([]);
  useEffect(() => subscribeNotifications(setNotes), []);
  return { notes, dismiss: removeNotification };
}