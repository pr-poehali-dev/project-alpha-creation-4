interface HeaderProps {
  className?: string;
}

export default function Header({ className }: HeaderProps) {
  const isLoggedIn = !!localStorage.getItem("session_token");

  return (
    <header className={`absolute top-0 left-0 right-0 z-10 p-6 ${className ?? ""}`}>
      <div className="flex justify-between items-center">
        <div className="text-white text-sm uppercase tracking-widest font-light">Maison Couture</div>
        <nav className="flex items-center gap-8">
          <a
            href="#services"
            className="text-white hover:text-neutral-400 transition-colors duration-300 uppercase text-sm"
          >
            Услуги
          </a>
          <a
            href="#about"
            className="text-white hover:text-neutral-400 transition-colors duration-300 uppercase text-sm"
          >
            О нас
          </a>
          <a
            href="#contact"
            className="text-white hover:text-neutral-400 transition-colors duration-300 uppercase text-sm"
          >
            Контакты
          </a>
          <a
            href={isLoggedIn ? "/cabinet" : "/auth"}
            className="border border-white text-white hover:bg-white hover:text-black transition-all duration-300 uppercase text-xs tracking-widest px-4 py-2"
          >
            {isLoggedIn ? "Кабинет" : "Войти"}
          </a>
        </nav>
      </div>
    </header>
  );
}