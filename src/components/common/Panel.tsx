import type { ReactNode } from 'react';

export function Panel({ title, eyebrow, children, className = '' }: { title?: string; eyebrow?: string; children: ReactNode; className?: string }) {
  return <section className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-panel ${className}`}>
    {(eyebrow || title) && <header className="mb-4">{eyebrow && <p className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">{eyebrow}</p>}{title && <h2 className="text-lg font-bold text-slate-900">{title}</h2>}</header>}
    {children}
  </section>;
}
