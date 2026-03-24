import { useState } from "react";
import Icon from "@/components/ui/icon";

type Key = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "." | "+" | "-" | "*" | "/" | "=" | "C" | "±" | "%";

const SERVICES = [
  { label: "Платье вечернее", price: 12000 },
  { label: "Платье коктейльное", price: 8500 },
  { label: "Свадебное платье", price: 25000 },
  { label: "Костюм мужской", price: 15000 },
  { label: "Блузка/рубашка", price: 4500 },
  { label: "Брюки/юбка", price: 5500 },
  { label: "Пальто/куртка", price: 18000 },
  { label: "Ремонт одежды", price: 1500 },
];

export default function Calculator() {
  const [display, setDisplay] = useState("0");
  const [prev, setPrev] = useState<number | null>(null);
  const [op, setOp] = useState<string | null>(null);
  const [reset, setReset] = useState(false);

  function press(key: Key) {
    if (key === "C") {
      setDisplay("0"); setPrev(null); setOp(null); setReset(false);
      return;
    }
    if (key === "±") {
      setDisplay(d => String(parseFloat(d) * -1));
      return;
    }
    if (key === "%") {
      setDisplay(d => String(parseFloat(d) / 100));
      return;
    }
    if (["+", "-", "*", "/"].includes(key)) {
      setPrev(parseFloat(display));
      setOp(key);
      setReset(true);
      return;
    }
    if (key === "=") {
      if (prev !== null && op) {
        const cur = parseFloat(display);
        let result = 0;
        if (op === "+") result = prev + cur;
        if (op === "-") result = prev - cur;
        if (op === "*") result = prev * cur;
        if (op === "/") result = cur !== 0 ? prev / cur : 0;
        const str = String(parseFloat(result.toFixed(2)));
        setDisplay(str);
        setPrev(null); setOp(null); setReset(false);
      }
      return;
    }
    if (key === ".") {
      if (reset) { setDisplay("0."); setReset(false); return; }
      if (!display.includes(".")) setDisplay(d => d + ".");
      return;
    }
    if (reset) {
      setDisplay(key); setReset(false);
    } else {
      setDisplay(d => d === "0" ? key : d.length < 12 ? d + key : d);
    }
  }

  function addService(price: number) {
    setDisplay(d => {
      const cur = parseFloat(d) || 0;
      return String(parseFloat((cur + price).toFixed(2)));
    });
  }

  const buttons: Key[][] = [
    ["C", "±", "%", "/"],
    ["7", "8", "9", "*"],
    ["4", "5", "6", "-"],
    ["1", "2", "3", "+"],
    ["0", ".", "="],
  ];

  const labelMap: Record<string, string> = { "*": "×", "/": "÷" };
  const isOp = (k: string) => ["+", "-", "*", "/", "="].includes(k);

  return (
    <div className="min-h-screen bg-neutral-950">
      <header className="border-b border-neutral-800 px-6 py-4 flex justify-between items-center">
        <a href="/" className="text-white text-sm uppercase tracking-widest hover:text-neutral-400 transition-colors">
          Maison Couture
        </a>
        <a href="/#services" className="text-neutral-400 hover:text-white transition-colors text-sm uppercase tracking-widest flex items-center gap-2">
          <Icon name="ArrowLeft" size={14} />
          Назад
        </a>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <p className="text-neutral-400 text-xs uppercase tracking-widest mb-2">Ателье Maison Couture</p>
        <h1 className="text-white text-3xl font-bold mb-10">Калькулятор заказа</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Калькулятор */}
          <div className="lg:w-72 shrink-0">
            <div className="bg-neutral-900 overflow-hidden">
              {/* Дисплей */}
              <div className="px-5 pt-6 pb-4 text-right">
                <div className="text-neutral-500 text-xs h-4 mb-1 uppercase tracking-widest">
                  {prev !== null ? `${prev} ${labelMap[op!] ?? op}` : ""}
                </div>
                <div className="text-white font-light overflow-hidden" style={{
                  fontSize: display.length > 9 ? "1.5rem" : display.length > 6 ? "2rem" : "2.75rem",
                  lineHeight: 1,
                }}>
                  {Number(display).toLocaleString("ru-RU", { maximumFractionDigits: 2 })}
                </div>
              </div>

              {/* Кнопки */}
              <div className="grid grid-cols-4 gap-px bg-neutral-800">
                {buttons.map((row, ri) =>
                  row.map((key, ki) => {
                    const isZero = key === "0";
                    const isEq = key === "=";
                    const isOpKey = isOp(key);
                    const isActive = op === key;
                    return (
                      <button
                        key={`${ri}-${ki}`}
                        onClick={() => press(key)}
                        className={[
                          "h-16 text-lg font-light transition-all duration-150 active:scale-95",
                          isZero ? "col-span-2" : "",
                          isEq ? "bg-white text-black hover:bg-neutral-200" : "",
                          !isEq && isOpKey ? (isActive ? "bg-white text-black" : "bg-neutral-700 text-white hover:bg-neutral-600") : "",
                          !isEq && !isOpKey && key === "C" ? "bg-neutral-700 text-white hover:bg-neutral-600" : "",
                          !isEq && !isOpKey && key !== "C" && key !== "±" && key !== "%" ? "bg-neutral-900 text-white hover:bg-neutral-800" : "",
                          key === "±" || key === "%" ? "bg-neutral-700 text-white hover:bg-neutral-600" : "",
                        ].join(" ")}
                      >
                        {labelMap[key] ?? key}
                      </button>
                    );
                  })
                )}
              </div>

              <div className="px-5 py-4 border-t border-neutral-800">
                <div className="text-neutral-400 text-xs uppercase tracking-widest mb-1">Итого</div>
                <div className="text-white text-xl font-semibold">
                  {parseFloat(display || "0").toLocaleString("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 })}
                </div>
              </div>
            </div>
          </div>

          {/* Услуги */}
          <div className="flex-1">
            <p className="text-neutral-400 text-xs uppercase tracking-widest mb-4">Добавить услугу</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SERVICES.map((s) => (
                <button
                  key={s.label}
                  onClick={() => addService(s.price)}
                  className="flex justify-between items-center bg-neutral-900 hover:bg-neutral-800 transition-colors px-5 py-4 text-left group"
                >
                  <span className="text-white text-sm group-hover:text-neutral-200">{s.label}</span>
                  <span className="text-neutral-400 text-sm ml-4 shrink-0 group-hover:text-white transition-colors">
                    + {s.price.toLocaleString("ru-RU")} ₽
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-6 bg-neutral-900 p-5">
              <p className="text-neutral-400 text-xs uppercase tracking-widest mb-3">Как пользоваться</p>
              <ul className="text-neutral-500 text-sm flex flex-col gap-2">
                <li className="flex gap-2"><span className="text-neutral-600">—</span>Нажимайте кнопки услуг, чтобы добавить их стоимость к итогу</li>
                <li className="flex gap-2"><span className="text-neutral-600">—</span>Используйте калькулятор для ручного ввода и арифметики</li>
                <li className="flex gap-2"><span className="text-neutral-600">—</span>Кнопка «C» сбрасывает значение</li>
                <li className="flex gap-2"><span className="text-neutral-600">—</span>Цены ориентировочные, точная стоимость — после примерки</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
