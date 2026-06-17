"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { User, Mail, Lock, Trash2, CheckCircle2, AlertCircle } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { createClient } from "@/lib/supabase/client";
import {
  getAccountInfo,
  updateDisplayName,
  updateEmail,
  sendPasswordReset,
  deleteAccount,
} from "./accountActions";

type Status = { ok: boolean; msg: string } | null;
type Step = "idle" | "verify-password" | "edit";

function Field({ label, id, children }: { label: string; id: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-xs font-medium uppercase tracking-wider text-muted">
        {label}
      </label>
      {children}
    </div>
  );
}

function StatusBadge({ status }: { status: Status }) {
  if (!status) return null;
  return (
    <span className={`flex items-center gap-1.5 text-xs ${status.ok ? "text-success" : "text-danger"}`}>
      {status.ok ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertCircle className="h-3.5 w-3.5" />}
      {status.msg}
    </span>
  );
}

function SectionTitle({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <div className="flex items-center gap-2 border-b border-border pb-3">
      <Icon className="h-4 w-4 text-muted" />
      <span className="text-sm font-semibold">{label}</span>
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-ink placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/40 transition-shadow";

const btnPrimary =
  "inline-flex items-center justify-center rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-50";

const btnGhost =
  "rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:bg-surface-hover hover:text-ink";

export function AccountSettings({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const a = t.settings.account;

  const [currentEmail, setCurrentEmail] = useState("");
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    getAccountInfo().then((info) => {
      if (!info) return;
      setCurrentEmail(info.email);
      setDisplayName(info.displayName);
    });
  }, []);

  /* ── helper : vérification de mot de passe ── */
  async function verifyPassword(
    password: string,
    onSuccess: () => void,
    onError: (msg: string) => void,
    setChecking: (v: boolean) => void,
  ) {
    setChecking(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: currentEmail,
      password,
    });
    setChecking(false);
    if (error) onError(a.emailPasswordWrong);
    else onSuccess();
  }

  /* ── Display name — multi-step ── */
  const [nameStep, setNameStep] = useState<Step>("idle");
  const [namePassword, setNamePassword] = useState("");
  const [namePasswordError, setNamePasswordError] = useState<string | null>(null);
  const [namePasswordChecking, setNamePasswordChecking] = useState(false);
  const [nameStatus, setNameStatus] = useState<Status>(null);
  const [namePending, startNameTransition] = useTransition();
  const newNameRef = useRef<HTMLInputElement>(null);

  function handleNameVerifyPassword() {
    if (!namePassword) return;
    setNamePasswordError(null);
    verifyPassword(
      namePassword,
      () => { setNameStep("edit"); setNamePassword(""); setTimeout(() => newNameRef.current?.focus(), 50); },
      (msg) => setNamePasswordError(msg),
      setNamePasswordChecking,
    );
  }

  function handleNameSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setNameStatus(null);
    const fd = new FormData(e.currentTarget);
    startNameTransition(async () => {
      const res = await updateDisplayName(fd);
      setNameStatus(
        res.error ? { ok: false, msg: res.error } : { ok: true, msg: a.displayNameSaved },
      );
      if (!res.error) {
        setDisplayName(fd.get("display_name") as string);
        setNameStep("idle");
      }
    });
  }

  function resetNameFlow() {
    setNameStep("idle");
    setNamePassword("");
    setNamePasswordError(null);
    setNameStatus(null);
  }

  /* ── Email — multi-step ── */
  const [emailStep, setEmailStep] = useState<Step>("idle");
  const [emailPassword, setEmailPassword] = useState("");
  const [emailPasswordError, setEmailPasswordError] = useState<string | null>(null);
  const [emailPasswordChecking, setEmailPasswordChecking] = useState(false);
  const [emailStatus, setEmailStatus] = useState<Status>(null);
  const [emailPending, startEmailTransition] = useTransition();
  const newEmailRef = useRef<HTMLInputElement>(null);

  function handleEmailVerifyPassword() {
    if (!emailPassword) return;
    setEmailPasswordError(null);
    verifyPassword(
      emailPassword,
      () => { setEmailStep("edit"); setEmailPassword(""); setTimeout(() => newEmailRef.current?.focus(), 50); },
      (msg) => setEmailPasswordError(msg),
      setEmailPasswordChecking,
    );
  }

  function handleEmailSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEmailStatus(null);
    const fd = new FormData(e.currentTarget);
    startEmailTransition(async () => {
      const res = await updateEmail(fd);
      setEmailStatus(
        res.error ? { ok: false, msg: res.error } : { ok: true, msg: a.emailSaved },
      );
      if (!res.error) {
        (e.target as HTMLFormElement).reset();
        setEmailStep("idle");
      }
    });
  }

  function resetEmailFlow() {
    setEmailStep("idle");
    setEmailPassword("");
    setEmailPasswordError(null);
    setEmailStatus(null);
  }

  /* ── Password reset ── */
  const [pwResetStatus, setPwResetStatus] = useState<Status>(null);
  const [pwResetPending, startPwResetTransition] = useTransition();

  function handlePasswordReset() {
    setPwResetStatus(null);
    startPwResetTransition(async () => {
      const res = await sendPasswordReset();
      setPwResetStatus(
        res.error ? { ok: false, msg: res.error } : { ok: true, msg: a.passwordResetSent },
      );
    });
  }

  /* ── Delete account ── */
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");
  const [deleteStatus, setDeleteStatus] = useState<Status>(null);
  const [deletePending, startDeleteTransition] = useTransition();

  function handleDelete() {
    if (deleteInput !== "DELETE") return;
    startDeleteTransition(async () => {
      const res = await deleteAccount();
      if (res?.error) setDeleteStatus({ ok: false, msg: res.error });
    });
  }

  return (
    <div className="flex flex-col gap-6">

      {/* ── Profil ── */}
      <section className="flex flex-col gap-4">
        <SectionTitle icon={User} label={a.profileSection} />
        <div className="flex flex-col gap-2">

          {/* Pseudo actuel — toujours visible */}
          <input
            type="text"
            value={displayName || a.displayNamePlaceholder}
            disabled
            readOnly
            title={a.displayNameLabel}
            aria-label={a.displayNameLabel}
            className={`${inputClass} cursor-not-allowed opacity-50`}
          />

          {/* Étape 1 : lien */}
          {nameStep === "idle" && (
            <button
              type="button"
              onClick={() => setNameStep("verify-password")}
              className="self-start text-sm font-medium text-accent transition-opacity hover:opacity-70"
            >
              {a.displayNameResetLink}
            </button>
          )}

          {/* Étape 2 : vérification mot de passe */}
          {nameStep === "verify-password" && (
            <div className="flex flex-col gap-2 rounded-xl border border-border bg-canvas p-3">
              <Field label={a.emailPasswordLabel} id="name-verify-password">
                <input
                  id="name-verify-password"
                  type="password"
                  value={namePassword}
                  onChange={(e) => setNamePassword(e.target.value)}
                  placeholder={a.emailPasswordPlaceholder}
                  autoComplete="current-password"
                  autoFocus
                  className={inputClass}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleNameVerifyPassword(); } }}
                />
              </Field>
              {namePasswordError && (
                <StatusBadge status={{ ok: false, msg: namePasswordError }} />
              )}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleNameVerifyPassword}
                  disabled={namePasswordChecking || !namePassword}
                  className={btnPrimary}
                >
                  {namePasswordChecking ? a.emailPasswordChecking : a.emailPasswordConfirm}
                </button>
                <button type="button" onClick={resetNameFlow} className={btnGhost}>
                  {a.displayNameCancel}
                </button>
              </div>
            </div>
          )}

          {/* Étape 3 : saisie du nouveau pseudo */}
          {nameStep === "edit" && (
            <form onSubmit={handleNameSubmit} className="flex flex-col gap-2 rounded-xl border border-border bg-canvas p-3">
              <Field label={a.displayNameLabel} id="display_name">
                <input
                  ref={newNameRef}
                  id="display_name"
                  name="display_name"
                  type="text"
                  defaultValue={displayName}
                  placeholder={a.displayNamePlaceholder}
                  className={inputClass}
                />
              </Field>
              <div className="flex items-center gap-2">
                <button type="submit" disabled={namePending} className={btnPrimary}>
                  {namePending ? a.displayNameSaving : a.displayNameSave}
                </button>
                <button type="button" onClick={resetNameFlow} className={btnGhost}>
                  {a.displayNameCancel}
                </button>
                <StatusBadge status={nameStatus} />
              </div>
            </form>
          )}
        </div>
      </section>

      {/* ── Email ── */}
      <section className="flex flex-col gap-4">
        <SectionTitle icon={Mail} label={a.emailSection} />
        <div className="flex flex-col gap-2">

          {/* Email actuel — toujours visible */}
          <input
            type="email"
            value={currentEmail}
            disabled
            readOnly
            title={a.emailCurrentLabel}
            aria-label={a.emailCurrentLabel}
            className={`${inputClass} cursor-not-allowed opacity-50`}
          />

          {/* Étape 1 : lien de départ */}
          {emailStep === "idle" && (
            <button
              type="button"
              onClick={() => setEmailStep("verify-password")}
              className="self-start text-sm font-medium text-accent transition-opacity hover:opacity-70"
            >
              {a.emailResetLink}
            </button>
          )}

          {/* Étape 2 : vérification du mot de passe */}
          {emailStep === "verify-password" && (
            <div className="flex flex-col gap-2 rounded-xl border border-border bg-canvas p-3">
              <Field label={a.emailPasswordLabel} id="email-verify-password">
                <input
                  id="email-verify-password"
                  type="password"
                  value={emailPassword}
                  onChange={(e) => setEmailPassword(e.target.value)}
                  placeholder={a.emailPasswordPlaceholder}
                  autoComplete="current-password"
                  autoFocus
                  className={inputClass}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleEmailVerifyPassword(); } }}
                />
              </Field>
              {emailPasswordError && (
                <StatusBadge status={{ ok: false, msg: emailPasswordError }} />
              )}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleEmailVerifyPassword}
                  disabled={emailPasswordChecking || !emailPassword}
                  className={btnPrimary}
                >
                  {emailPasswordChecking ? a.emailPasswordChecking : a.emailPasswordConfirm}
                </button>
                <button type="button" onClick={resetEmailFlow} className={btnGhost}>
                  {a.emailCancel}
                </button>
              </div>
            </div>
          )}

          {/* Étape 3 : saisie du nouvel email */}
          {emailStep === "edit" && (
            <form onSubmit={handleEmailSubmit} className="flex flex-col gap-2 rounded-xl border border-border bg-canvas p-3">
              <Field label={a.emailNewLabel} id="email">
                <input
                  ref={newEmailRef}
                  id="email"
                  name="email"
                  type="email"
                  placeholder={a.emailNewPlaceholder}
                  autoComplete="email"
                  className={inputClass}
                />
              </Field>
              <p className="text-xs text-muted">{a.emailHelper}</p>
              <div className="flex items-center gap-2">
                <button type="submit" disabled={emailPending} className={btnPrimary}>
                  {emailPending ? a.emailSaving : a.emailSave}
                </button>
                <button type="button" onClick={resetEmailFlow} className={btnGhost}>
                  {a.emailCancel}
                </button>
                <StatusBadge status={emailStatus} />
              </div>
            </form>
          )}
        </div>
      </section>

      {/* ── Mot de passe ── */}
      <section className="flex flex-col gap-4">
        <SectionTitle icon={Lock} label={a.passwordSection} />
        <div className="flex flex-col gap-2">
          <input
            type="password"
            value={a.passwordMasked}
            disabled
            readOnly
            title={a.passwordSection}
            aria-label={a.passwordSection}
            className={`${inputClass} cursor-not-allowed font-mono tracking-widest opacity-60`}
          />
          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={pwResetPending}
              onClick={handlePasswordReset}
              className="self-start text-sm font-medium text-accent transition-opacity hover:opacity-70 disabled:opacity-40"
            >
              {pwResetPending ? a.passwordResetSending : a.passwordResetLink}
            </button>
            <StatusBadge status={pwResetStatus} />
          </div>
        </div>
      </section>

      {/* ── Zone de danger ── */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-2 border-b border-danger/30 pb-3">
          <Trash2 className="h-4 w-4 text-danger" />
          <span className="text-sm font-semibold text-danger">{a.dangerSection}</span>
        </div>

        <div className="rounded-xl border border-danger/20 bg-danger-surface/30 p-4">
          <p className="text-sm font-medium">{a.deleteTitle}</p>
          <p className="mt-1 text-xs text-muted">{a.deleteDescription}</p>

          {!showDeleteConfirm ? (
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="mt-4 inline-flex items-center gap-2 rounded-lg border border-danger px-4 py-2 text-sm font-medium text-danger transition-colors hover:bg-danger hover:text-white"
            >
              <Trash2 className="h-4 w-4" />
              {a.deleteButton}
            </button>
          ) : (
            <div className="mt-4 flex flex-col gap-3">
              <label
                htmlFor="delete-confirm"
                className="text-xs font-medium text-danger"
              >
                {a.deleteConfirmPrompt}
              </label>
              <input
                id="delete-confirm"
                type="text"
                value={deleteInput}
                onChange={(e) => setDeleteInput(e.target.value)}
                placeholder={a.deleteConfirmPlaceholder}
                className={`${inputClass} border-danger/40 font-mono`}
              />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleteInput !== "DELETE" || deletePending}
                  className="inline-flex items-center justify-center rounded-lg bg-danger px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-40"
                >
                  {a.deleteConfirmButton}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowDeleteConfirm(false); setDeleteInput(""); setDeleteStatus(null); }}
                  className={btnGhost}
                >
                  {a.deleteCancelButton}
                </button>
                <StatusBadge status={deleteStatus} />
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
