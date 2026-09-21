import type { ReactNode } from "react";
import { AlertCircle, Check, ChevronRight, LoaderCircle, Search } from "./icons";
import { Link } from "@tanstack/react-router";
import { formatCurrency, getStatusClass } from "@/lib/app-data";

export function StatusChip({ status }: { status: string }) {
  return <span className={getStatusClass(status)}><span aria-hidden="true">●</span>{status}</span>;
}

export function Currency({ value, className = "" }: { value: number; className?: string }) {
  return <span className={className}>{formatCurrency(value)}</span>;
}

export function PageHeader({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: ReactNode }) {
  return <div className="mb-6 flex flex-wrap items-start justify-between gap-4"><div><div className="eyebrow mb-2">{eyebrow}</div><h1 className="page-title">{title}</h1>{description && <p className="muted mt-1 max-w-2xl text-sm">{description}</p>}</div>{action}</div>;
}

export function SearchField({ value, onChange, placeholder = "Search patients..." }: { value: string; onChange: (value: string) => void; placeholder?: string }) {
  return <label className="relative block w-full"><span className="sr-only">{placeholder}</span><Search className="muted absolute left-3 top-1/2 -translate-y-1/2" size={17} /><input className="field-control pl-10" value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} /></label>;
}

export function EmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return <div className="flex min-h-52 flex-col items-center justify-center p-8 text-center"><div className="mb-3 rounded-full bg-surface-blue p-3 text-info"><ClipboardEmptyIcon /></div><h2 className="font-bold text-ink">{title}</h2><p className="muted mt-1 max-w-sm text-sm">{description}</p>{action && <div className="mt-4">{action}</div>}</div>;
}

function ClipboardEmptyIcon() { return <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 5h6M9 4a3 3 0 0 1 6 0M7 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2" /><path d="M8 11h8M8 15h6" /></svg>; }

export function LoadingState({ label = "Loading records..." }: { label?: string }) { return <div className="flex min-h-52 items-center justify-center gap-2 muted text-sm"><LoaderCircle className="animate-spin" size={18} />{label}</div>; }

export function ErrorState({ onRetry }: { onRetry?: () => void }) { return <div className="flex min-h-52 flex-col items-center justify-center p-8 text-center"><AlertCircle className="text-danger" size={25} /><h2 className="mt-3 font-bold text-ink">Something went wrong</h2><p className="muted mt-1 text-sm">We couldn’t load this information. Please try again.</p>{onRetry && <button className="btn-secondary mt-4" onClick={onRetry}>Try again</button>}</div>; }

export function SectionTitle({ title, action }: { title: string; action?: ReactNode }) { return <div className="mb-4 flex items-center justify-between gap-3"><h2 className="font-bold text-ink">{title}</h2>{action}</div>; }

export function ViewLink({ to = "/patients", children = "View" }: { to?: "/patients" | "/payments" | "/spectacles"; children?: ReactNode }) { return <Link to={to} className="inline-flex items-center gap-1 text-sm font-bold text-info hover:underline">{children}<ChevronRight size={15} /></Link>; }

export function FormMessage({ children }: { children?: ReactNode }) { return children ? <p role="alert" className="mt-1 flex items-center gap-1 text-xs font-semibold text-danger"><AlertCircle size={13} />{children}</p> : null; }

export function SuccessMark() { return <span className="inline-flex rounded-full bg-success-soft p-1 text-success"><Check size={13} /></span>; }