import { useState } from "react";
import { useNavigate } from "react-router-dom";
import func2url from "../../backend/func2url.json";

const AUTH_URL = func2url.auth;

type Tab = "login" | "register";

export default function Auth() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({ name: "", email: "", password: "", confirm: "" });

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch(`${AUTH_URL}?action=login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: loginForm.email, password: loginForm.password }),
    });
    const data = JSON.parse(await res.text().then(t => {
      try { return JSON.parse(t); } catch { return t; }
    }).catch(() => ({})));
    setLoading(false);
    if (!res.ok) { setError(data.error || "Ошибка входа"); return; }
    const parsed = typeof data === "string" ? JSON.parse(data) : data;
    localStorage.setItem("session_token", parsed.token);
    localStorage.setItem("user_name", parsed.name);
    localStorage.setItem("user_email", parsed.email);
    navigate("/cabinet");
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (registerForm.password !== registerForm.confirm) {
      setError("Пароли не совпадают");
      return;
    }
    setLoading(true);
    const res = await fetch(`${AUTH_URL}?action=register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: registerForm.name, email: registerForm.email, password: registerForm.password }),
    });
    const text = await res.text();
    let parsed: Record<string, string> = {};
    try { parsed = JSON.parse(JSON.parse(text)); } catch { try { parsed = JSON.parse(text); } catch { /* */ } }
    setLoading(false);
    if (!res.ok) { setError(parsed.error || "Ошибка регистрации"); return; }
    localStorage.setItem("session_token", parsed.token);
    localStorage.setItem("user_name", parsed.name);
    localStorage.setItem("user_email", parsed.email);
    navigate("/cabinet");
  }

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <a href="/" className="block text-center text-white text-sm uppercase tracking-widest mb-10 hover:text-neutral-400 transition-colors">
          ← Maison Couture
        </a>

        <div className="bg-neutral-900 p-8">
          <div className="flex mb-8 border-b border-neutral-700">
            <button
              onClick={() => { setTab("login"); setError(""); }}
              className={`flex-1 pb-3 text-sm uppercase tracking-widest transition-colors ${
                tab === "login" ? "text-white border-b-2 border-white -mb-px" : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              Войти
            </button>
            <button
              onClick={() => { setTab("register"); setError(""); }}
              className={`flex-1 pb-3 text-sm uppercase tracking-widest transition-colors ${
                tab === "register" ? "text-white border-b-2 border-white -mb-px" : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              Регистрация
            </button>
          </div>

          {error && (
            <div className="mb-6 px-4 py-3 bg-red-900/30 border border-red-700 text-red-300 text-sm">
              {error}
            </div>
          )}

          {tab === "login" ? (
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div>
                <label className="block text-neutral-400 text-xs uppercase tracking-widest mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={loginForm.email}
                  onChange={e => setLoginForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full bg-neutral-800 border border-neutral-700 text-white px-4 py-3 text-sm focus:outline-none focus:border-neutral-500 transition-colors"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-neutral-400 text-xs uppercase tracking-widest mb-2">Пароль</label>
                <input
                  type="password"
                  required
                  value={loginForm.password}
                  onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))}
                  className="w-full bg-neutral-800 border border-neutral-700 text-white px-4 py-3 text-sm focus:outline-none focus:border-neutral-500 transition-colors"
                  placeholder="••••••"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="mt-2 bg-white text-black uppercase tracking-widest text-sm px-6 py-3 hover:bg-neutral-200 transition-colors disabled:opacity-50"
              >
                {loading ? "Входим..." : "Войти"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="flex flex-col gap-4">
              <div>
                <label className="block text-neutral-400 text-xs uppercase tracking-widest mb-2">Имя</label>
                <input
                  type="text"
                  required
                  value={registerForm.name}
                  onChange={e => setRegisterForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full bg-neutral-800 border border-neutral-700 text-white px-4 py-3 text-sm focus:outline-none focus:border-neutral-500 transition-colors"
                  placeholder="Ваше имя"
                />
              </div>
              <div>
                <label className="block text-neutral-400 text-xs uppercase tracking-widest mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={registerForm.email}
                  onChange={e => setRegisterForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full bg-neutral-800 border border-neutral-700 text-white px-4 py-3 text-sm focus:outline-none focus:border-neutral-500 transition-colors"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-neutral-400 text-xs uppercase tracking-widest mb-2">Пароль</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={registerForm.password}
                  onChange={e => setRegisterForm(f => ({ ...f, password: e.target.value }))}
                  className="w-full bg-neutral-800 border border-neutral-700 text-white px-4 py-3 text-sm focus:outline-none focus:border-neutral-500 transition-colors"
                  placeholder="Минимум 6 символов"
                />
              </div>
              <div>
                <label className="block text-neutral-400 text-xs uppercase tracking-widest mb-2">Повторите пароль</label>
                <input
                  type="password"
                  required
                  value={registerForm.confirm}
                  onChange={e => setRegisterForm(f => ({ ...f, confirm: e.target.value }))}
                  className="w-full bg-neutral-800 border border-neutral-700 text-white px-4 py-3 text-sm focus:outline-none focus:border-neutral-500 transition-colors"
                  placeholder="••••••"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="mt-2 bg-white text-black uppercase tracking-widest text-sm px-6 py-3 hover:bg-neutral-200 transition-colors disabled:opacity-50"
              >
                {loading ? "Регистрируем..." : "Создать аккаунт"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
