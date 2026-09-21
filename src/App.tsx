import { AppProvider, useApp } from "./store";
import { Layout } from "./components/layout";
import { ToastHost } from "./components/ui";
import Panel from "./views/Panel";
import Programaciones from "./views/Programaciones";
import Curriculo from "./views/Curriculo";
import Situaciones from "./views/Situaciones";
import Unidades from "./views/Unidades";
import Temporalizacion from "./views/Temporalizacion";
import Evaluacion from "./views/Evaluacion";
import Cuaderno from "./views/Cuaderno";
import Alumnado from "./views/Alumnado";
import Informes from "./views/Informes";
import { Diversidad, Recuperacion } from "./views/Diversidad";
import Configuracion from "./views/Configuracion";

function Router() {
  const { view } = useApp();
  const key = view;
  return (
    <div key={key} className="pop">
      {view === "panel" && <Panel />}
      {view === "programaciones" && <Programaciones />}
      {view === "curriculo" && <Curriculo />}
      {view === "situaciones" && <Situaciones />}
      {view === "unidades" && <Unidades />}
      {view === "temporalizacion" && <Temporalizacion />}
      {view === "evaluacion" && <Evaluacion />}
      {view === "cuaderno" && <Cuaderno />}
      {view === "alumnado" && <Alumnado />}
      {view === "informes" && <Informes />}
      {view === "diversidad" && <Diversidad />}
      {view === "recuperacion" && <Recuperacion />}
      {view === "config" && <Configuracion />}
    </div>
  );
}

interface AppProps {
  currentUser: { id: string; nombre: string; rol: string; email: string };
  onLogout: () => void;
}

export default function App({ currentUser, onLogout }: AppProps) {
  return (
    <AppProvider>
      <Layout currentUser={currentUser} onLogout={onLogout}>
        <Router />
      </Layout>
      <ToastHost />
    </AppProvider>
  );
}
