import { useEffect, useState } from "react";

import { LayoutDashboard } from "lucide-react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import Avatar from "../components/Avatar.tsx";
import Card from "../components/Card.tsx";
import EmptyState from "../components/EmptyState.tsx";
import Loading from "../components/Loading.tsx";
import PageHeader from "../components/PageHeader.tsx";
import StatCard from "../components/StatCard.tsx";

import { consultarTotais } from "../services/totaisService";

import type { ConsultaTotais } from "../types/Totais";

import { formatarMoeda } from "../utils/formatadores";

const estiloTooltip = {
  backgroundColor: "#171b22",
  border: "1px solid #343b47",
  borderRadius: "12px",
  padding: "0.75rem 0.9rem",
  boxShadow: "0 12px 28px rgba(0, 0, 0, 0.32)",
};

const estiloLabelTooltip = {
  color: "#f5f7fb",
  fontWeight: 700,
  marginBottom: "0.35rem",
};

const estiloItemTooltip = {
  color: "#cbd3df",
  fontSize: "0.85rem",
};

function Dashboard() {
  const [totais, setTotais] =
    useState<ConsultaTotais | null>(null);

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarTotais() {
      try {
        const dados = await consultarTotais();

        setTotais(dados);
        setErro("");
      } catch (erro) {
        console.error(
          "Erro ao carregar o dashboard:",
          erro
        );

        setErro(
          "Não foi possível carregar o dashboard."
        );
      } finally {
        setCarregando(false);
      }
    }

    carregarTotais();
  }, []);

  if (carregando) {
    return (
      <main className="page-container">
        <Loading message="Carregando dashboard..." />
      </main>
    );
  }

  if (erro) {
    return (
      <main className="page-container">
        <p className="error-message">{erro}</p>
      </main>
    );
  }

  if (!totais) {
    return (
      <main className="page-container">
        <EmptyState message="Nenhum dado disponível." />
      </main>
    );
  }

  const dadosResumo = [
    {
      nome: "Receitas",
      valor: totais.totalReceitas,
    },
    {
      nome: "Despesas",
      valor: totais.totalDespesas,
    },
  ];

  const dadosPessoas = totais.pessoas
    .filter((pessoa) => pessoa.totalDespesas > 0)
    .map((pessoa) => ({
      nome: pessoa.nome,
      despesas: pessoa.totalDespesas,
    }));

  return (
    <main className="page-container">
      <PageHeader
        titulo="Dashboard"
        descricao="Visão geral das receitas, despesas e saldos da residência."
        icone={LayoutDashboard}
      />

      <section className="grid summary-grid">
        <StatCard
          titulo="Total de receitas"
          valor={formatarMoeda(totais.totalReceitas)}
          tipo="receita"
        />

        <StatCard
          titulo="Total de despesas"
          valor={formatarMoeda(totais.totalDespesas)}
          tipo="despesa"
        />

        <StatCard
          titulo="Saldo líquido"
          valor={formatarMoeda(totais.saldoLiquido)}
          tipo="saldo"
        />
      </section>

      <section className="grid dashboard-charts">
        <Card title="Receitas x despesas">
          <div className="chart-card">
            {totais.totalReceitas === 0 &&
            totais.totalDespesas === 0 ? (
              <EmptyState message="Nenhuma movimentação cadastrada." />
            ) : (
              <div className="chart-container">
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <PieChart>
                    <Pie
                      data={dadosResumo}
                      dataKey="valor"
                      nameKey="nome"
                      innerRadius={70}
                      outerRadius={105}
                      paddingAngle={4}
                      animationDuration={700}
                    >
                      <Cell fill="#62d394" />
                      <Cell fill="#ff7b7b" />
                    </Pie>

                    <Tooltip
                      contentStyle={estiloTooltip}
                      labelStyle={estiloLabelTooltip}
                      itemStyle={estiloItemTooltip}
                      separator=": "
                      formatter={(valor) =>
                        formatarMoeda(Number(valor))
                      }
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}

            <div className="chart-legend">
              <span>
                <i className="legend-dot receita-dot" />
                Receitas
              </span>

              <span>
                <i className="legend-dot despesa-dot" />
                Despesas
              </span>
            </div>
          </div>
        </Card>

        <Card title="Despesas por pessoa">
          <div className="chart-card">
            {dadosPessoas.length === 0 ? (
              <EmptyState message="Nenhuma despesa cadastrada." />
            ) : (
              <div className="chart-container">
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <BarChart data={dadosPessoas}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#303640"
                    />

                    <XAxis
                      dataKey="nome"
                      stroke="#9da5b4"
                      tickLine={false}
                      axisLine={false}
                    />

                    <YAxis
                      stroke="#9da5b4"
                      tickLine={false}
                      axisLine={false}
                      width={70}
                    />

                    <Tooltip
                      cursor={{
                        fill: "rgba(255, 255, 255, 0.04)",
                      }}
                      contentStyle={estiloTooltip}
                      labelStyle={estiloLabelTooltip}
                      itemStyle={estiloItemTooltip}
                      separator=": "
                      formatter={(valor) => [
                        formatarMoeda(Number(valor)),
                        "Despesas",
                      ]}
                    />

                    <Bar
                      dataKey="despesas"
                      fill="#ff7b7b"
                      radius={[8, 8, 0, 0]}
                      animationDuration={700}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </Card>
      </section>

      <div className="dashboard-people-section">
        <Card title="Totais por pessoa">
          <div className="dashboard-people">
            {totais.pessoas.length === 0 ? (
              <EmptyState message="Nenhuma pessoa cadastrada." />
            ) : (
              <div className="grid content-grid">
                {totais.pessoas.map((pessoa) => (
                  <Card key={pessoa.pessoaId}>
                    <div className="person-card">
                      <div className="person-header">
                        <Avatar
                          nome={pessoa.nome}
                          tamanho="pequeno"
                        />

                        <h3>{pessoa.nome}</h3>
                      </div>

                      <div className="person-values">
                        <div className="value-card receita">
                          <small>Receitas</small>

                          <strong>
                            {formatarMoeda(
                              pessoa.totalReceitas
                            )}
                          </strong>
                        </div>

                        <div className="value-card despesa">
                          <small>Despesas</small>

                          <strong>
                            {formatarMoeda(
                              pessoa.totalDespesas
                            )}
                          </strong>
                        </div>

                        <div
                          className={`value-card ${
                            pessoa.saldo >= 0
                              ? "saldo-positivo"
                              : "saldo-negativo"
                          }`}
                        >
                          <small>Saldo</small>

                          <strong>
                            {formatarMoeda(pessoa.saldo)}
                          </strong>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>
    </main>
  );
}

export default Dashboard;