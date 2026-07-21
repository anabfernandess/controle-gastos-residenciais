import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import Avatar from "../components/Avatar.tsx";
import Button from "../components/Button.tsx";
import { Users } from "lucide-react";
import PageHeader from "../components/PageHeader.tsx";

import Card from "../components/Card.tsx";

import {
  alertaAviso,
  alertaErro,
  alertaSucesso,
  confirmarExclusao,
} from "../services/alertService";

import {
  cadastrarPessoa,
  excluirPessoa,
  listarPessoas,
} from "../services/pessoaService";

import type { Pessoa } from "../types/Pessoa";

function Pessoas() {
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [nome, setNome] = useState("");
  const [idade, setIdade] = useState("");

  async function carregarPessoas() {
    try {
      const dados = await listarPessoas();

      setPessoas(dados);
      setErro("");
    } catch (erro) {
      console.error("Erro ao carregar pessoas:", erro);
      setErro("Não foi possível carregar as pessoas.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarPessoas();
  }, []);

  async function handleCadastrar(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const nomeFormatado = nome.trim();
    const idadeNumerica = Number(idade);

    if (!nomeFormatado) {
      await alertaAviso(
        "Nome obrigatório",
        "Informe o nome da pessoa."
      );

      return;
    }

    if (!idade || idadeNumerica < 0) {
      await alertaAviso(
        "Idade inválida",
        "Informe uma idade válida."
      );

      return;
    }

    try {
      await cadastrarPessoa(nomeFormatado, idadeNumerica);

      setNome("");
      setIdade("");

      await carregarPessoas();

      await alertaSucesso("Pessoa cadastrada!");
    } catch (erro) {
      console.error("Erro ao cadastrar pessoa:", erro);

      await alertaErro(
        "Erro",
        "Não foi possível cadastrar a pessoa."
      );
    }
  }

  async function handleExcluir(id: number) {
    const resultado = await confirmarExclusao();

    const exclusaoConfirmada =
      typeof resultado === "boolean"
        ? resultado
        : resultado.isConfirmed;

    if (!exclusaoConfirmada) {
      return;
    }

    try {
      await excluirPessoa(id);

      setPessoas((listaAtual) =>
        listaAtual.filter((pessoa) => pessoa.id !== id)
      );

      await alertaSucesso("Pessoa excluída!");
    } catch (erro) {
      console.error("Erro ao excluir pessoa:", erro);

      await alertaErro(
        "Erro",
        "Não foi possível excluir a pessoa."
      );
    }
  }

  if (carregando) {
    return (
      <main className="page-container">
        <p className="loading-message">
          Carregando pessoas...
        </p>
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
      <PageHeader
        titulo="Pessoas"
        descricao="Cadastre e gerencie os moradores da residência."
        icone={Users}
      />

      <section className="grid content-grid">
        <Card title="Cadastrar pessoa">
          <form
            className="form-grid"
            onSubmit={handleCadastrar}
          >
            <div className="form-group">
              <label htmlFor="nome">Nome</label>

              <input
                id="nome"
                type="text"
                value={nome}
                onChange={(event) =>
                  setNome(event.target.value)
                }
                placeholder="Digite o nome"
              />
            </div>

            <div className="form-group">
              <label htmlFor="idade">Idade</label>

              <input
                id="idade"
                type="number"
                min="0"
                value={idade}
                onChange={(event) =>
                  setIdade(event.target.value)
                }
                placeholder="Digite a idade"
              />
            </div>
            <Button type="submit">
              Cadastrar pessoa
            </Button>
          </form>
        </Card>

        <Card title="Pessoas cadastradas">
          {pessoas.length === 0 ? (
            <p className="empty-state">
              Nenhuma pessoa cadastrada.
            </p>
          ) : (
            <ul className="list">
              {pessoas.map((pessoa) => (
                <li
                  className="list-item"
                  key={pessoa.id}
                >
                  <div className="person-list-info">
                    <Avatar nome={pessoa.nome} />

                    <div className="list-item-content">
                      <strong>{pessoa.nome}</strong>
                      <span>{pessoa.idade} anos</span>
                    </div>
                  </div>

                  <Button
                    variant="danger"
                    type="button"
                    onClick={() => handleExcluir(pessoa.id)}
                  >
                    Excluir
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </section>
    </main>
  );
}

export default Pessoas;