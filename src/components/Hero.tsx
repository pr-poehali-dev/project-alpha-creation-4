import { useScroll, useTransform, motion } from "framer-motion";
import { useRef } from "react";

export default function Hero() {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0vh", "50vh"]);

  return (
    <div
      ref={container}
      className="relative flex items-center justify-center h-screen overflow-hidden"
    >
      <motion.div
        style={{ y }}
        className="absolute inset-0 w-full h-full"
      >
        <img
          src="https://cdn.poehali.dev/projects/ec0125d2-444a-4666-aad2-a7e69579cd9d/files/34fddeb1-ebf9-4301-9197-ba1487c2bcc7.jpg"
          alt="Ателье интерьер"
          className="w-full h-full object-cover"
        />
      </motion.div>

      <div className="absolute inset-0 bg-black/40 z-[5]" />
      <div className="relative z-10 text-center text-white px-6">
        <p className="uppercase tracking-[0.4em] text-sm mb-6 opacity-80">Индивидуальный пошив</p>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 leading-none">
          СОЗДАНО<br/>ДЛЯ ВАС
        </h1>
        <p className="text-lg md:text-xl max-w-xl mx-auto opacity-80 font-light leading-relaxed">
          Каждый наряд — история вашего стиля. Мы воплощаем образы, которые остаются в памяти.
        </p>
        <a
          href="#services"
          className="inline-block mt-10 border border-white text-white uppercase tracking-widest text-sm px-8 py-3 hover:bg-white hover:text-black transition-all duration-300"
        >
          Записаться на примерку
        </a>
      </div>
    </div>
  );
}