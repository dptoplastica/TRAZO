import { useState, useEffect } from 'react';

function App() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: "⚡",
      title: "Velocidad Extrema",
      description: "Procesamiento en tiempo real con latencia inferior a 10ms. Tu equipo trabaja sin interrupciones.",
      color: "from-indigo-500 to-purple-500"
    },
    {
      icon: "🔒",
      title: "Seguridad Total",
      description: "Encriptación end-to-end y cumplimiento SOC2 Type II. Tus datos siempre protegidos.",
      color: "from-cyan-500 to-blue-500"
    },
    {
      icon: "📊",
      title: "Analytics Avanzado",
      description: "Dashboards personalizables con IA predictiva. Anticípate a las tendencias del mercado.",
      color: "from-amber-500 to-orange-500"
    },
    {
      icon: "🔄",
      title: "Integración Nativa",
      description: "Conecta con más de 200 herramientas. Slack, Notion, Jira, GitHub y muchas más.",
      color: "from-emerald-500 to-teal-500"
    },
    {
      icon: "🤖",
      title: "IA Integrada",
      description: "Automatiza tareas repetitivas con nuestro asistente inteligente. Ahorra hasta 15h semanales.",
      color: "from-pink-500 to-rose-500"
    },
    {
      icon: "🌍",
      title: "Colaboración Global",
      description: "Trabaja en equipo sin fronteras. Sincronización en tiempo real para equipos distribuidos.",
      color: "from-violet-500 to-indigo-500"
    }
  ];

  const stats = [
    { value: "50K+", label: "Equipos activos" },
    { value: "99.9%", label: "Uptime garantizado" },
    { value: "4.9★", label: "Valoración media" },
    { value: "150+", label: "Países" }
  ];

  const testimonials = [
    {
      name: "María García",
      role: "CTO en TechVentures",
      text: "NexusFlow transformó completamente nuestra forma de trabajar. La productividad del equipo aumentó un 40% en el primer mes.",
      avatar: "👩‍💼"
    },
    {
      name: "Carlos Ruiz",
      role: "Product Manager en ScaleUp",
      text: "La integración con nuestras herramientas existentes fue impecable. En una semana ya teníamos todo funcionando.",
      avatar: "👨‍💻"
    },
    {
      name: "Ana Martínez",
      role: "CEO en DataFlow",
      text: "El analytics con IA nos permite tomar decisiones basadas en datos reales. Ha sido un game-changer para nosotros.",
      avatar: "👩‍🔬"
    }
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "0",
      period: "siempre gratis",
      features: ["Hasta 5 usuarios", "10 proyectos", "1GB almacenamiento", "Soporte por email"],
      highlighted: false,
      cta: "Comenzar gratis"
    },
    {
      name: "Pro",
      price: "29",
      period: "/usuario/mes",
      features: ["Usuarios ilimitados", "Proyectos ilimitados", "100GB almacenamiento", "Soporte prioritario", "Analytics avanzado", "Integraciones premium"],
      highlighted: true,
      cta: "Probar 14 días gratis"
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "contactar ventas",
      features: ["Todo en Pro", "SSO & SAML", "SLA dedicado", "Account manager", "On-premise disponible", "API personalizada"],
      highlighted: false,
      cta: "Contactar ventas"
    }
  ];

  return (
    <div className="min-h-screen bg-dark text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-dark/90 backdrop-blur-xl border-b border-white/10' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-bold text-sm">
                N
              </div>
              <span className="font-display font-bold text-xl">NexusFlow</span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-muted hover:text-white transition-colors text-sm font-medium">Funciones</a>
              <a href="#testimonials" className="text-muted hover:text-white transition-colors text-sm font-medium">Testimonios</a>
              <a href="#pricing" className="text-muted hover:text-white transition-colors text-sm font-medium">Precios</a>
              <a href="#contact" className="text-muted hover:text-white transition-colors text-sm font-medium">Contacto</a>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <button className="text-sm font-medium text-muted hover:text-white transition-colors">
                Iniciar sesión
              </button>
              <button className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all hover:shadow-lg hover:shadow-primary/25">
                Empezar gratis
              </button>
            </div>

            <button 
              className="md:hidden text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
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

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-dark2 border-t border-white/10">
            <div className="px-4 py-4 space-y-3">
              <a href="#features" className="block text-muted hover:text-white transition-colors text-sm font-medium py-2">Funciones</a>
              <a href="#testimonials" className="block text-muted hover:text-white transition-colors text-sm font-medium py-2">Testimonios</a>
              <a href="#pricing" className="block text-muted hover:text-white transition-colors text-sm font-medium py-2">Precios</a>
              <a href="#contact" className="block text-muted hover:text-white transition-colors text-sm font-medium py-2">Contacto</a>
              <button className="w-full bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all mt-4">
                Empezar gratis
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float-delay"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary/5 to-secondary/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-8">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
              <span className="text-sm text-muted">Nuevo: IA Generativa integrada</span>
            </div>

            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              El futuro del{' '}
              <span className="gradient-text">trabajo en equipo</span>
              {' '}empieza aquí
            </h1>

            <p className="text-lg sm:text-xl text-muted max-w-2xl mx-auto mb-10 leading-relaxed">
              NexusFlow unifica proyectos, comunicación y automatización en una sola plataforma. 
              Diseñada para equipos que quieren moverse más rápido sin sacrificar calidad.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="w-full sm:w-auto bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-full text-base font-semibold transition-all hover:shadow-xl hover:shadow-primary/30 animate-pulse-glow">
                Comenzar gratis →
              </button>
              <button className="w-full sm:w-auto glass hover:bg-white/10 text-white px-8 py-4 rounded-full text-base font-semibold transition-all">
                Ver demo en vivo
              </button>
            </div>

            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="font-display text-3xl sm:text-4xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-muted mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero visual */}
          <div className="mt-20 relative">
            <div className="glass rounded-2xl p-1 max-w-5xl mx-auto">
              <div className="bg-dark2 rounded-xl p-6 sm:p-8">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  <span className="ml-4 text-xs text-muted font-mono">nexusflow-dashboard</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-dark3/50 rounded-lg p-4 border border-white/5">
                    <div className="text-xs text-muted mb-2">Sprint actual</div>
                    <div className="text-lg font-semibold">12 tareas</div>
                    <div className="mt-3 h-2 bg-dark rounded-full overflow-hidden">
                      <div className="h-full w-3/4 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
                    </div>
                    <div className="text-xs text-muted mt-1">75% completado</div>
                  </div>
                  <div className="bg-dark3/50 rounded-lg p-4 border border-white/5">
                    <div className="text-xs text-muted mb-2">Equipo activo</div>
                    <div className="text-lg font-semibold">24 miembros</div>
                    <div className="flex -space-x-2 mt-3">
                      {['🧑‍💻', '👩‍🎨', '👨‍🔬', '👩‍💼', '🧑‍🚀'].map((emoji, i) => (
                        <div key={i} className="w-7 h-7 rounded-full bg-dark2 border-2 border-dark3 flex items-center justify-center text-sm">
                          {emoji}
                        </div>
                      ))}
                      <div className="w-7 h-7 rounded-full bg-primary/20 border-2 border-dark3 flex items-center justify-center text-xs text-primary">+19</div>
                    </div>
                  </div>
                  <div className="bg-dark3/50 rounded-lg p-4 border border-white/5">
                    <div className="text-xs text-muted mb-2">Productividad</div>
                    <div className="text-lg font-semibold text-emerald-400">+32%</div>
                    <div className="flex items-end gap-1 mt-3 h-10">
                      {[40, 65, 45, 80, 55, 90, 70, 95, 60, 85, 75, 100].map((h, i) => (
                        <div key={i} className="flex-1 bg-gradient-to-t from-primary/50 to-secondary/50 rounded-sm" style={{ height: `${h}%` }}></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Todo lo que necesitas,{' '}
              <span className="gradient-text">en un solo lugar</span>
            </h2>
            <p className="text-lg text-muted">
              Herramientas potentes diseñadas para equipos modernos que buscan eficiencia sin comprometer la experiencia.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div key={i} className="card-hover glass rounded-2xl p-6 group">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="font-display text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold mb-6">
                Diseñado para la forma en que{' '}
                <span className="gradient-text">realmente trabajas</span>
              </h2>
              <p className="text-muted text-lg mb-8 leading-relaxed">
                Olvídate de cambiar entre 10 aplicaciones diferentes. NexusFlow centraliza todo tu flujo de trabajo 
                en una interfaz intuitiva y potente.
              </p>

              <div className="space-y-4">
                {[
                  { label: "Gestión de proyectos", desc: "Kanban, Gantt, listas y tablas" },
                  { label: "Comunicación", desc: "Chat, video y documentación integrada" },
                  { label: "Automatización", desc: "Workflows sin código con IA" },
                  { label: "Reportes", desc: "Métricas en tiempo real personalizables" }
                ].map((item, i) => (
                  <div 
                    key={i} 
                    className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all ${activeTab === i ? 'bg-primary/10 border border-primary/30' : 'hover:bg-white/5 border border-transparent'}`}
                    onClick={() => setActiveTab(i)}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold ${activeTab === i ? 'bg-primary text-white' : 'bg-dark3 text-muted'}`}>
                      {i + 1}
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{item.label}</div>
                      <div className="text-xs text-muted">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="glass rounded-2xl p-6">
                <div className="bg-dark2 rounded-xl p-6 space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-sm">Proyecto: Rediseño Web</h4>
                    <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">En progreso</span>
                  </div>
                  
                  <div className="space-y-3">
                    {['Diseño de componentes', 'Implementar API', 'Testing E2E', 'Deploy a staging'].map((task, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-dark3/50 rounded-lg">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${i < 2 ? 'border-emerald-400 bg-emerald-400/20' : 'border-dark3'}`}>
                          {i < 2 && <svg className="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                        </div>
                        <span className={`text-sm ${i < 2 ? 'text-muted line-through' : 'text-white'}`}>{task}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-white/10">
                    <div className="flex items-center justify-between text-xs text-muted">
                      <span>Progreso del sprint</span>
                      <span className="text-primary font-semibold">50%</span>
                    </div>
                    <div className="mt-2 h-2 bg-dark rounded-full overflow-hidden">
                      <div className="h-full w-1/2 bg-gradient-to-r from-primary to-secondary rounded-full transition-all"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Lo que dicen nuestros{' '}
              <span className="gradient-text">clientes</span>
            </h2>
            <p className="text-lg text-muted">
              Miles de equipos confían en NexusFlow para impulsar su productividad cada día.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <div key={i} className="glass rounded-2xl p-6 card-hover">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-light2 leading-relaxed mb-6">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-dark3 flex items-center justify-center text-lg">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{testimonial.name}</div>
                    <div className="text-xs text-muted">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/5 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Planes que{' '}
              <span className="gradient-text">escalan contigo</span>
            </h2>
            <p className="text-lg text-muted">
              Empieza gratis y crece cuando lo necesites. Sin sorpresas, sin compromisos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pricingPlans.map((plan, i) => (
              <div key={i} className={`rounded-2xl p-6 card-hover ${plan.highlighted ? 'bg-gradient-to-b from-primary/20 to-primary/5 border-2 border-primary/50 relative' : 'glass'}`}>
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                    Más popular
                  </div>
                )}
                <h3 className="font-display text-xl font-semibold mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  {plan.price !== "Custom" && <span className="text-3xl font-bold">€{plan.price}</span>}
                  {plan.price === "Custom" && <span className="text-3xl font-bold">Custom</span>}
                  <span className="text-sm text-muted">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm">
                      <svg className="w-4 h-4 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-light2">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-3 rounded-full text-sm font-semibold transition-all ${plan.highlighted ? 'bg-primary hover:bg-primary-dark text-white shadow-lg shadow-primary/25' : 'glass hover:bg-white/10 text-white'}`}>
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10"></div>
            <div className="relative">
              <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
                ¿Listo para transformar tu equipo?
              </h2>
              <p className="text-muted text-lg mb-8 max-w-2xl mx-auto">
                Únete a más de 50.000 equipos que ya están trabajando de forma más inteligente con NexusFlow.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <input 
                  type="email" 
                  placeholder="tu@email.com" 
                  className="w-full sm:w-80 bg-dark2 border border-white/10 rounded-full px-6 py-3 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                />
                <button className="w-full sm:w-auto bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-full text-sm font-semibold transition-all hover:shadow-xl hover:shadow-primary/30 whitespace-nowrap">
                  Empezar ahora →
                </button>
              </div>
              <p className="text-xs text-muted mt-4">Sin tarjeta de crédito · Setup en 2 minutos · Cancela cuando quieras</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-bold text-sm">
                  N
                </div>
                <span className="font-display font-bold text-lg">NexusFlow</span>
              </div>
              <p className="text-sm text-muted leading-relaxed">
                La plataforma de productividad diseñada para equipos modernos.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-4">Producto</h4>
              <ul className="space-y-2 text-sm text-muted">
                <li><a href="#" className="hover:text-white transition-colors">Funciones</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Precios</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integraciones</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Changelog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm text-muted">
                <li><a href="#" className="hover:text-white transition-colors">Sobre nosotros</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Carreras</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contacto</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted">
                <li><a href="#" className="hover:text-white transition-colors">Privacidad</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Términos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Seguridad</a></li>
                <li><a href="#" className="hover:text-white transition-colors">GDPR</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted">© 2026 NexusFlow. Todos los derechos reservados.</p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-muted hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </a>
              <a href="#" className="text-muted hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              </a>
              <a href="#" className="text-muted hover:text-white transition-colors">
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
