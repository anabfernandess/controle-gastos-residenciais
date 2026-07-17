namespace ControleGastos.Api.DTOs;

public class ConsultaTotaisDto
{
    public List<TotaisPessoaDto> Pessoas { get; set; } = [];

    public decimal TotalReceitas { get; set; }

    public decimal TotalDespesas { get; set; }

    public decimal SaldoLiquido { get; set; }
}