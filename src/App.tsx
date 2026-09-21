import { useState, useEffect } from 'react';
import { User, Alumno, Calificacion, Asistencia, ViewType, Asignatura, SituacionAprendizaje } from './types';
import { users, centro, grupos, asignaturas, situacionesAprendizaje, generarAlumnos, generarCalificaciones, generarAsistencia } from './data/mockData';
import { 
  BookOpen, Users, GraduationCap, ClipboardList, BarChart3, FileText, 
  LogOut, Home, ChevronRight, Star, Calendar, Clock, Target, 
  CheckCircle, XCircle, AlertCircle, TrendingUp, Award, Search,
  Menu, X, Plus, Edit, Eye, Download, Filter
} from 'lucide-react';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [calificaciones, setCalificaciones] = useState<Calificacion[]>([]);
  const [asistencia, setAsistencia] = useState<Asistencia[]>([]);
  const [selectedAlumno, setSelectedAlumno] = useState<Alumno | null>(null);
  const [selectedAsignatura, setSelectedAsignatura] = useState<Asignatura | null>(null);
  const [selectedSA, setSelectedSA] = useState<SituacionAprendizaje | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('trazo_user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    const a = generarAlumnos();
    setAlumnos(a);
    setCalificaciones(generarCalificaciones(a));
    setAsistencia(generarAsistencia(a));
  }, []);

  const handleLogin = (email: string, password: string) => {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('trazo_user', JSON.stringify(user));
    } else {
      alert('Credenciales incorrectas');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('trazo_user');
    setCurrentView('dashboard');
  };

  if (!currentUser) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  const filteredAlumnos = alumnos.filter(a => 
    `${a.nombre} ${a.apellidos}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f2f4ef]">
      {/* Header */}
      <header className="bg-[#0e7c66] text-white shadow-lg sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-1">
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-lg font-bold leading-tight">TRAZO</h1>
                <p className="text-xs text-white/70 hidden sm:block">{centro.nombre}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">{currentUser.name}</p>
              <p className="text-xs text-white/70 capitalize">{currentUser.role === 'jefatura' ? 'Jefatura de Departamento' : 'Profesor/a'}</p>
            </div>
            <button onClick={handleLogout} className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="Cerrar sesión">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`fixed lg:sticky top-[60px] left-0 h-[calc(100vh-60px)] w-64 bg-white border-r border-gray-200 shadow-sm z-30 transform transition-transform duration-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
          <nav className="p-4 space-y-1">
            {[
              { id: 'dashboard' as ViewType, icon: Home, label: 'Inicio' },
              { id: 'alumnos' as ViewType, icon: Users, label: 'Alumnos' },
              { id: 'asignaturas' as ViewType, icon: GraduationCap, label: 'Asignaturas' },
              { id: 'sa' as ViewType, icon: Target, label: 'Situaciones de Aprendizaje' },
              { id: 'evaluacion' as ViewType, icon: ClipboardList, label: 'Evaluación' },
              { id: 'cuaderno' as ViewType, icon: FileText, label: 'Cuaderno del Profesor' },
              { id: 'informes' as ViewType, icon: BarChart3, label: 'Informes' }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => { setCurrentView(item.id); setSidebarOpen(false); setSelectedAlumno(null); setSelectedAsignatura(null); setSelectedSA(null); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  currentView === item.id ? 'bg-[#0e7c66]/10 text-[#0e7c66]' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="absolute bottom-4 left-4 right-4 p-3 bg-[#0e7c66]/5 rounded-lg border border-[#0e7c66]/10">
            <p className="text-xs text-[#0e7c66] font-medium">{centro.cursoAcademico}</p>
            <p className="text-xs text-gray-500 mt-1">{centro.localidad}, {centro.provincia}</p>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Main content */}
        <main className="flex-1 p-4 lg:p-8 min-h-[calc(100vh-60px)]">
          {currentView === 'dashboard' && (
            <DashboardView 
              user={currentUser} 
              alumnos={alumnos} 
              calificaciones={calificaciones}
              onNavigate={setCurrentView}
            />
          )}
          {currentView === 'alumnos' && !selectedAlumno && (
            <AlumnosView 
              alumnos={filteredAlumnos} 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              onSelect={setSelectedAlumno}
            />
          )}
          {currentView === 'alumnos' && selectedAlumno && (
            <AlumnoDetalle 
              alumno={selectedAlumno} 
              calificaciones={calificaciones.filter(c => c.alumnoId === selectedAlumno.id)}
              asistencia={asistencia.filter(a => a.alumnoId === selectedAlumno.id)}
              onBack={() => setSelectedAlumno(null)}
            />
          )}
          {currentView === 'asignaturas' && !selectedAsignatura && (
            <AsignaturasView 
              asignaturas={asignaturas.filter(a => currentUser.role === 'jefatura' || a.profesorId === currentUser.id)}
              onSelect={setSelectedAsignatura}
            />
          )}
          {currentView === 'asignaturas' && selectedAsignatura && (
            <AsignaturaDetalle 
              asignatura={selectedAsignatura}
              onBack={() => setSelectedAsignatura(null)}
              onSelectSA={setSelectedSA}
            />
          )}
          {currentView === 'sa' && !selectedSA && (
            <SAView 
              situaciones={situacionesAprendizaje}
              onSelect={setSelectedSA}
            />
          )}
          {currentView === 'sa' && selectedSA && (
            <SADetalle 
              sa={selectedSA}
              onBack={() => setSelectedSA(null)}
            />
          )}
          {currentView === 'evaluacion' && (
            <EvaluacionView 
              alumnos={alumnos}
              calificaciones={calificaciones}
              asignaturas={asignaturas}
            />
          )}
          {currentView === 'cuaderno' && (
            <CuadernoView alumnos={alumnos} asistencia={asistencia} />
          )}
          {currentView === 'informes' && (
            <InformesView alumnos={alumnos} calificaciones={calificaciones} />
          )}
        </main>
      </div>
    </div>
  );
}

// LOGIN SCREEN
function LoginScreen({ onLogin }: { onLogin: (email: string, password: string) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0e7c66] to-[#0a5c4c] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <BookOpen className="w-8 h-8 text-[#0e7c66]" />
          </div>
          <h1 className="text-3xl font-bold text-white">TRAZO</h1>
          <p className="text-white/70 mt-2">Sistema de Programación Didáctica LOMLOE</p>
          <p className="text-white/50 text-sm mt-1">{centro.nombre} · {centro.cursoAcademico}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Iniciar sesión</h2>
          
          <form onSubmit={(e) => { e.preventDefault(); onLogin(email, password); }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0e7c66] focus:border-transparent outline-none transition"
                placeholder="tu.email@educantabria.es"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0e7c66] focus:border-transparent outline-none transition"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#0e7c66] hover:bg-[#0a5c4c] text-white py-3 rounded-lg font-semibold transition-colors"
            >
              Acceder
            </button>
          </form>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs font-medium text-gray-500 mb-2">Credenciales de demostración:</p>
            <div className="space-y-1 text-xs text-gray-600">
              <p><span className="font-medium">Jefatura:</span> carmen.prieto@educantabria.es</p>
              <p><span className="font-medium">Profesora:</span> laura.gomez@educantabria.es</p>
              <p><span className="font-medium">Profesor:</span> miguel.ruiz@educantabria.es</p>
              <p className="mt-2 text-gray-400">Contraseña: <code className="bg-gray-200 px-1.5 py-0.5 rounded">Trazo2025!</code></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// DASHBOARD VIEW
function DashboardView({ user, alumnos, calificaciones, onNavigate }: { user: User; alumnos: Alumno[]; calificaciones: Calificacion[]; onNavigate: (v: ViewType) => void }) {
  const totalAlumnos = alumnos.length;
  const mediaGeneral = calificaciones.length > 0 ? (calificaciones.reduce((sum, c) => sum + c.valor, 0) / calificaciones.length).toFixed(1) : '0';
  const totalSAs = situacionesAprendizaje.length;
  const totalAsignaturas = asignaturas.filter(a => user.role === 'jefatura' || a.profesorId === user.id).length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          Bienvenido/a, {user.name.split(' ')[0]}
        </h1>
        <p className="text-gray-500 mt-1">Curso académico {centro.cursoAcademico} · {centro.nombre}</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Users} label="Alumnos" value={totalAlumnos} color="blue" onClick={() => onNavigate('alumnos')} />
        <StatCard icon={GraduationCap} label="Asignaturas" value={totalAsignaturas} color="green" onClick={() => onNavigate('asignaturas')} />
        <StatCard icon={Target} label="Situaciones de Aprendizaje" value={totalSAs} color="purple" onClick={() => onNavigate('sa')} />
        <StatCard icon={TrendingUp} label="Media general" value={mediaGeneral} color="amber" onClick={() => onNavigate('evaluacion')} />
      </div>

      {/* Quick access */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#0e7c66]" />
            Próximas situaciones de aprendizaje
          </h3>
          <div className="space-y-3">
            {situacionesAprendizaje.slice(0, 4).map(sa => (
              <div key={sa.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-800">{sa.titulo}</p>
                  <p className="text-xs text-gray-500">{sa.codigo} · {sa.sesiones} sesiones · {sa.evaluacion}ª eval</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${sa.evaluacion === 1 ? 'bg-blue-100 text-blue-700' : sa.evaluacion === 2 ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'}`}>
                  {sa.evaluacion}ª Eval
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-[#0e7c66]" />
            Mis asignaturas
          </h3>
          <div className="space-y-3">
            {asignaturas.filter(a => user.role === 'jefatura' || a.profesorId === user.id).slice(0, 5).map(asig => (
              <div key={asig.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-800">{asig.nombre}</p>
                  <p className="text-xs text-gray-500">{asig.codigo} · {asig.curso} · {asig.horasSemanales}h/sem</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color, onClick }: { icon: any; label: string; value: string | number; color: string; onClick: () => void }) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-emerald-50 text-emerald-600',
    purple: 'bg-purple-50 text-purple-600',
    amber: 'bg-amber-50 text-amber-600'
  };
  return (
    <button onClick={onClick} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 text-left hover:shadow-md transition-shadow">
      <div className={`w-10 h-10 rounded-lg ${colors[color]} flex items-center justify-center mb-3`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      <p className="text-sm text-gray-500 mt-1">{label}</p>
    </button>
  );
}

// ALUMNOS VIEW
function AlumnosView({ alumnos, searchTerm, setSearchTerm, onSelect }: { alumnos: Alumno[]; searchTerm: string; setSearchTerm: (s: string) => void; onSelect: (a: Alumno) => void }) {
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Alumnos</h1>
          <p className="text-gray-500 text-sm mt-1">{alumnos.length} alumnos matriculados</p>
        </div>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar alumno..."
            className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0e7c66] focus:border-transparent outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {alumnos.map(alumno => (
          <button
            key={alumno.id}
            onClick={() => onSelect(alumno)}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-left hover:shadow-md hover:border-[#0e7c66]/20 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#0e7c66]/10 flex items-center justify-center text-[#0e7c66] font-semibold text-sm">
                {alumno.nombre[0]}{alumno.apellidos[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{alumno.nombre} {alumno.apellidos}</p>
                <p className="text-xs text-gray-500">{grupos.find(g => g.id === alumno.grupoId)?.nombre}</p>
              </div>
              {alumno.necesidadesAE && (
                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">NEAE</span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ALUMNO DETALLE
function AlumnoDetalle({ alumno, calificaciones, asistencia, onBack }: { alumno: Alumno; calificaciones: Calificacion[]; asistencia: Asistencia[]; onBack: () => void }) {
  const media = calificaciones.length > 0 ? (calificaciones.reduce((s, c) => s + c.valor, 0) / calificaciones.length).toFixed(1) : '-';
  const presentes = asistencia.filter(a => a.estado === 'presente').length;
  const asistenciaPct = asistencia.length > 0 ? ((presentes / asistencia.length) * 100).toFixed(0) : '-';

  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#0e7c66] mb-4 transition-colors">
        ← Volver a alumnos
      </button>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#0e7c66]/10 flex items-center justify-center text-[#0e7c66] font-bold text-lg">
            {alumno.nombre[0]}{alumno.apellidos[0]}
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">{alumno.nombre} {alumno.apellidos}</h1>
            <p className="text-sm text-gray-500">{grupos.find(g => g.id === alumno.grupoId)?.nombre}</p>
          </div>
          {alumno.necesidadesAE && (
            <span className="ml-auto text-xs bg-amber-100 text-amber-700 px-3 py-1 rounded-full font-medium">{alumno.necesidadesAE}</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
          <p className="text-2xl font-bold text-[#0e7c66]">{media}</p>
          <p className="text-xs text-gray-500 mt-1">Media general</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
          <p className="text-2xl font-bold text-blue-600">{asistenciaPct}%</p>
          <p className="text-xs text-gray-500 mt-1">Asistencia</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
          <p className="text-2xl font-bold text-purple-600">{calificaciones.length}</p>
          <p className="text-xs text-gray-500 mt-1">Calificaciones</p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-4">Calificaciones</h3>
        <div className="space-y-2">
          {calificaciones.slice(0, 10).map(cal => {
            const sa = situacionesAprendizaje.find(s => s.id === cal.saId);
            return (
              <div key={cal.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-sm text-gray-800">{sa?.titulo || cal.saId}</p>
                  <p className="text-xs text-gray-500">{cal.fecha}</p>
                </div>
                <span className={`text-sm font-semibold ${cal.valor >= 7 ? 'text-emerald-600' : cal.valor >= 5 ? 'text-amber-600' : 'text-red-600'}`}>
                  {cal.valor.toFixed(1)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ASIGNATURAS VIEW
function AsignaturasView({ asignaturas, onSelect }: { asignaturas: Asignatura[]; onSelect: (a: Asignatura) => void }) {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Asignaturas</h1>
        <p className="text-gray-500 text-sm mt-1">{asignaturas.length} asignaturas asignadas</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {asignaturas.map(asig => (
          <button
            key={asig.id}
            onClick={() => onSelect(asig)}
            className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 text-left hover:shadow-md hover:border-[#0e7c66]/20 transition-all"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium bg-[#0e7c66]/10 text-[#0e7c66] px-2 py-0.5 rounded">{asig.codigo}</span>
                  <span className="text-xs text-gray-500">{asig.curso}</span>
                </div>
                <h3 className="font-semibold text-gray-800">{asig.nombre}</h3>
                <p className="text-sm text-gray-500 mt-1">{asig.horasSemanales} horas/semana · {asig.situacionesAprendizaje.length} SdA</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ASIGNATURA DETALLE
function AsignaturaDetalle({ asignatura, onBack, onSelectSA }: { asignatura: Asignatura; onBack: () => void; onSelectSA: (sa: SituacionAprendizaje) => void }) {
  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#0e7c66] mb-4 transition-colors">
        ← Volver a asignaturas
      </button>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-medium bg-[#0e7c66]/10 text-[#0e7c66] px-2 py-0.5 rounded">{asignatura.codigo}</span>
          <span className="text-sm text-gray-500">{asignatura.curso}</span>
        </div>
        <h1 className="text-xl font-bold text-gray-800">{asignatura.nombre}</h1>
        <p className="text-sm text-gray-500 mt-1">{asignatura.horasSemanales} horas semanales</p>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
        <h3 className="font-semibold text-gray-800 mb-4">Competencias Específicas</h3>
        <div className="space-y-3">
          {asignatura.competenciasEspecificas.map(ce => (
            <div key={ce.id} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
              <span className="text-xs font-bold text-[#0e7c66] bg-[#0e7c66]/10 px-2 py-1 rounded h-fit">{ce.codigo}</span>
              <p className="text-sm text-gray-700">{ce.descripcion}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-4">Situaciones de Aprendizaje</h3>
        <div className="space-y-3">
          {asignatura.situacionesAprendizaje.map(sa => (
            <button
              key={sa.id}
              onClick={() => onSelectSA(sa)}
              className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-[#0e7c66]/5 transition-colors text-left"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-[#0e7c66]">{sa.codigo}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${sa.evaluacion === 1 ? 'bg-blue-100 text-blue-700' : sa.evaluacion === 2 ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'}`}>
                    {sa.evaluacion}ª Eval
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-800">{sa.titulo}</p>
                <p className="text-xs text-gray-500 mt-1">{sa.sesiones} sesiones · {sa.instrumentos.length} instrumentos</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// SITUACIONES DE APRENDIZAJE VIEW
function SAView({ situaciones, onSelect }: { situaciones: SituacionAprendizaje[]; onSelect: (sa: SituacionAprendizaje) => void }) {
  const [filterEval, setFilterEval] = useState<number | null>(null);
  const filtered = filterEval ? situaciones.filter(sa => sa.evaluacion === filterEval) : situaciones;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Situaciones de Aprendizaje</h1>
          <p className="text-gray-500 text-sm mt-1">{situaciones.length} situaciones programadas</p>
        </div>
        <div className="flex gap-2">
          {[null, 1, 2, 3].map(e => (
            <button
              key={e ?? 'all'}
              onClick={() => setFilterEval(e)}
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                filterEval === e ? 'bg-[#0e7c66] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {e === null ? 'Todas' : `${e}ª Eval`}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(sa => {
          const asig = asignaturas.find(a => a.id === sa.asignaturaId);
          return (
            <button
              key={sa.id}
              onClick={() => onSelect(sa)}
              className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 text-left hover:shadow-md hover:border-[#0e7c66]/20 transition-all"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium text-[#0e7c66] bg-[#0e7c66]/10 px-2 py-0.5 rounded">{sa.codigo}</span>
                <span className="text-xs text-gray-500">{asig?.codigo}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ml-auto ${sa.evaluacion === 1 ? 'bg-blue-100 text-blue-700' : sa.evaluacion === 2 ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'}`}>
                  {sa.evaluacion}ª Eval
                </span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">{sa.titulo}</h3>
              <p className="text-sm text-gray-500 line-clamp-2 mb-3">{sa.descripcion}</p>
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{sa.sesiones} sesiones</span>
                <span className="flex items-center gap-1"><ClipboardList className="w-3 h-3" />{sa.instrumentos.length} instrumentos</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// SA DETALLE
function SADetalle({ sa, onBack }: { sa: SituacionAprendizaje; onBack: () => void }) {
  const asig = asignaturas.find(a => a.id === sa.asignaturaId);
  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#0e7c66] mb-4 transition-colors">
        ← Volver a situaciones de aprendizaje
      </button>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-medium text-[#0e7c66] bg-[#0e7c66]/10 px-2 py-0.5 rounded">{sa.codigo}</span>
          <span className="text-sm text-gray-500">{asig?.nombre}</span>
        </div>
        <h1 className="text-xl font-bold text-gray-800 mb-2">{sa.titulo}</h1>
        <p className="text-gray-600">{sa.descripcion}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#0e7c66]" />
            Temporalización
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Inicio</span>
              <span className="text-gray-800 font-medium">{sa.fechaInicio}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Fin</span>
              <span className="text-gray-800 font-medium">{sa.fechaFin}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Sesiones</span>
              <span className="text-gray-800 font-medium">{sa.sesiones}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Evaluación</span>
              <span className="text-gray-800 font-medium">{sa.evaluacion}ª</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-[#0e7c66]" />
            Producto final
          </h3>
          <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{sa.producto}</p>
          
          <h4 className="text-sm font-medium text-gray-800 mt-4 mb-2">Competencias clave</h4>
          <div className="flex flex-wrap gap-2">
            {sa.competenciasClave.map(cc => (
              <span key={cc} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">{cc}</span>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-[#0e7c66]" />
            Criterios de evaluación
          </h3>
          <div className="flex flex-wrap gap-2">
            {sa.criteriosEvaluacion.map(c => (
              <span key={c} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-mono">{c}</span>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-[#0e7c66]" />
            ODS vinculados
          </h3>
          <div className="space-y-2">
            {sa.ods.map(ods => (
              <p key={ods} className="text-sm text-gray-700 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full" />
                {ods}
              </p>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mt-6">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <ClipboardList className="w-5 h-5 text-[#0e7c66]" />
          Instrumentos de evaluación
        </h3>
        <div className="space-y-3">
          {sa.instrumentos.map(inst => (
            <div key={inst.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-800">{inst.nombre}</p>
                <div className="flex gap-2 mt-1">
                  <span className="text-xs text-gray-500 capitalize">{inst.tipo}</span>
                  <span className="text-xs text-gray-400">·</span>
                  <span className="text-xs text-gray-500">{inst.criterios.length} criterios</span>
                </div>
              </div>
              <span className="text-sm font-bold text-[#0e7c66]">{inst.peso}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// EVALUACION VIEW
function EvaluacionView({ alumnos, calificaciones, asignaturas }: { alumnos: Alumno[]; calificaciones: Calificacion[]; asignaturas: Asignatura[] }) {
  const [selectedGrupo, setSelectedGrupo] = useState<string>('all');
  const [selectedAsig, setSelectedAsig] = useState<string>('all');

  const filteredAlumnos = selectedGrupo === 'all' ? alumnos : alumnos.filter(a => a.grupoId === selectedGrupo);
  
  const getMediaAlumno = (alumnoId: string) => {
    const cals = calificaciones.filter(c => c.alumnoId === alumnoId);
    if (cals.length === 0) return '-';
    return (cals.reduce((s, c) => s + c.valor, 0) / cals.length).toFixed(1);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Evaluación</h1>
        <p className="text-gray-500 text-sm mt-1">Calificaciones y seguimiento del alumnado</p>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <select 
          value={selectedGrupo} 
          onChange={(e) => setSelectedGrupo(e.target.value)}
          className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#0e7c66] outline-none"
        >
          <option value="all">Todos los grupos</option>
          {grupos.map(g => <option key={g.id} value={g.id}>{g.nombre}</option>)}
        </select>
        <select 
          value={selectedAsig} 
          onChange={(e) => setSelectedAsig(e.target.value)}
          className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#0e7c66] outline-none"
        >
          <option value="all">Todas las asignaturas</option>
          {asignaturas.map(a => <option key={a.id} value={a.id}>{a.nombre}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Alumno</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Grupo</th>
                <th className="text-center text-xs font-medium text-gray-500 px-4 py-3">Media</th>
                <th className="text-center text-xs font-medium text-gray-500 px-4 py-3">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredAlumnos.map(alumno => {
                const media = getMediaAlumno(alumno.id);
                const numMedia = parseFloat(media);
                return (
                  <tr key={alumno.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-gray-800">{alumno.nombre} {alumno.apellidos}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{grupos.find(g => g.id === alumno.grupoId)?.nombre}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-sm font-semibold ${numMedia >= 7 ? 'text-emerald-600' : numMedia >= 5 ? 'text-amber-600' : 'text-red-600'}`}>
                        {media}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {numMedia >= 5 ? (
                        <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">Aprobado</span>
                      ) : numMedia > 0 ? (
                        <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">Suspenso</span>
                      ) : (
                        <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Sin datos</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// CUADERNO VIEW
function CuadernoView({ alumnos, asistencia }: { alumnos: Alumno[]; asistencia: Asistencia[] }) {
  const [selectedDate, setSelectedDate] = useState('2025-10-15');
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Cuaderno del Profesor</h1>
        <p className="text-gray-500 text-sm mt-1">Registro diario de asistencia y observaciones</p>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <label className="text-sm text-gray-600">Fecha:</label>
        <input 
          type="date" 
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#0e7c66] outline-none"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Alumno</th>
                <th className="text-center text-xs font-medium text-gray-500 px-4 py-3">Asistencia</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Observaciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {alumnos.slice(0, 15).map(alumno => {
                const asist = asistencia.find(a => a.alumnoId === alumno.id && a.fecha === selectedDate);
                return (
                  <tr key={alumno.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-gray-800">{alumno.nombre} {alumno.apellidos}</p>
                      <p className="text-xs text-gray-500">{grupos.find(g => g.id === alumno.grupoId)?.nombre}</p>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {asist?.estado === 'presente' && <CheckCircle className="w-5 h-5 text-emerald-500 mx-auto" />}
                      {asist?.estado === 'ausente' && <XCircle className="w-5 h-5 text-red-500 mx-auto" />}
                      {asist?.estado === 'justificada' && <AlertCircle className="w-5 h-5 text-amber-500 mx-auto" />}
                      {asist?.estado === 'retraso' && <Clock className="w-5 h-5 text-blue-500 mx-auto" />}
                      {!asist && <span className="text-xs text-gray-400">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-gray-500">{asist?.estado || 'Sin registro'}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// INFORMES VIEW
function InformesView({ alumnos, calificaciones }: { alumnos: Alumno[]; calificaciones: Calificacion[] }) {
  const aprobados = alumnos.filter(a => {
    const cals = calificaciones.filter(c => c.alumnoId === a.id);
    if (cals.length === 0) return false;
    return cals.reduce((s, c) => s + c.valor, 0) / cals.length >= 5;
  }).length;

  const suspensos = alumnos.filter(a => {
    const cals = calificaciones.filter(c => c.alumnoId === a.id);
    if (cals.length === 0) return false;
    return cals.reduce((s, c) => s + c.valor, 0) / cals.length < 5;
  }).length;

  const sinEvaluar = alumnos.length - aprobados - suspensos;
  const mediaGeneral = calificaciones.length > 0 ? (calificaciones.reduce((s, c) => s + c.valor, 0) / calificaciones.length).toFixed(1) : '0';

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Informes</h1>
        <p className="text-gray-500 text-sm mt-1">Estadísticas generales del curso</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Media general</p>
          <p className="text-3xl font-bold text-[#0e7c66] mt-1">{mediaGeneral}</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Aprobados</p>
          <p className="text-3xl font-bold text-emerald-600 mt-1">{aprobados}</p>
          <p className="text-xs text-gray-400 mt-1">{((aprobados / alumnos.length) * 100).toFixed(0)}%</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Suspensos</p>
          <p className="text-3xl font-bold text-red-600 mt-1">{suspensos}</p>
          <p className="text-xs text-gray-400 mt-1">{((suspensos / alumnos.length) * 100).toFixed(0)}%</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Sin evaluar</p>
          <p className="text-3xl font-bold text-gray-400 mt-1">{sinEvaluar}</p>
        </div>
      </div>

      {/* Distribution chart */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
        <h3 className="font-semibold text-gray-800 mb-4">Distribución de calificaciones</h3>
        <div className="flex items-end gap-2 h-40">
          {[0,1,2,3,4,5,6,7,8,9,10].map(nota => {
            const count = calificaciones.filter(c => Math.floor(c.valor) === nota).length;
            const maxCount = Math.max(...[0,1,2,3,4,5,6,7,8,9,10].map(n => calificaciones.filter(c => Math.floor(c.valor) === n).length), 1);
            const height = (count / maxCount) * 100;
            return (
              <div key={nota} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex flex-col justify-end h-32">
                  <div 
                    className={`w-full rounded-t ${nota >= 5 ? 'bg-[#0e7c66]' : 'bg-red-400'} transition-all`}
                    style={{ height: `${Math.max(height, 2)}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500">{nota}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-4">Alumnos con NEAE</h3>
        <div className="space-y-2">
          {alumnos.filter(a => a.necesidadesAE).map(a => (
            <div key={a.id} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-100">
              <div>
                <p className="text-sm font-medium text-gray-800">{a.nombre} {a.apellidos}</p>
                <p className="text-xs text-gray-500">{grupos.find(g => g.id === a.grupoId)?.nombre}</p>
              </div>
              <span className="text-xs bg-amber-200 text-amber-800 px-2 py-1 rounded-full font-medium">{a.necesidadesAE}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
