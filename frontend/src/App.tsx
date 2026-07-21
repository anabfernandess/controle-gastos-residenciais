import type { LucideIcon } from "lucide-react";

import {
  ArrowLeftRight,
  ChartNoAxesCombined,
  House,
  Users,
  WalletCards,
} from "lucide-react";

import {
  BrowserRouter,
  NavLink,
  Route,
  Routes,
} from "react-router";

import Dashboard from "./pages/Dashboard.tsx";
import Pessoas from "./pages/Pessoas.tsx";
import Transacoes from "./pages/Transacoes.tsx";

type ItemNavegacao = {
  caminho: string;
  titulo: string;
  icone: LucideIcon;
  rotaExata?: boolean;
};

const itensNavegacao: ItemNavegacao[] = [
  {
    caminho: "/",
    titulo: "Dashboard",
    icone: ChartNoAxesCombined,
    rotaExata: true,
  },
  {
    caminho: "/pessoas",
    titulo: "Pessoas",
    icone: Users,
  },
  {
    caminho: "/transacoes",
    titulo: "Transações",
    icone: ArrowLeftRight,
  },
];

function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <header className="app-header">
          <NavLink
            className="app-brand"
            to="/"
            aria-label="Ir para o Dashboard"
          >
            <span className="app-brand-icon">
              <WalletCards size={23} />
            </span>

            <div className="app-brand-content">
              <strong>Controle de Gastos</strong>
              <span>Gestão residencial</span>
            </div>
          </NavLink>

          <nav
            className="app-nav"
            aria-label="Navegação principal"
          >
            {itensNavegacao.map((item) => {
              const Icone = item.icone;

              return (
                <NavLink
                  key={item.caminho}
                  to={item.caminho}
                  end={item.rotaExata}
                  className={({ isActive }) =>
                    isActive
                      ? "nav-link active"
                      : "nav-link"
                  }
                >
                  <span className="nav-link-indicator" />

                  <Icone
                    className="nav-link-icon"
                    size={18}
                  />

                  <span>{item.titulo}</span>
                </NavLink>
              );
            })}
          </nav>
        </header>

        <div className="app-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />

            <Route
              path="/pessoas"
              element={<Pessoas />}
            />

            <Route
              path="/transacoes"
              element={<Transacoes />}
            />
          </Routes>
        </div>

        <footer className="app-footer">
          <div>
            <House size={16} />
            <span>Controle de Gastos Residenciais</span>
          </div>

          <span>React + TypeScript + ASP.NET Core</span>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;