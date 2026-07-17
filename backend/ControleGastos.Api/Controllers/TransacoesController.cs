using ControleGastos.Api.Data;
using ControleGastos.Api.DTOs;
using ControleGastos.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ControleGastos.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TransacoesController : ControllerBase
{
    private readonly AppDbContext _context;

    public TransacoesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TransacaoRespostaDto>>> Listar()
    {
        var transacoes = await _context.Transacoes
            .AsNoTracking()
            .Include(transacao => transacao.Pessoa)
            .Select(transacao => new TransacaoRespostaDto
            {
                Id = transacao.Id,
                Descricao = transacao.Descricao,
                Valor = transacao.Valor,
                Tipo = transacao.Tipo,
                PessoaId = transacao.PessoaId,
                PessoaNome = transacao.Pessoa.Nome
            })
            .ToListAsync();

        return Ok(transacoes);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<TransacaoRespostaDto>> ObterPorId(int id)
    {
        var transacao = await _context.Transacoes
            .AsNoTracking()
            .Include(transacao => transacao.Pessoa)
            .Where(transacao => transacao.Id == id)
            .Select(transacao => new TransacaoRespostaDto
            {
                Id = transacao.Id,
                Descricao = transacao.Descricao,
                Valor = transacao.Valor,
                Tipo = transacao.Tipo,
                PessoaId = transacao.PessoaId,
                PessoaNome = transacao.Pessoa.Nome
            })
            .FirstOrDefaultAsync();

        if (transacao is null)
        {
            return NotFound("Transação não encontrada.");
        }

        return Ok(transacao);
    }

    [HttpPost]
    public async Task<ActionResult<TransacaoRespostaDto>> Criar(
        CriarTransacaoDto dados)
    {
        if (string.IsNullOrWhiteSpace(dados.Descricao))
        {
            return BadRequest(
                "A descrição da transação é obrigatória.");
        }

        if (dados.Valor <= 0)
        {
            return BadRequest(
                "O valor deve ser maior que zero.");
        }

        var tipoNormalizado = dados.Tipo
            .Trim()
            .ToLowerInvariant();

        if (tipoNormalizado != "receita" &&
            tipoNormalizado != "despesa")
        {
            return BadRequest(
                "O tipo deve ser 'receita' ou 'despesa'.");
        }

        var pessoa = await _context.Pessoas
            .FindAsync(dados.PessoaId);

        if (pessoa is null)
        {
            return BadRequest(
                "A pessoa informada não existe.");
        }

        if (pessoa.Idade < 18 &&
            tipoNormalizado == "receita")
        {
            return BadRequest(
                "Menores de idade só podem cadastrar despesas.");
        }

        var transacao = new Transacao
        {
            Descricao = dados.Descricao.Trim(),
            Valor = dados.Valor,
            Tipo = tipoNormalizado,
            PessoaId = dados.PessoaId,
            Pessoa = pessoa
        };

        _context.Transacoes.Add(transacao);
        await _context.SaveChangesAsync();

        var resposta = new TransacaoRespostaDto
        {
            Id = transacao.Id,
            Descricao = transacao.Descricao,
            Valor = transacao.Valor,
            Tipo = transacao.Tipo,
            PessoaId = transacao.PessoaId,
            PessoaNome = pessoa.Nome
        };

        return CreatedAtAction(
            nameof(ObterPorId),
            new { id = transacao.Id },
            resposta);
    }
}