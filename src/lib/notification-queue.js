/**
 * Singleton notification queue — lets non-component code fire toasts
 * Usage: import { toast } from "@/lib/notification-queue"
 *        toast.success("Anchored!")
 */
class NotificationQueue {
  constructor() { this._listeners = []; }

  _emit(msg, type, duration) {
    this._listeners.forEach(fn => fn({ message: msg, type, duration }));
  }

  subscribe(fn) {
    this._listeners.push(fn);
    return () => { this._listeners = this._listeners.filter(l => l !== fn); };
  }

  info(msg, duration = 4000)    { this._emit(msg, "info",    duration); }
  success(msg, duration = 4000) { this._emit(msg, "success", duration); }
  warning(msg, duration = 5000) { this._emit(msg, "warning", duration); }
  error(msg, duration = 6000)   { this._emit(msg, "error",   duration); }
}

export const toast = new NotificationQueue();