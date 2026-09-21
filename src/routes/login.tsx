import { BrandMark } from "@/components/brand-mark";
import { useState } from "react";
import type { FormEvent } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, LockKeyhole, Mail, Stethoscope } from "lucide-react";
import { toast } from "sonner";
import { loginToDashboard } from "@/lib/app-data";

export const Route = createFileRoute("/login")({ head: () => ({ meta: [{ title: "Sign in — Chirag Eye Care & Optics" }, { name: "description", content: "Secure sign in for Chirag Eye Care & Optics shop management." }, { property: "og:title", content: "Sign in — Chirag Eye Care & Optics" }, { property: "og:description", content: "Secure shop management access for Chirag Eye Care & Optics." }] }), component: Login });

function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("doctor@clearview.in");
  const [password, setPassword] = useState("password");

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!email || !password) {
      toast.error("Enter your email and password to continue.");
      return;
    }

    setLoading(true);
    try {
      await loginToDashboard(email, password);
      toast.success("Welcome back, Doctor.");
      navigate({ to: "/" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };
  return <main className="flex min-h-screen bg-surface-soft"><div className="hidden w-[46%] flex-col justify-between bg-primary p-10 text-primary-foreground lg:flex"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-foreground/15"><BrandMark /></span><span><strong className="block text-base">Chirag</strong><span className="text-[10px] font-semibold text-primary-foreground/90">EYE CARE & OPTICS</span></span></div><div className="max-w-md"><p className="mb-5 text-sm font-bold text-primary-foreground/90">SHOP MANAGEMENT, SIMPLIFIED</p><h1 className="text-5xl font-extrabold leading-tight tracking-[-0.04em]">Brighter vision.<br />Better care.</h1><p className="mt-6 max-w-sm text-base leading-7 text-primary-foreground/90">One calm workspace for patient care, prescriptions, spectacles, and daily collections.</p></div><p className="text-xs text-primary-foreground/90">© 2026 Chirag Eye Care & Optics · Private workspace</p></div><div className="flex w-full items-center justify-center p-5 sm:p-10 lg:w-[54%]"><div className="w-full max-w-[420px]"><div className="mb-10 flex items-center gap-3 lg:hidden"><span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground"><BrandMark /></span><span><strong className="block text-base text-ink">Chirag</strong><span className="text-[10px] font-semibold text-muted-foreground">EYE CARE & OPTICS</span></span></div><div className="mb-8"><div className="mb-3 inline-flex rounded-md bg-surface-blue p-2 text-info"><Stethoscope size={20} /></div><p className="eyebrow">Owner sign in</p><h2 className="mt-2 text-3xl font-extrabold tracking-tight text-ink">Welcome back</h2><p className="muted mt-2 text-sm">Sign in to manage today’s patients and collections.</p></div><form className="space-y-5" onSubmit={submit}><label className="block"><span className="field-label">Email address</span><span className="relative block"><Mail className="muted absolute left-3 top-1/2 -translate-y-1/2" size={17} /><input className="field-control pl-10" value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="doctor@clearview.in" autoComplete="email" /></span></label><label className="block"><span className="field-label">Password</span><span className="relative block"><LockKeyhole className="muted absolute left-3 top-1/2 -translate-y-1/2" size={17} /><input className="field-control pl-10 pr-11" value={password} onChange={(event) => setPassword(event.target.value)} type={showPassword ? "text" : "password"} placeholder="Enter password" autoComplete="current-password" /><button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-2 text-muted-foreground hover:bg-accent" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((current) => !current)}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></span></label><button className="btn-primary w-full" type="submit" disabled={loading}>{loading ? "Signing in…" : "Sign in"}</button></form><p className="mt-8 text-center text-xs text-muted-foreground">This is a private workspace for the shop owner.</p></div></div></main>;
}
