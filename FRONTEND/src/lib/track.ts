// Fire-and-forget analytics logging: never blocks the UI and never
// surfaces an error to the visitor if the backend is unreachable.
export const trackEvent = (eventType: string, detail: string = '') => {
  fetch('/api/track/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event_type: eventType, detail: detail.slice(0, 500) }),
  }).catch(() => { /* analytics failures are silently ignored */ });
};
