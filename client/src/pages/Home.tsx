import { trpc } from "@/lib/trpc";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// ─── Logos Storage Paths ────────────────────────────────────────────────────
const LOGO_DIGITUS = "/manus-storage/digitus-marca-completa_4bf05e71.png";
const LOGO_DIGITUS_NORMAL = "/manus-storage/digitus-marca-normal_b7fa5e98.png";
const PARTNERS = [
  { name: "FEPESA", src: "/manus-storage/fepesa_8855531c.jpg" },
  { name: "CEDIM", src: "/manus-storage/cedim_8de470eb.png" },
  { name: "Sindhospital/AL", src: "/manus-storage/sindhospital_new_567e5416.png" },
  { name: "AHEAL", src: "/manus-storage/aheal_b467eee4.jpg" },
  { name: "Caleidoscópio", src: "/manus-storage/caleidoscopio_156480ba.png" },
  { name: "FBH", src: "/manus-storage/fbh_logo_web_f0f9a2a3.png" },
  { name: "CAU/AL", src: "/manus-storage/caual_528f2035.png" },
  { name: "CREA/AL", src: "/manus-storage/crea-al_6765ad86.png" },
  { name: "Golden Cross do Brasil", src: "/manus-storage/goldencross_8738c0fc.jpg" },
];

// ─── Reveal Hook ────────────────────────────────────────────────────────────
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

// ─── Header ─────────────────────────────────────────────────────────────────
function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navLinks = [
    { label: "Início", href: "#inicio" },
    { label: "Soluções", href: "#solucoes" },
    { label: "Expertise", href: "#expertise" },
    { label: "Parceiros", href: "#parceiros" },
    { label: "Contato", href: "#contato" },
  ];

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled
          ? "oklch(0.10 0.02 240 / 0.95)"
          : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid oklch(0.22 0.03 240)" : "none",
      }}
    >
      <div className="container">
        <div className="flex items-center justify-between h-16 md:h-20">
          <a href="#inicio" className="flex items-center">
            <img
              src={LOGO_DIGITUS}
              alt="Digitus"
              className="h-8 md:h-10 w-auto object-contain"
            />
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contato"
              className="px-5 py-2 rounded-md text-sm font-semibold transition-all duration-200 hover:scale-105"
              style={{
                background: "oklch(0.55 0.20 240)",
                color: "oklch(0.98 0.005 240)",
              }}
            >
              Fale Conosco
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <span
              className="block w-6 h-0.5 bg-foreground transition-all duration-300"
              style={{ transform: menuOpen ? "rotate(45deg) translateY(8px)" : "none" }}
            />
            <span
              className="block w-6 h-0.5 bg-foreground transition-all duration-300"
              style={{ opacity: menuOpen ? 0 : 1 }}
            />
            <span
              className="block w-6 h-0.5 bg-foreground transition-all duration-300"
              style={{ transform: menuOpen ? "rotate(-45deg) translateY(-8px)" : "none" }}
            />
          </button>
        </div>

        {/* Mobile Nav */}
        {menuOpen && (
          <nav
            className="md:hidden py-4 border-t"
            style={{ borderColor: "oklch(0.22 0.03 240)" }}
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}

// ─── Hero Section ────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse 80% 60% at 50% -10%, oklch(0.25 0.08 240 / 0.5) 0%, transparent 70%), oklch(0.10 0.02 240)",
      }}
    >
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0.55 0.20 240 / 0.3) 1px, transparent 1px), linear-gradient(90deg, oklch(0.55 0.20 240 / 0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Glow orbs */}
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ background: "oklch(0.55 0.20 240)" }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full blur-3xl opacity-10 pointer-events-none"
        style={{ background: "oklch(0.65 0.18 240)" }}
      />

            <div className="container relative z-10 pt-28 pb-16">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left: content */}
          <div className="flex-1 max-w-2xl">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-8 animate-fade-in"
              style={{
                background: "oklch(0.55 0.20 240 / 0.15)",
                border: "1px solid oklch(0.55 0.20 240 / 0.4)",
                color: "oklch(0.75 0.15 240)",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: "oklch(0.75 0.15 240)" }}
              />
              Inovação desde 2013
            </div>
            <h1
              className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6 animate-fade-in-up"
              style={{ animationDelay: "100ms" }}
            >
              <span className="digitus-text-gradient">Transformamos</span>
              <br />
              <span className="text-foreground">Dados em </span>
              <span className="digitus-text-gradient">Decisões</span>
              <br />
              <span className="digitus-text-gradient">Estratégicas</span>
            </h1>
            <p
              className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed animate-fade-in-up"
              style={{ animationDelay: "200ms" }}
            >
              A Digitus é especialista em Inteligência de Dados, Consultoria
              Estratégica e Gerenciamento Eletrônico. Ajudamos instituições
              a extrair o máximo valor de suas informações com segurança e precisão.
            </p>
            <div
              className="flex flex-col sm:flex-row gap-4 animate-fade-in-up"
              style={{ animationDelay: "300ms" }}
            >
              <a
                href="#solucoes"
                className="px-8 py-3.5 rounded-md font-semibold text-sm transition-all duration-200 hover:scale-105 hover:shadow-lg text-center"
                style={{
                  background: "oklch(0.55 0.20 240)",
                  color: "oklch(0.98 0.005 240)",
                  boxShadow: "0 4px 24px oklch(0.55 0.20 240 / 0.3)",
                }}
              >
                Nossas Soluções
              </a>
              <a
                href="#contato"
                className="px-8 py-3.5 rounded-md font-semibold text-sm transition-all duration-200 hover:bg-secondary text-center"
                style={{
                  border: "1px solid oklch(0.35 0.05 240)",
                  color: "oklch(0.90 0.01 240)",
                }}
              >
                Agendar Consultoria
              </a>
            </div>
            {/* Stats */}
            <div
              className="grid grid-cols-3 gap-6 mt-16 pt-8 animate-fade-in-up"
              style={{
                borderTop: "1px solid oklch(0.22 0.03 240)",
                animationDelay: "400ms",
              }}
            >
              {[
                { value: "9+", label: "Parceiros Estratégicos" },
                { value: "10+", label: "Anos de Experiência" },
                { value: "100%", label: "Foco em Resultados" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div
                    className="text-2xl md:text-3xl font-bold mb-1"
                    style={{ color: "oklch(0.75 0.15 240)" }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-xs md:text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          {/* Right: floating logo */}
          <div className="flex-1 flex justify-center items-center lg:justify-end animate-fade-in">
            <img
              src={LOGO_DIGITUS_NORMAL}
              alt="Digitus"
              className="w-full max-w-xs md:max-w-sm lg:max-w-md"
              style={{
                animation: "float 6s ease-in-out infinite",
                filter: "drop-shadow(0 20px 40px oklch(0.55 0.20 240 / 0.25))",
              }}
            />
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, transparent, oklch(0.10 0.02 240))",
        }}
      />
    </section>
  );
}

// ─── Solutions Section ────────────────────────────────────────────────────────
function SolutionsSection() {
  const ref = useReveal();

  const solutions = [
    {
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: "Business Intelligence",
      description:
        "Transformamos seus dados brutos em dashboards interativos e relatórios estratégicos que revelam oportunidades e orientam decisões com precisão.",
    },
    {
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      title: "Consultoria Estratégica",
      description:
        "Apoiamos gestores e líderes na definição de estratégias baseadas em dados, alinhando objetivos organizacionais com resultados mensuráveis.",
    },
    {
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
        </svg>
      ),
      title: "Gestão de Dados",
      description:
        "Estruturamos pipelines de dados robustos, garantindo qualidade, governança e segurança das informações críticas da sua organização.",
    },
    {
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      title: "Análise Avançada",
      description:
        "Aplicamos técnicas de análise estatística e modelagem preditiva para antecipar tendências e identificar padrões ocultos nos seus dados.",
    },
    {
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      title: "Soluções para Setor Público",
      description:
        "Desenvolvemos soluções customizadas para órgãos públicos, sindicatos e entidades de classe, com foco em transparência e eficiência.",
    },
    {
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      ),
      title: "Treinamento e Capacitação",
      description:
        "Capacitamos equipes para o uso eficiente de ferramentas de análise de dados, promovendo uma cultura data-driven na sua organização.",
    },
  ];

  return (
    <section
      id="solucoes"
      className="py-24 relative"
      style={{ background: "oklch(0.10 0.02 240)" }}
    >
      <div className="container">
        <div ref={ref} className="reveal text-center mb-16">
          <span
            className="inline-block text-xs font-semibold tracking-widest uppercase mb-4"
            style={{ color: "oklch(0.75 0.15 240)" }}
          >
            O que fazemos
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Nossas Soluções
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Oferecemos um portfólio completo de soluções em inteligência de dados
            e consultoria estratégica para organizações de todos os portes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {solutions.map((sol, i) => (
            <SolutionCard key={sol.title} {...sol} delay={i * 80} />
          ))}
        </div>
      </div>
    </section>
  );
}

function SolutionCard({
  icon,
  title,
  description,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}) {
  const ref = useReveal();
  return (
    <div
      ref={ref}
      className="reveal digitus-card rounded-xl p-6"
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div
        className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
        style={{
          background: "oklch(0.55 0.20 240 / 0.15)",
          color: "oklch(0.75 0.15 240)",
        }}
      >
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}

// ─── Expertise Section ────────────────────────────────────────────────────────
function ExpertiseSection() {
  const ref = useReveal();

  const competencies = [
    { label: "Análise de Dados", pct: 95 },
    { label: "Business Intelligence", pct: 92 },
    { label: "Consultoria Estratégica", pct: 90 },
    { label: "Gestão de Projetos", pct: 88 },
    { label: "Tecnologia & Inovação", pct: 85 },
  ];

  const differentials = [
    {
      icon: "🎯",
      title: "Foco em Resultados",
      desc: "Cada projeto é orientado por métricas claras e objetivos mensuráveis, garantindo retorno real sobre o investimento.",
    },
    {
      icon: "🤝",
      title: "Parceria Duradoura",
      desc: "Construímos relacionamentos de longo prazo com nossos clientes, acompanhando sua evolução e crescimento.",
    },
    {
      icon: "🔒",
      title: "Segurança e Confiabilidade",
      desc: "Trabalhamos com os mais altos padrões de segurança da informação e conformidade com a LGPD.",
    },
    {
      icon: "⚡",
      title: "Agilidade e Inovação",
      desc: "Metodologias ágeis e tecnologias de ponta garantem entregas rápidas e soluções inovadoras.",
    },
  ];

  return (
    <section
      id="expertise"
      className="py-24 relative"
      style={{
        background:
          "radial-gradient(ellipse 60% 50% at 80% 50%, oklch(0.18 0.05 240 / 0.5) 0%, transparent 70%), oklch(0.12 0.025 240)",
      }}
    >
      <div className="container">
        <div ref={ref} className="reveal text-center mb-16">
          <span
            className="inline-block text-xs font-semibold tracking-widest uppercase mb-4"
            style={{ color: "oklch(0.75 0.15 240)" }}
          >
            Nossos diferenciais
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Nossa Expertise
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Anos de experiência e uma equipe multidisciplinar nos permitem entregar
            soluções de alta qualidade com profundo conhecimento setorial.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Competências */}
          <CompetenciesPanel competencies={competencies} />

          {/* Diferenciais */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {differentials.map((d, i) => (
              <DifferentialCard key={d.title} {...d} delay={i * 100} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CompetenciesPanel({
  competencies,
}: {
  competencies: { label: string; pct: number }[];
}) {
  const ref = useReveal();
  const [animated, setAnimated] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimated(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={panelRef} className="space-y-6">
      <div ref={ref} className="reveal mb-8">
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Competências Técnicas
        </h3>
        <p className="text-sm text-muted-foreground">
          Nossa equipe combina expertise técnica com visão de negócio para entregar
          soluções que realmente fazem a diferença.
        </p>
      </div>
      {competencies.map((c, i) => (
        <div key={c.label} className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-foreground font-medium">{c.label}</span>
            <span style={{ color: "oklch(0.75 0.15 240)" }}>{c.pct}%</span>
          </div>
          <div
            className="h-2 rounded-full overflow-hidden"
            style={{ background: "oklch(0.18 0.03 240)" }}
          >
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{
                width: animated ? `${c.pct}%` : "0%",
                background: "linear-gradient(90deg, oklch(0.40 0.22 240), oklch(0.65 0.18 240))",
                transitionDelay: `${i * 120}ms`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function DifferentialCard({
  icon,
  title,
  desc,
  delay,
}: {
  icon: string;
  title: string;
  desc: string;
  delay: number;
}) {
  const ref = useReveal();
  return (
    <div
      ref={ref}
      className="reveal digitus-card rounded-xl p-5"
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="text-2xl mb-3">{icon}</div>
      <h4 className="font-semibold text-foreground mb-2 text-sm">{title}</h4>
      <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  );
}

// ─── Partners Section ─────────────────────────────────────────────────────────
function PartnersSection() {
  const ref = useReveal();

  return (
    <section
      id="parceiros"
      className="py-24"
      style={{ background: "oklch(0.10 0.02 240)" }}
    >
      <div className="container">
        <div ref={ref} className="reveal text-center mb-16">
          <span
            className="inline-block text-xs font-semibold tracking-widest uppercase mb-4"
            style={{ color: "oklch(0.75 0.15 240)" }}
          >
            Quem confia em nós
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Clientes e Parceiros
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Organizações líderes em seus segmentos confiam na Digitus para
            transformar dados em vantagem competitiva.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {PARTNERS.map((partner, i) => (
            <PartnerCard key={partner.name} {...partner} delay={i * 60} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PartnerCard({
  name,
  src,
  delay,
}: {
  name: string;
  src: string;
  delay: number;
}) {
  const ref = useReveal();
  return (
    <div
      ref={ref}
      className="reveal digitus-card rounded-xl p-5 flex flex-col items-center justify-center gap-3 min-h-[120px] group"
      style={{ transitionDelay: `${delay}ms` }}
    >
      <img
        src={src}
        alt={name}
        className="max-h-14 max-w-full w-auto object-contain transition-all duration-300 group-hover:scale-105"
        style={{ filter: "grayscale(40%) brightness(0.9)", transition: "filter 0.3s ease" }}
        onMouseEnter={(e) => {
          (e.target as HTMLImageElement).style.filter = "grayscale(0%) brightness(1)";
        }}
        onMouseLeave={(e) => {
          (e.target as HTMLImageElement).style.filter = "grayscale(40%) brightness(0.9)";
        }}
      />
      <span className="text-xs text-muted-foreground text-center font-medium leading-tight">
        {name}
      </span>
    </div>
  );
}

// ─── Contact Section ──────────────────────────────────────────────────────────
function ContactSection() {
  const ref = useReveal();
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const contactMutation = trpc.contact.submit.useMutation({
    onSuccess: () => {
      toast.success("Mensagem enviada com sucesso! Entraremos em contato em breve.");
      setFormData({ name: "", company: "", email: "", subject: "", message: "" });
      setSubmitting(false);
    },
    onError: (err) => {
      // tRPC validation errors contain JSON — extract the first human-readable message
      let friendlyMessage = "Erro ao enviar mensagem. Tente novamente.";
      try {
        const parsed = JSON.parse(err.message);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].message) {
          friendlyMessage = parsed[0].message;
        } else if (typeof parsed === "object" && parsed.message) {
          friendlyMessage = parsed.message;
        }
      } catch {
        // err.message is already a plain string
        if (err.message && !err.message.startsWith("[") && !err.message.startsWith("{")) {
          friendlyMessage = err.message;
        }
      }
      toast.error(friendlyMessage);
      setSubmitting(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }
    setSubmitting(true);
    contactMutation.mutate(formData);
  };

  const subjects = [
    "Business Intelligence",
    "Consultoria Estratégica",
    "Gestão de Dados",
    "Análise Avançada",
    "Treinamento e Capacitação",
    "Soluções para Setor Público",
    "Outro Assunto",
  ];

  const inputClass =
    "w-full px-4 py-3 rounded-lg text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all duration-200 focus:ring-2";
  const inputStyle = {
    background: "oklch(0.16 0.03 240)",
    border: "1px solid oklch(0.25 0.04 240)",
  };

  return (
    <section
      id="contato"
      className="py-24 relative"
      style={{
        background:
          "radial-gradient(ellipse 60% 50% at 20% 50%, oklch(0.18 0.05 240 / 0.4) 0%, transparent 70%), oklch(0.12 0.025 240)",
      }}
    >
      <div className="container">
        <div ref={ref} className="reveal text-center mb-16">
          <span
            className="inline-block text-xs font-semibold tracking-widest uppercase mb-4"
            style={{ color: "oklch(0.75 0.15 240)" }}
          >
            Entre em contato
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Fale Conosco
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Pronto para transformar seus dados em resultados? Entre em contato
            e descubra como a Digitus pode ajudar sua organização.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 max-w-6xl mx-auto">
          {/* Info */}
          <div className="lg:col-span-2 space-y-8">
            <ContactInfoCard />
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <div
              className="rounded-2xl p-8"
              style={{
                background: "oklch(0.13 0.025 240)",
                border: "1px solid oklch(0.22 0.03 240)",
              }}
            >
              <h3 className="text-xl font-semibold text-foreground mb-6">
                Envie sua Mensagem
              </h3>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                      Nome <span style={{ color: "oklch(0.65 0.18 25)" }}>*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Seu nome completo"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, name: e.target.value }))
                      }
                      className={inputClass}
                      style={inputStyle}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                      Empresa
                    </label>
                    <input
                      type="text"
                      placeholder="Nome da empresa"
                      value={formData.company}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, company: e.target.value }))
                      }
                      className={inputClass}
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                    E-mail <span style={{ color: "oklch(0.65 0.18 25)" }}>*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, email: e.target.value }))
                    }
                    className={inputClass}
                    style={inputStyle}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                    Assunto <span style={{ color: "oklch(0.65 0.18 25)" }}>*</span>
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, subject: e.target.value }))
                    }
                    className={inputClass}
                    style={inputStyle}
                    required
                  >
                    <option value="" disabled>
                      Selecione um assunto
                    </option>
                    {subjects.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                    Mensagem <span style={{ color: "oklch(0.65 0.18 25)" }}>*</span>
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Descreva como podemos ajudar sua organização..."
                    value={formData.message}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, message: e.target.value }))
                    }
                    className={inputClass + " resize-none"}
                    style={inputStyle}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 rounded-lg font-semibold text-sm transition-all duration-200 hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                  style={{
                    background: "oklch(0.55 0.20 240)",
                    color: "oklch(0.98 0.005 240)",
                    boxShadow: "0 4px 24px oklch(0.55 0.20 240 / 0.3)",
                  }}
                >
                  {submitting ? "Enviando..." : "Enviar Mensagem"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactInfoCard() {
  const ref = useReveal();
  return (
    <div ref={ref} className="reveal space-y-6">
      <div
        className="rounded-xl p-6 space-y-5"
        style={{
          background: "oklch(0.13 0.025 240)",
          border: "1px solid oklch(0.22 0.03 240)",
        }}
      >
        <h3 className="text-lg font-semibold text-foreground">
          Informações de Contato
        </h3>

        <div className="flex gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{
              background: "oklch(0.55 0.20 240 / 0.15)",
              color: "oklch(0.75 0.15 240)",
            }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">Endereço</p>
            <p className="text-sm text-foreground leading-relaxed">
              Rua Epaminondas Gracindo, 22 - Pajuçara, Maceió - AL, 57030-101
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{
              background: "oklch(0.55 0.20 240 / 0.15)",
              color: "oklch(0.75 0.15 240)",
            }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">E-mail</p>
            <a
              href="mailto:atendimento@digitus.com.vc"
              className="text-sm transition-colors hover:underline"
              style={{ color: "oklch(0.75 0.15 240)" }}
            >
              atendimento@digitus.com.vc
            </a>
          </div>
        </div>
      </div>

      <div
        className="rounded-xl p-6"
        style={{
          background: "oklch(0.55 0.20 240 / 0.08)",
          border: "1px solid oklch(0.55 0.20 240 / 0.25)",
        }}
      >
        <p className="text-sm text-foreground font-medium mb-2">
          Horário de Atendimento
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Segunda a Sexta: 8h às 18h<br />
          Sábado: 8h às 12h
        </p>
      </div>
    </div>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer
      className="py-12"
      style={{
        background: "oklch(0.08 0.015 240)",
        borderTop: "1px solid oklch(0.18 0.03 240)",
      }}
    >
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          <div>
            <img
              src={LOGO_DIGITUS}
              alt="Digitus"
              className="h-9 w-auto object-contain mb-4"
            />
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Transformamos dados em decisões estratégicas para impulsionar o
              crescimento sustentável das organizações.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Navegação</h4>
            <ul className="space-y-2">
              {[
                ["Início", "#inicio"],
                ["Soluções", "#solucoes"],
                ["Nossa Expertise", "#expertise"],
                ["Parceiros", "#parceiros"],
                ["Contato", "#contato"],
              ].map(([label, href]) => (
                <li key={href}>
                  <a
                    href={href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Contato</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Rua Epaminondas Gracindo, 22 - Pajuçara, Maceió - AL, 57030-101</p>
              <a
                href="mailto:atendimento@digitus.com.vc"
                className="block hover:text-foreground transition-colors"
                style={{ color: "oklch(0.65 0.15 240)" }}
              >
                atendimento@digitus.com.vc
              </a>
            </div>
          </div>
        </div>

        <div
          className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground"
          style={{ borderTop: "1px solid oklch(0.18 0.03 240)" }}
        >
          <p>© {year} Digitus. Todos os direitos reservados.</p>
          <p>CNPJ: 28.659.568/0001-78</p>
        </div>
      </div>
    </footer>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <HeroSection />
        <div className="section-divider" />
        <SolutionsSection />
        <div className="section-divider" />
        <ExpertiseSection />
        <div className="section-divider" />
        <PartnersSection />
        <div className="section-divider" />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
