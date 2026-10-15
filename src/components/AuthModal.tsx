
"use client";

import { useState, type FormEvent } from "react";

export type AuthMode = "login" | "register";

type AuthModalProps = {
  mode: AuthMode;
  onClose: () => void;
  onSwitchMode: (mode: AuthMode) => void;
  onAuthenticated: (name: string) => void;
};

export default function AuthModal({
  mode,
  onClose,
  onSwitchMode,
  onAuthenticated,
}: AuthModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const isRegister = mode === "register";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Vul je e-mailadres en wachtwoord in.");
      return;
    }

    if (isRegister && !name.trim()) {
      setError("Vul je naam in.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Vul een geldig e-mailadres in.");
      return;
    }

    if (password.length < 8) {
      setError("Je wachtwoord moet minimaal 8 tekens bevatten.");
      return;
    }

    if (isRegister && password !== confirmPassword) {
      setError("De wachtwoorden komen niet overeen.");
      return;
    }

    // Demo: er wordt nog geen account aangemaakt of gecontroleerd.
    const displayName = isRegister
      ? name.trim()
      : email.split("@")[0];

    onAuthenticated(displayName);
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-title"
    >
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl sm:p-8">
        <button
          type="button"
          onClick={onClose}
          aria-label="Venster sluiten"
          className="absolute right-4 top-4 rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              d="m18 6-12 12M6 6l12 12"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <div className="mb-6">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
            <svg
              viewBox="0 0 24 24"
              className="h-7 w-7"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <circle cx="12" cy="8" r="4" />
              <path
                d="M4 21v-2a8 8 0 0 1 16 0v2"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <h2
            id="auth-title"
            className="text-2xl font-bold tracking-tight text-gray-900"
          >
            {isRegister ? "Account aanmaken" : "Welkom terug"}
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            {isRegister
              ? "Maak een account aan om samen te sporten."
              : "Log in om verder te gaan met SportConnect."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label
                htmlFor="auth-name"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Naam
              </label>
              <input
                id="auth-name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Je naam"
                required
                className="w-full rounded-lg border border-gray-200 px-3 py-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />
            </div>
          )}

          <div>
            <label
              htmlFor="auth-email"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              E-mailadres
            </label>
            <input
              id="auth-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="naam@voorbeeld.nl"
              required
              className="w-full rounded-lg border border-gray-200 px-3 py-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div>
            <label
              htmlFor="auth-password"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Wachtwoord
            </label>
            <input
              id="auth-password"
              type="password"
              autoComplete={isRegister ? "new-password" : "current-password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Minimaal 8 tekens"
              minLength={8}
              required
              className="w-full rounded-lg border border-gray-200 px-3 py-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          {isRegister && (
            <div>
              <label
                htmlFor="auth-confirm-password"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Bevestig wachtwoord
              </label>
              <input
                id="auth-confirm-password"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
                placeholder="Herhaal je wachtwoord"
                minLength={8}
                required
                className="w-full rounded-lg border border-gray-200 px-3 py-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />
            </div>
          )}

          {error && (
            <p
              role="alert"
              className="rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-lg bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
          >
            {isRegister ? "Registreren" : "Inloggen"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-gray-500">
          {isRegister ? "Heb je al een account?" : "Nog geen account?"}{" "}
          <button
            type="button"
            onClick={() => {
              setError("");
              onSwitchMode(isRegister ? "login" : "register");
            }}
            className="font-semibold text-emerald-700 hover:text-emerald-900"
          >
            {isRegister ? "Inloggen" : "Registreren"}
          </button>
        </p>

        <p className="mt-5 rounded-lg bg-gray-50 p-3 text-xs leading-5 text-gray-500">
          Demo: deze formulieren controleren alleen de invoer. Er worden
          nog geen echte accounts aangemaakt of gecontroleerd.
        </p>
      </div>
    </div>
  );
}
