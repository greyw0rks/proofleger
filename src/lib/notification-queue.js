const subscribers = new Set();
let queue = [];
let idCounter = 0;

export const TYPES = { SUCCESS:"success", ERROR:"error", INFO:"info", WARNING:"warning" };

export function notify(message, type = TYPES.INFO, duration = 4000) {
  const id = ++idCounter;
  const notification = { id, message, type, duration };
  queue = [...queue, notification];
  subscribers.forEach(fn => fn([...queue]));
  if (duration > 0) {
    setTimeout(() => dismiss(id), duration);
  }
  return id;
}

export function dismiss(id) {
  queue = queue.filter(n => n.id !== id);
  subscribers.forEach(fn => fn([...queue]));
}

export function subscribe(fn) {
  subscribers.add(fn);
  return () => subscribers.delete(fn);
}

export const toast = {
  success: (msg, d) => notify(msg, TYPES.SUCCESS, d),
  error:   (msg, d) => notify(msg, TYPES.ERROR, d),
  info:    (msg, d) => notify(msg, TYPES.INFO, d),
  warning: (msg, d) => notify(msg, TYPES.WARNING, d),
};