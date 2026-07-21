export interface TotaisPessoa {
  pessoaId: number;
  nome: string;
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
}

export interface ConsultaTotais {
  pessoas: TotaisPessoa[];
  totalReceitas: number;
  totalDespesas: number;
  saldoLiquido: number;
}