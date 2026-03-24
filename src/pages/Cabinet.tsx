import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";
import func2url from "../../backend/func2url.json";

const AUTH_URL = func2url.auth;

interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

export default function Cabinet() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("session_token");
    if (!token) { navigate("/auth"); return; }

    const name = localStorage.getItem("user_name") || "";
    const email = localStorage.getItem("user_email") || "";
    if (name && email) {
      setUser({ id: 0, name, email, createdAt: "" });
      setLoading(false);
      return;
    }

    fetch(`${AUTH_URL}?action=me`, {
      headers: { "X-Session-Token": token },
    })
      .then(r => r.text())
      .then(text => {
        let data: User;
        try { data = JSON.parse(JSON.parse(text)); } catch { data = JSON.parse(text); }
        setUser(data);
      })
      .catch(() => navigate("/auth"))
      .finally(() => setLoading(false));
  }, [navigate]);

  function handleLogout() {
    const token = localStorage.getItem("session_token");
    if (token) {
      fetch(`${AUTH_URL}?action=logout`, {
        method: "POST",
        headers: { "X-Session-Token": token },
      }).catch(() => {});
    }
    localStorage.removeItem("session_token");
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_email");
    navigate("/");
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-neutral-400 text-sm uppercase tracking-widest">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950">
      <header className="border-b border-neutral-800 px-6 py-4 flex justify-between items-center">
        <a href="/" className="text-white text-sm uppercase tracking-widest hover:text-neutral-400 transition-colors">
          Maison Couture
        </a>
        <button
          onClick={handleLogout}
          className="text-neutral-400 hover:text-white transition-colors text-sm uppercase tracking-widest flex items-center gap-2"
        >
          <Icon name="LogOut" size={14} />
          Выйти
        </button>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-white text-3xl font-bold mb-2">Личный кабинет</h1>
        <p className="text-neutral-400 text-sm mb-12">Добро пожаловать, {user?.name}</p>

        <div className="grid gap-4">
          <div className="bg-neutral-900 p-6">
            <h2 className="text-neutral-400 text-xs uppercase tracking-widest mb-4">Профиль</h2>
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center py-3 border-b border-neutral-800">
                <span className="text-neutral-400 text-sm">Имя</span>
                <span className="text-white text-sm">{user?.name}</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-neutral-400 text-sm">Email</span>
                <span className="text-white text-sm">{user?.email}</span>
              </div>
            </div>
          </div>

          <div className="bg-neutral-900 p-6">
            <h2 className="text-neutral-400 text-xs uppercase tracking-widest mb-4">Мои заказы</h2>
            <div className="flex flex-col items-center py-10 gap-3">
              <Icon name="Scissors" size={32} className="text-neutral-600" />
              <p className="text-neutral-500 text-sm">У вас пока нет заказов</p>
              <a
                href="/#services"
                className="mt-2 border border-neutral-600 text-neutral-300 hover:text-white hover:border-white transition-colors text-xs uppercase tracking-widest px-5 py-2"
              >
                Заказать пошив
              </a>
            </div>
          </div>

          <div className="bg-neutral-900 p-6">
            <h2 className="text-neutral-400 text-xs uppercase tracking-widest mb-4">Записи на примерку</h2>
            <div className="flex flex-col items-center py-10 gap-3">
              <Icon name="Calendar" size={32} className="text-neutral-600" />
              <p className="text-neutral-500 text-sm">Нет активных записей</p>
              <a
                href="/#contact"
                className="mt-2 border border-neutral-600 text-neutral-300 hover:text-white hover:border-white transition-colors text-xs uppercase tracking-widest px-5 py-2"
              >
                Записаться
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
