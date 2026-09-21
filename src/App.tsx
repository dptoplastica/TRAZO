import { useState, useEffect, useRef } from 'react';

function App() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    const handleMouse = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouse);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouse);
    };
  }, []);

  const features = [
    {
      icon: "🧠",
      title: "IA Conversacional",
      description: "Modelos de lenguaje avanzados que entienden contexto, matices y lenguaje técnico de tu industria.",
      gradient: "from-violet-500 to-purple-600",
      stat: "10x más rápido"
    },
    {
      icon: "⚡",
      title: "Procesamiento en Tiempo Real",
      description: "Análisis instantáneo de datos con latencia inferior a 50ms. Decisiones al momento.",
      gradient: "from-amber-500 to-orange-600",
      stat: "<50ms latencia"
    },
    {
      icon: "🔐",
      title: "Seguridad Enterprise",
      description: "Encriptación AES-256, SOC2 Type II, GDPR compliant. Tus datos siempre protegidos.",
      gradient: "from-emerald-500 to-teal-600",
      stat: "99.99% uptime"
    },
    {
      icon: "📊",
      title: "Analytics Predictivo",
      description: "Anticipa tendencias del mercado con modelos de ML entrenados en datos de tu sector.",
      gradient: "from-blue-500 to-cyan-600",
      stat: "94% precisión"
    },
    {
      icon: "🔄",
      title: "Automatización Inteligente",
      description: "Workflows que aprenden de tus patrones y optimizan procesos automáticamente.",
      gradient: "from-pink-500 to-rose-600",
      stat: "200+ integraciones"
    },
    {
      icon: "🌐",
      title: "API Universal",
      description: "Conecta con cualquier herramienta existente. REST, GraphQL, webhooks y SDKs nativos.",
      gradient: "from-indigo-500 to-blue-600",
      stat: "15+ SDKs"
    }
  ];

  const stats = [
    { value: "10M+", label: "Peticiones/día" },
    { value: "500+", label: "Empresas confían en nosotros" },
    { value: "99.99%", label: "Uptime SLA" },
    { value: "4.9/5", label: "Satisfacción cliente" }
  ];

  const testimonials = [
    {
      name: "Elena Rodríguez",
      role: "VP Engineering, TechCorp",
      text: "SynapseAI redujo nuestro tiempo de análisis de datos de semanas a minutos. El ROI fue inmediato.",
      avatar: "👩‍💼",
      company: "TechCorp"
    },
    {
      name: "Miguel Fernández",
      role: "CTO, DataScale",
      text: "La precisión de los modelos predictivos superó nuestras expectativas. Pasamos de reactivos a proactivos.",
      avatar: "👨‍💻",
      company: "DataScale"
    },
    {
      name: "Laura Chen",
      role: "Head of AI, Finova",
      text: "La integración fue sorprendentemente sencilla. En 48 horas teníamos el sistema funcionando en producción.",
      avatar: "👩‍🔬",
      company: "Finova"
    }
  ];

  const pricing = [
    {
      name: "Starter",
      price: "0",
      description: "Perfecto para explorar",
      features: ["1,000 peticiones/mes", "1 modelo base", "API REST", "Soporte comunidad", "Dashboard básico"],
      highlighted: false,
      cta: "Empezar gratis"
    },
    {
      name: "Pro",
      price: "99",
      description: "Para equipos en crecimiento",
      features: ["100,000 peticiones/mes", "Todos los modelos", "API + GraphQL", "Soporte prioritario", "Analytics avanzado", "Webhooks", "SSO"],
      highlighted: true,
      cta: "Probar 14 días"
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "Solución a medida",
      features: ["Peticiones ilimitadas", "Modelos personalizados", "On-premise disponible", "Account manager", "SLA dedicado", "Audit logs", "Compliance avanzado"],
      highlighted: false,
      cta: "Contactar ventas"
    }
  ];

  const faqs = [
    {
      question: "¿Cuánto tiempo tarda la implementación?",
      answer: "La mayoría de nuestros clientes están operativos en menos de 24 horas. Nuestro equipo de onboarding te guía paso a paso y proporcionamos SDKs para los lenguajes más populares."
    },
    {
      question: "¿Mis datos están seguros?",
      answer: "Absolutamente. Utilizamos encriptación AES-256 en reposo y TLS 1.3 en tránsito. Cumplimos con SOC2 Type II, GDPR, HIPAA y estamos certificados ISO 27001."
    },
    {
      question: "¿Puedo usar mis propios modelos?",
      answer: "Sí. SynapseAI soporta modelos personalizados entrenados con tus datos. Puedes importar modelos en formatos ONNX, TensorFlow o PyTorch directamente."
    },
    {
      question: "¿Qué soporte ofrecen?",
      answer: "Todos los planes incluyen documentación completa y comunidad. Los planes Pro y Enterprise incluyen soporte prioritario con SLA de respuesta garantizado y account manager dedicado."
    },
    {
      question: "¿Hay límite de usuarios?",
      answer: "No hay límite de usuarios en ningún plan. Solo pagas por el uso de la API, no por asientos. Tu equipo completo puede acceder sin coste adicional."
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none">
        <div 
          className="absolute w-[600px] h-[600px] rounded-full opacity-20 blur-[120px] transition-all duration-1000"
          style={{ 
            background: 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)',
            left: mousePos.x - 300,
            top: mousePos.y - 300
          }}
        />
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-violet-600/10 blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-cyan-600/10 blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Grid pattern overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02]" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '60px 60px'
      }} />

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-[#0a0a0f]/80 backdrop-blur-2xl border-b border-white/5' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 opacity-30 blur-sm" />
              </div>
              <span className="font-bold text-xl tracking-tight">Synapse<span className="text-violet-400">AI</span></span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">Funciones</a>
              <a href="#testimonials" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">Testimonios</a>
              <a href="#pricing" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">Precios</a>
              <a href="#faq" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">FAQ</a>
            </div>

            <div className="hidden md:flex items-center gap-3">
              <button className="text-sm text-gray-400 hover:text-white px-4 py-2 transition-colors">
                Iniciar sesión
              </button>
              <button className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-cyan-600 rounded-full opacity-70 group-hover:opacity-100 blur transition-opacity" />
                <div className="relative bg-[#0a0a0f] text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-transparent transition-colors">
                  Empezar gratis
                </div>
              </button>
            </div>

            <button className="md:hidden text-white p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0a0a0f]/95 backdrop-blur-xl border-t border-white/5">
            <div className="px-4 py-6 space-y-4">
              <a href="#features" className="block text-gray-400 hover:text-white py-2">Funciones</a>
              <a href="#testimonials" className="block text-gray-400 hover:text-white py-2">Testimonios</a>
              <a href="#pricing" className="block text-gray-400 hover:text-white py-2">Precios</a>
              <a href="#faq" className="block text-gray-400 hover:text-white py-2">FAQ</a>
              <button className="w-full bg-gradient-to-r from-violet-600 to-cyan-600 text-white px-5 py-3 rounded-full text-sm font-semibold mt-4">
                Empezar gratis
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center pt-20 pb-16">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center max-w-5xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 mb-8 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-sm text-gray-300">Nuevo: GPT-5 y Claude 4 integrados</span>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>

            {/* Main heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold tracking-tight leading-[0.9] mb-8">
              <span className="block">Inteligencia</span>
              <span className="block mt-2">
                <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  artificial
                </span>
              </span>
              <span className="block mt-2 text-gray-400 text-4xl sm:text-5xl lg:text-6xl font-medium">
                que transforma negocios
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
              La plataforma de IA más avanzada para empresas. Analiza, predice y automatiza 
              con modelos de última generación. Sin complejidad, sin límites.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <button className="relative group w-full sm:w-auto">
                <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 via-purple-600 to-cyan-600 rounded-2xl opacity-70 group-hover:opacity-100 blur-lg transition-all duration-300" />
                <div className="relative flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-cyan-600 text-white px-8 py-4 rounded-xl text-base font-semibold">
                  Comenzar ahora — es gratis
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </button>
              <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-4 rounded-xl text-base font-medium transition-all duration-200">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Ver demo (2 min)
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              {stats.map((stat, i) => (
                <div key={i} className="text-center p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-gray-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Visual - Terminal/Dashboard */}
          <div className="mt-20 relative max-w-5xl mx-auto">
            <div className="absolute -inset-4 bg-gradient-to-r from-violet-600/20 via-purple-600/20 to-cyan-600/20 rounded-3xl blur-2xl" />
            <div className="relative bg-[#111118] rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
              {/* Terminal header */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-white/[0.02]">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="bg-white/5 rounded-md px-4 py-1 text-xs text-gray-500 font-mono">synapse-ai-dashboard</div>
                </div>
              </div>
              {/* Dashboard content */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/[0.03] rounded-xl p-5 border border-white/5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-gray-500 uppercase tracking-wider">Modelo activo</span>
                    <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full">Online</span>
                  </div>
                  <div className="text-lg font-semibold mb-1">GPT-5 Turbo</div>
                  <div className="text-sm text-gray-500">Procesando 2.4M tokens/día</div>
                  <div className="mt-4 flex items-end gap-1 h-12">
                    {[30, 50, 40, 70, 55, 85, 60, 90, 75, 95, 80, 100].map((h, i) => (
                      <div key={i} className="flex-1 rounded-sm bg-gradient-to-t from-violet-500/40 to-cyan-500/40" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                </div>
                <div className="bg-white/[0.03] rounded-xl p-5 border border-white/5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-gray-500 uppercase tracking-wider">Precisión</span>
                    <span className="text-xs text-emerald-400">↑ 12%</span>
                  </div>
                  <div className="text-3xl font-bold text-emerald-400 mb-1">94.7%</div>
                  <div className="text-sm text-gray-500">vs 82.3% anterior</div>
                  <div className="mt-4 relative h-12">
                    <svg className="w-full h-full" viewBox="0 0 200 50" preserveAspectRatio="none">
                      <path d="M0,40 Q25,35 50,30 T100,20 T150,10 T200,5" fill="none" stroke="url(#grad1)" strokeWidth="2" />
                      <defs>
                        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#8b5cf6" />
                          <stop offset="100%" stopColor="#06b6d4" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>
                <div className="bg-white/[0.03] rounded-xl p-5 border border-white/5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-gray-500 uppercase tracking-wider">Latencia</span>
                    <span className="text-xs bg-violet-500/10 text-violet-400 px-2 py-0.5 rounded-full">P99</span>
                  </div>
                  <div className="text-3xl font-bold mb-1">42<span className="text-lg text-gray-500">ms</span></div>
                  <div className="text-sm text-gray-500">-18% vs mes anterior</div>
                  <div className="mt-4 grid grid-cols-7 gap-1">
                    {Array.from({ length: 21 }, (_, i) => (
                      <div key={i} className={`h-2 rounded-sm ${i > 14 ? 'bg-violet-500/60' : i > 7 ? 'bg-violet-500/30' : 'bg-violet-500/10'}`} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trusted by */}
          <div className="mt-20 text-center">
            <p className="text-sm text-gray-600 mb-8 uppercase tracking-wider">Empresas que confían en SynapseAI</p>
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-40">
              {['Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'Tesla'].map((company) => (
                <div key={company} className="text-lg font-bold text-gray-400 tracking-wider">{company}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 text-violet-400 text-sm font-medium mb-4">
              <div className="w-8 h-[1px] bg-violet-400" />
              FUNCIONES
              <div className="w-8 h-[1px] bg-violet-400" />
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              Todo lo que necesitas para{' '}
              <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                escalar con IA
              </span>
            </h2>
            <p className="text-lg text-gray-400">
              Una suite completa de herramientas de inteligencia artificial diseñadas para equipos que quieren resultados reales.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div key={i} className="group relative bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-white/10 rounded-2xl p-6 transition-all duration-300">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-600/5 to-cyan-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">{feature.description}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium bg-white/5 border border-white/10 rounded-full px-3 py-1 text-gray-300">
                      {feature.stat}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-950/10 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 text-cyan-400 text-sm font-medium mb-4">
              <div className="w-8 h-[1px] bg-cyan-400" />
              CÓMO FUNCIONA
              <div className="w-8 h-[1px] bg-cyan-400" />
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              De la idea al resultado en{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
                3 pasos
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Conecta tus datos", desc: "Integra tus fuentes de datos en minutos. Soportamos SQL, APIs, archivos y más de 200 conectores nativos.", icon: "🔌" },
              { step: "02", title: "Configura tu modelo", desc: "Selecciona entre nuestros modelos preentrenados o entrena uno personalizado con tus datos específicos.", icon: "⚙️" },
              { step: "03", title: "Escala sin límites", desc: "Despliega en producción con un click. Autoescalado inteligente que se adapta a tu demanda en tiempo real.", icon: "🚀" }
            ].map((item, i) => (
              <div key={i} className="relative">
                {i < 2 && (
                  <div className="hidden md:block absolute top-12 left-full w-full h-[1px] bg-gradient-to-r from-white/20 to-transparent z-0" />
                )}
                <div className="relative bg-white/[0.02] border border-white/5 rounded-2xl p-8 hover:border-violet-500/30 transition-colors">
                  <div className="text-5xl font-bold text-white/5 absolute top-4 right-6">{item.step}</div>
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 text-amber-400 text-sm font-medium mb-4">
              <div className="w-8 h-[1px] bg-amber-400" />
              TESTIMONIOS
              <div className="w-8 h-[1px] bg-amber-400" />
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              Lo que dicen nuestros{' '}
              <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                clientes
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 hover:border-amber-500/20 transition-colors">
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: 5 }, (_, j) => (
                    <svg key={j} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border border-white/10 flex items-center justify-center text-lg">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{t.name}</div>
                    <div className="text-xs text-gray-500">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-950/5 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 text-emerald-400 text-sm font-medium mb-4">
              <div className="w-8 h-[1px] bg-emerald-400" />
              PRECIOS
              <div className="w-8 h-[1px] bg-emerald-400" />
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              Precios{' '}
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                transparentes
              </span>
            </h2>
            <p className="text-lg text-gray-400">
              Sin sorpresas. Sin costes ocultos. Escala cuando lo necesites.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pricing.map((plan, i) => (
              <div key={i} className={`relative rounded-2xl p-6 transition-all duration-300 ${
                plan.highlighted 
                  ? 'bg-gradient-to-b from-violet-600/10 to-cyan-600/10 border-2 border-violet-500/30 scale-[1.02]' 
                  : 'bg-white/[0.02] border border-white/5 hover:border-white/10'
              }`}>
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-violet-600 to-cyan-600 text-white text-xs font-semibold px-4 py-1 rounded-full">
                    Más popular
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-1">{plan.name}</h3>
                  <p className="text-sm text-gray-500">{plan.description}</p>
                </div>
                <div className="mb-6">
                  <span className="text-4xl font-bold">
                    {plan.price === "Custom" ? "" : "€"}{plan.price}
                  </span>
                  {plan.price !== "Custom" && <span className="text-gray-500 text-sm">/mes</span>}
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-gray-300">
                      <svg className="w-4 h-4 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-3 rounded-xl text-sm font-semibold transition-all ${
                  plan.highlighted 
                    ? 'bg-gradient-to-r from-violet-600 to-cyan-600 text-white hover:shadow-lg hover:shadow-violet-500/20' 
                    : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
                }`}>
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 relative">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-pink-400 text-sm font-medium mb-4">
              <div className="w-8 h-[1px] bg-pink-400" />
              FAQ
              <div className="w-8 h-[1px] bg-pink-400" />
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold">
              Preguntas{' '}
              <span className="bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent">
                frecuentes
              </span>
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white/[0.02] border border-white/5 rounded-xl overflow-hidden hover:border-white/10 transition-colors">
                <button 
                  className="w-full flex items-center justify-between p-5 text-left"
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                >
                  <span className="font-medium pr-4">{faq.question}</span>
                  <svg className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-200 ${activeFaq === i ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {activeFaq === i && (
                  <div className="px-5 pb-5">
                    <p className="text-gray-400 text-sm leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-purple-600/20 to-cyan-600/20" />
            <div className="absolute inset-0 bg-[#0a0a0f]/60 backdrop-blur-sm" />
            <div className="absolute inset-0 border border-white/10 rounded-3xl" />
            <div className="relative px-8 py-16 sm:px-16 sm:py-24 text-center">
              <h2 className="text-3xl sm:text-5xl font-bold mb-6">
                ¿Listo para transformar tu negocio con IA?
              </h2>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10">
                Únete a más de 500 empresas que ya están usando SynapseAI para tomar mejores decisiones, más rápido.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button className="relative group w-full sm:w-auto">
                  <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-cyan-600 rounded-2xl opacity-70 group-hover:opacity-100 blur-lg transition-all" />
                  <div className="relative flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-cyan-600 text-white px-8 py-4 rounded-xl text-base font-semibold">
                    Empezar ahora — gratis
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </button>
                <button className="w-full sm:w-auto text-gray-400 hover:text-white px-8 py-4 text-base font-medium transition-colors">
                  Hablar con ventas →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="font-bold text-lg">SynapseAI</span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                La plataforma de IA más avanzada para empresas que quieren escalar.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4">Producto</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-gray-500 hover:text-white transition-colors">Funciones</a></li>
                <li><a href="#" className="text-sm text-gray-500 hover:text-white transition-colors">Precios</a></li>
                <li><a href="#" className="text-sm text-gray-500 hover:text-white transition-colors">API Docs</a></li>
                <li><a href="#" className="text-sm text-gray-500 hover:text-white transition-colors">Changelog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-gray-500 hover:text-white transition-colors">Sobre nosotros</a></li>
                <li><a href="#" className="text-sm text-gray-500 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-sm text-gray-500 hover:text-white transition-colors">Carreras</a></li>
                <li><a href="#" className="text-sm text-gray-500 hover:text-white transition-colors">Contacto</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-gray-500 hover:text-white transition-colors">Privacidad</a></li>
                <li><a href="#" className="text-sm text-gray-500 hover:text-white transition-colors">Términos</a></li>
                <li><a href="#" className="text-sm text-gray-500 hover:text-white transition-colors">Seguridad</a></li>
                <li><a href="#" className="text-sm text-gray-500 hover:text-white transition-colors">GDPR</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-600">© 2026 SynapseAI. Todos los derechos reservados.</p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-gray-600 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </a>
              <a href="#" className="text-gray-600 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              </a>
              <a href="#" className="text-gray-600 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
