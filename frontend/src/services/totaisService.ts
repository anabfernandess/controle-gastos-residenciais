import type { ConsultaTotais } from "../types/Totais";

const API_URL = "http://localhost:5001/api/totais";

export async function consultarTotais(): Promise<ConsultaTotais> {
  const resposta = await fetch(API_URL);

  if (!resposta.ok) {
    throw new Error("Não foi possível carregar os totais.");
  }

  return await resposta.json();
}