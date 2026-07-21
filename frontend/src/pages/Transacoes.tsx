import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import Badge from "../components/Badge.tsx";
import Button from "../components/Button.tsx";
import Card from "../components/Card.tsx";
import EmptyState from "../components/EmptyState.tsx";
import Loading from "../components/Loading.tsx";
import { ReceiptText } from "lucide-react";
import PageHeader from "../components/PageHeader.tsx";

import {
  alertaAviso,
  alertaErro,
  alertaSucesso,
} from "../services/alertService";

import { listarPessoas } from "../services/pessoaService";

import {
  cadastrarTransacao,
  listarTransacoes,
} from "../services/transacaoService";

import type { Pessoa } from "../types/Pessoa";
import type { Transacao } from "../types/Transacao";

import { formatarMoeda } from "../utils/formatadores";

function Transacoes() {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [tipo, setTipo] = useState("despesa");
  const [pessoaId, setPessoaId] = useState("");

  async function carregarDados() {
    try {
      const [listaPessoas, listaTransacoes] = await Promise.all([
        listarPessoas(),
        listarTransacoes(),
      ]);

      setPessoas(listaPessoas);
      setTransacoes(listaTransacoes);
      setErro("");
    } catch (erro) {
      console.error("Erro ao carregar transações:", erro);
      setErro("Não foi possível carregar as transações.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  async function handleCadastrar(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const descricaoFormatada = descricao.trim();
    const valorNumerico = Number(valor);

    if (!descricaoFormatada) {
      await alertaAviso(
        "Descrição obrigatória",
        "Informe a descrição da transação."
      );

      return;
    }

    if (!valor || valorNumerico <= 0) {
      await alertaAviso(
        "Valor inválido",
        "Informe um valor maior que zero."
      );

      return;
    }

    if (!pessoaId) {
      await alertaAviso(
        "Pessoa obrigatória",
        "Selecione uma pessoa."
      );

      return;
    }

    try {
      await cadastrarTransacao(
        descricaoFormatada,
        valorNumerico,
        tipo,
        Number(pessoaId)
      );

      setDescricao("");
      setValor("");
      setTipo("despesa");
      setPessoaId("");

      await carregarDados();

      await alertaSucesso("Transação cadastrada!");
    } catch (erro) {
      console.error("Erro ao cadastrar transação:", erro);

      await alertaErro(
        "Erro",
        "Não foi possível cadastrar a transação."
      );
    }
  }

  if (carregando) {
    return (
      <main className="page-container">
        <Loading message="Carregando transações..." />
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

  return (
    <main className="page-container">
      <div className="page-heading">
        <PageHeader
          titulo="Transações"
          descricao="Registre receitas e despesas da residência."
          icone={ReceiptText}
        />
      </div>

      <section className="grid content-grid">
        <Card title="Cadastrar transação">
          <form
            className="form-grid"
            onSubmit={handleCadastrar}
          >
            <div className="form-group">
              <label htmlFor="descricao">Descrição</label>

              <input
                id="descricao"
                type="text"
                value={descricao}
                onChange={(event) =>
                  setDescricao(event.target.value)
                }
                placeholder="Ex.: Conta de luz"
              />
            </div>

            <div className="form-group">
              <label htmlFor="valor">Valor</label>

              <input
                id="valor"
                type="number"
                min="0.01"
                step="0.01"
                value={valor}
                onChange={(event) =>
                  setValor(event.target.value)
                }
                placeholder="0,00"
              />
            </div>

            <div className="form-group">
              <label htmlFor="tipo">Tipo</label>

              <select
                id="tipo"
                value={tipo}
                onChange={(event) =>
                  setTipo(event.target.value)
                }
              >
                <option value="despesa">Despesa</option>
                <option value="receita">Receita</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="pessoa">Pessoa</label>

              <select
                id="pessoa"
                value={pessoaId}
                onChange={(event) =>
                  setPessoaId(event.target.value)
                }
              >
                <option value="">
                  Selecione uma pessoa
                </option>

                {pessoas.map((pessoa) => (
                  <option
                    key={pessoa.id}
                    value={pessoa.id}
                  >
                    {pessoa.nome}
                  </option>
                ))}
              </select>
            </div>

            <Button
              type="submit"
              disabled={pessoas.length === 0}
            >
              Cadastrar transação
            </Button>

            {pessoas.length === 0 && (
              <EmptyState message="Cadastre uma pessoa antes de registrar uma transação." />
            )}
          </form>
        </Card>

        <Card title="Transações cadastradas">
          {transacoes.length === 0 ? (
            <EmptyState message="Nenhuma transação cadastrada." />
          ) : (
            <ul className="list">
              {transacoes.map((transacao) => {
                const ehReceita =
                  transacao.tipo.toLowerCase() === "receita";

                return (
                  <li
                    className={`list-item transaction-item ${ehReceita ? "receita" : "despesa"
                      }`}
                    key={transacao.id}
                  >
                    <div className="list-item-content">
                      <strong>
                        {transacao.descricao}
                      </strong>

                      <div className="transaction-details">
                        <span>{transacao.pessoaNome}</span>

                        <Badge tipo={transacao.tipo} />
                      </div>
                    </div>

                    <strong
                      className={`transaction-value ${ehReceita ? "receita" : "despesa"
                        }`}
                    >
                      {ehReceita ? "+" : "-"}{" "}
                      {formatarMoeda(transacao.valor)}
                    </strong>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </section>
    </main>
  );
}

export default Transacoes;