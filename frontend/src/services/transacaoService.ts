import type { Transacao } from "../types/Transacao";

const API_URL = "http://localhost:5001/api/Transacoes";

export async function listarTransacoes(): Promise<Transacao[]> {
  const resposta = await fetch(API_URL);

  if (!resposta.ok) {
    throw new Error("Não foi possível carregar as transações.");
  }

  return await resposta.json();
}

export async function cadastrarTransacao(
  descricao: string,
  valor: number,
  tipo: string,
  pessoaId: number
): Promise<void> {
  const resposta = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      descricao,
      valor,
      tipo,
      pessoaId,
    }),
  });

  if (!resposta.ok) {
    throw new Error("Não foi possível cadastrar a transação.");
  }
}