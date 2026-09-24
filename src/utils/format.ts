export function formatAction(action: string) {
  return action.split('_').map(w => w[0] + w.slice(1).toLowerCase()).join(' ');
}

export function formatDate(iso?: string) {
  if (!iso) return '—';
  return new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(iso));
}
