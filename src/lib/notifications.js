const queue = [];
let listeners = [];

export function addNotification(msg, type = "info", duration = 4000) {
  const note = { id: Date.now() + Math.random(), msg, type, duration };
  queue.push(note);
  listeners.forEach(l => l([...queue]));
  setTimeout(() => removeNotification(note.id), duration);
  return note.id;
}

export function removeNotification(id) {
  const idx = queue.findIndex(n => n.id === id);
  if (idx > -1) { queue.splice(idx, 1); listeners.forEach(l => l([...queue])); }
}

export function subscribeNotifications(fn) {
  listeners.push(fn);
  return () => { listeners = listeners.filter(l => l !== fn); };
}

export const notify = {
  success: (msg) => addNotification(msg, "success"),
  error:   (msg) => addNotification(msg, "error"),
  info:    (msg) => addNotification(msg, "info"),
  warn:    (msg) => addNotification(msg, "warn"),
};