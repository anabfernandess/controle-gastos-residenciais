import type { Pessoa } from "../types/Pessoa";

const API_URL = "http://localhost:5001/api/Pessoas";

export async function listarPessoas(): Promise<Pessoa[]> {
  const resposta = await fetch(API_URL);

  

  if (!resposta.ok) {
    throw new Error("Não foi possível carregar as pessoas.");
  }

  return await resposta.json();
}


export async function cadastrarPessoa(nome: string, idade: number): Promise<void> {
  const resposta = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      nome,
      idade
    })
  });

  if (!resposta.ok) {
    throw new Error("Erro ao cadastrar pessoa.");
  }
}

export async function excluirPessoa(id: number): Promise<void> {
  const resposta = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!resposta.ok) {
    throw new Error("Não foi possível excluir a pessoa.");
  }
}

