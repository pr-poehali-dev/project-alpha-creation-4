export default function Featured() {
  const advantages = [
    {
      number: "01",
      title: "Индивидуальный пошив",
      desc: "Каждое изделие создаётся по вашим меркам и с учётом всех пожеланий — от выбора ткани до последней пуговицы.",
    },
    {
      number: "02",
      title: "Премиальные материалы",
      desc: "Работаем только с проверенными поставщиками тканей из Италии, Франции и Японии. Качество — в каждом прикосновении.",
    },
    {
      number: "03",
      title: "Мастера с опытом 15+ лет",
      desc: "Наши закройщики и портные прошли школу haute couture. Они знают, как сделать так, чтобы вы выглядели безупречно.",
    },
    {
      number: "04",
      title: "Срочные заказы",
      desc: "Важное мероприятие уже скоро? Принимаем срочные заказы с гарантией соблюдения сроков без потери качества.",
    },
  ];

  return (
    <div id="services" className="bg-white px-6 py-24 lg:py-32">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:gap-24">
          <div className="lg:w-5/12 mb-16 lg:mb-0">
            <p className="uppercase tracking-[0.3em] text-xs text-neutral-500 mb-4">Наши услуги</p>
            <h2 className="text-4xl lg:text-5xl font-bold text-neutral-900 leading-tight mb-8">
              Мастерство,<br/>вшитое в каждый шов
            </h2>
            <p className="text-neutral-500 leading-relaxed mb-10">
              В нашем ателье вы найдёте полный спектр услуг по пошиву и ремонту одежды. Мы работаем с вечерними платьями, деловыми костюмами, свадебными нарядами и повседневными образами.
            </p>
            <div className="flex flex-col gap-3">
              <div className="flex gap-4 text-sm text-neutral-700">
                <span className="text-neutral-400">—</span>Вечерние и коктейльные платья
              </div>
              <div className="flex gap-4 text-sm text-neutral-700">
                <span className="text-neutral-400">—</span>Свадебные наряды и аксессуары
              </div>
              <div className="flex gap-4 text-sm text-neutral-700">
                <span className="text-neutral-400">—</span>Деловые костюмы и рубашки
              </div>
              <div className="flex gap-4 text-sm text-neutral-700">
                <span className="text-neutral-400">—</span>Ремонт и реставрация одежды
              </div>
            </div>
            <div className="mt-10 flex flex-col sm:flex-row gap-3">
              <button className="bg-black text-white border border-black px-6 py-3 text-sm transition-all duration-300 hover:bg-white hover:text-black cursor-pointer uppercase tracking-widest">
                Заказать пошив
              </button>
              <a
                href="/calculator"
                className="flex items-center justify-center gap-2 border border-neutral-300 text-neutral-700 px-6 py-3 text-sm transition-all duration-300 hover:bg-black hover:text-white hover:border-black uppercase tracking-widest"
              >
                Рассчитать стоимость
              </a>
            </div>
          </div>

          <div className="lg:w-7/12 flex flex-col gap-0">
            {advantages.map((item, i) => (
              <div
                key={i}
                className="flex gap-6 py-8 border-b border-neutral-100 group"
              >
                <span className="text-xs text-neutral-400 pt-1 shrink-0 font-mono">{item.number}</span>
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2 group-hover:text-neutral-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-neutral-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-24 relative overflow-hidden rounded-sm">
          <img
            src="https://cdn.poehali.dev/projects/ec0125d2-444a-4666-aad2-a7e69579cd9d/files/6771ba55-ca4e-41b1-a885-c983d245ef53.jpg"
            alt="Мастер за работой"
            className="w-full h-[400px] lg:h-[500px] object-cover"
          />
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-center text-white">
              <p className="uppercase tracking-[0.4em] text-sm mb-4 opacity-70">Каждая деталь важна</p>
              <h3 className="text-3xl lg:text-5xl font-bold">Ручная работа.<br/>Безупречный результат.</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}