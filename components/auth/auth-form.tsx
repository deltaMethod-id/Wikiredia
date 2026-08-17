"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [message, setMessage] = useState("");

  async function submit(e: FormEvent) {
    e.preventDefault();
    setMessage("");
    const supabase = createClient();

    const result = mode === "signin"
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });

    setMessage(result.error?.message ?? (mode === "signup" ? "Check your email to verify your account." : "Signed in."));
  }

  return (
    <form className="auth-card" onSubmit={submit}>
      <span className="eyebrow">Account</span>
      <h2>{mode === "signin" ? "Welcome back" : "Create your account"}</h2>
      <input type="email" required placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" required minLength={8} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <button className="button primary" type="submit">{mode === "signin" ? "Sign in" : "Sign up"}</button>
      {message && <p className="form-message">{message}</p>}
      <button type="button" className="text-button" onClick={() => setMode(mode === "signin" ? "signup" : "signin")}>
        {mode === "signin" ? "Need an account?" : "Already have an account?"}
      </button>
    </form>
  );
}
